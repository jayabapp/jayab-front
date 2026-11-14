import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createServer } from "node:http";
import { getEventListeners, once } from "node:events";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { gzipSync, brotliCompressSync } from "node:zlib";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const { NextRequest } = require("next/server");

// Compile the actual route/helpers; replace only framework context and network.
const harness = (fetchImpl, timeout = "1000", env = {}) => {
  const modules = new Map();
  const logs = [];
  const mocks = {
    "next-intl/server": { getLocale: async () => "fa" },
    react: { cache: (fn) => fn },
    "next/navigation": { notFound: () => { throw Object.assign(new Error(), { digest: "NEXT_HTTP_ERROR_FALLBACK;404" }); }, redirect: () => {} },
  };
  const load = (file) => {
    if (modules.has(file)) return modules.get(file).exports;
    const compiledModule = { exports: {} };
    modules.set(file, compiledModule);
    const localRequire = (specifier) => {
      if (mocks[specifier]) return mocks[specifier];
      const relative = specifier.startsWith("@/") ? specifier.slice(2)
        : specifier.startsWith("@features/") ? `features/${specifier.slice(10)}` : null;
      if (relative !== null) return load(resolve(root, relative + ".ts"));
      if (specifier.startsWith(".")) return load(resolve(dirname(file), specifier + ".ts"));
      return require(specifier);
    };
    const source = ts.transpileModule(readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    new Function("require", "module", "exports", "fetch", "process", "console", source)(
      localRequire, compiledModule, compiledModule.exports, fetchImpl,
      { env: { NEXT_PUBLIC_BASE_URL: "https://backend.invalid", NEXT_PUBLIC_WEB_SITE: "https://site.invalid", BACKEND_REQUEST_TIMEOUT_MS: timeout, BACKEND_BODY_IDLE_TIMEOUT_MS: timeout, ...env } },
      { warn: (...args) => logs.push(args), error: (...args) => logs.push(args) },
    );
    return compiledModule.exports;
  };
  const route = load(resolve(root, "app/api/backend/[...path]/route.ts"));
  const invoke = (path = ["v1", "user", "properties"], options = {}) =>
    route[options.method || "GET"](new NextRequest("https://site.invalid/api/backend/" + path.join("/"), options), { params: Promise.resolve({ path }) });
  return { load: (path) => load(resolve(root, path)), invoke, logs };
};

for (const status of [200, 400, 401, 429, 500]) {
  test(`proxy preserves upstream ${status} and safe headers`, async () => {
    const h = harness(async () => new Response('{"data":{"ok":true}}', { status, headers: { "content-type": "application/json", "retry-after": "3", "x-internal": "secret", "content-encoding": "gzip", "content-length": "999" } }));
    const response = await h.invoke();
    assert.equal(response.status, status);
    assert.deepEqual(await response.json(), { data: { ok: true } });
    assert.equal(response.headers.get("retry-after"), "3");
    for (const name of ["content-length", "content-encoding", "x-internal"]) assert.equal(response.headers.get(name), null);
  });
}

test("streamable large public JSON is never read as text/JSON/arrayBuffer", async () => {
  const payload = JSON.stringify({ data: "x".repeat(1_000_000) });
  const upstream = new Response(payload, { headers: { "content-type": "application/json" } });
  for (const name of ["text", "json", "arrayBuffer"]) upstream[name] = () => { throw new Error("Buffered!"); };
  const h = harness(async () => upstream);
  assert.equal(await (await h.invoke()).text(), payload);
});

test("authenticated JSON still scrubs tokens and sets httpOnly cookies", async () => {
  let authorization;
  const h = harness(async (_url, init) => {
    authorization = init.headers.get("authorization");
    return new Response(JSON.stringify({ data: { access_token: "private-access", socket_token: "private-socket" } }), { headers: { "content-type": "application/json" } });
  });
  const response = await h.invoke(["v1", "user", "auth", "login"], { method: "POST", headers: { cookie: "access_token=existing" } });
  assert.equal(authorization, "Bearer existing");
  assert.doesNotMatch(await response.text(), /private-access|private-socket/);
  assert.match(response.headers.get("set-cookie"), /HttpOnly/i);
  const anonymous = await h.invoke(["v1", "user", "auth", "login"], { method: "POST" });
  assert.doesNotMatch(await anonymous.text(), /private-access|private-socket/);
  assert.match(anonymous.headers.get("set-cookie"), /HttpOnly/i);
  assert.doesNotMatch(JSON.stringify(h.logs), /private-access|private-socket|existing/);
});

test("malformed buffered JSON returns a safe gateway error", async () => {
  const h = harness(async () => new Response("not-json-secret", { headers: { "content-type": "application/json" } }));
  const response = await h.invoke(["v1", "user", "auth", "login"], { method: "POST" });
  assert.equal(response.status, 502);
  assert.doesNotMatch(JSON.stringify(h.logs), /not-json-secret/);
});

const pendingFetch = (_url, init) => new Promise((_resolve, reject) => {
  if (init.signal.aborted) reject(new Error("secret URL/token"));
  else init.signal.addEventListener("abort", () => reject(new Error("secret URL/token")), { once: true });
});

test("upstream timeout returns 504, caller abort returns 499, with redacted logs", async () => {
  const h = harness(pendingFetch, "10");
  assert.equal((await h.invoke()).status, 504);
  assert.equal(h.logs[0][1].kind, "timeout");
  assert.equal(h.logs[0][1].category, "proxy");
  assert.equal(h.logs[0][1].method, "GET");
  const caller = new AbortController();
  caller.abort();
  assert.equal((await h.invoke(undefined, { signal: caller.signal })).status, 499);
  assert.doesNotMatch(JSON.stringify(h.logs), /secret|https:|token/i);
});

test("body timeout interrupts an already streaming response; client cancellation cancels upstream", async () => {
  let cancelled = false;
  const h = harness(async () => new Response(new ReadableStream({ cancel() { cancelled = true; } }), { headers: { "content-type": "application/json" } }), "15");
  await assert.rejects((await h.invoke()).text());
  assert.equal(cancelled, true);
  cancelled = false;
  const response = await h.invoke();
  await response.body.cancel();
  assert.equal(cancelled, true);
});

test("bbox requests bypass persistent cache; stable public data keeps TTL", async () => {
  const options = [];
  const h = harness(async (_url, init) => { options.push(init); return new Response('{"data":[]}'); });
  const properties = h.load("features/properties/server/property.server.ts");
  await properties.getServerPropertyPage({ bbox: "49,36,50,37" });
  await properties.getServerPropertyPage({});
  assert.equal(options[0].cache, "no-store");
  assert.equal(options[0].next, undefined);
  assert.equal(options[1].next.revalidate, 60);
});

test("serverCall preserves genuine 404 and never maps backend 500 to missing content", async () => {
  for (const status of [404, 500]) {
    const h = harness(async () => new Response("private", { status }));
    const call = h.load("helpers/serverCall.ts").default;
    if (status === 404) await assert.rejects(call("https://backend.invalid", undefined, { redirect404: true }));
    else assert.deepEqual(await call("https://backend.invalid", undefined, { redirect404: true }), { data: null });
  }
});

test("dedicated auth helper times out safely and preserves caller cancellation", async () => {
  const h = harness(pendingFetch, "10");
  const { callBackend } = h.load("utils/backendFetch.ts");
  assert.equal((await callBackend("/auth/otp", { method: "POST", body: { mobile_number: "PRIVATE" } })).status, 504);
  const caller = new AbortController();
  caller.abort();
  assert.equal((await callBackend("/auth/otp", { method: "POST", signal: caller.signal })).status, 499);
  assert.doesNotMatch(JSON.stringify(h.logs), /PRIVATE|secret|mobile_number/);
});

test("uploads have a separate deadline and forward the request body as a stream", async () => {
  let init;
  const h = harness(async (_url, options) => { init = options; return new Response('{"data":{}}', { headers: { "content-type": "application/json" } }); });
  const { backendTimeout } = h.load("utils/backendRequest.ts");
  assert.equal(backendTimeout("upload"), 195_000);
  assert.equal(backendTimeout("lookup"), 5_000);
  const response = await h.invoke(["v1", "attachments"], { method: "POST", body: "fixture-bytes", headers: { "content-type": "multipart/form-data; boundary=test" } });
  assert.equal(response.status, 200);
  assert.equal(init.duplex, "half");
  assert.ok(init.body instanceof ReadableStream);
  assert.equal(await new Response(init.body).text(), "fixture-bytes");
});

for (const [name, method, path, elapsed, expected] of [
  ["upload within 180-second client contract", "POST", ["v1", "attachments"], 150_000, 195_000],
  ["owner registration within 60-second client contract", "PUT", ["v1", "profile", "register", "owner"], 45_000, 75_000],
]) {
  test(name, async (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const h = harness(async () => {
      await new Promise((resolve) => setTimeout(resolve, elapsed));
      return new Response('{"data":{}}', { headers: { "content-type": "application/json" } });
    });
    const { backendCategory, backendTimeout } = h.load("utils/backendRequest.ts");
    assert.equal(backendTimeout(backendCategory(method, path, null)), expected);
    const pending = h.invoke(path, { method });
    await Promise.resolve(); await Promise.resolve();
    t.mock.timers.tick(elapsed);
    assert.equal((await pending).status, 200);
    t.mock.timers.reset();
  });
}

for (const media of ["Application/JSON; Charset=UTF-8", "application/problem+json", "application/vnd.jayab+json"]) {
  test(`token envelopes and normalized media: ${media}`, async () => {
    for (const payload of [
      { access_token: "SENSITIVE", socket_token: "SOCKET", data: { id: 1 } },
      { data: { auth_token: "SENSITIVE", socket_token: "SOCKET" } },
    ]) {
      const h = harness(async () => new Response(JSON.stringify(payload), { headers: { "content-type": media } }));
      const result = await h.invoke(["v1", "user", "auth", "login"], { method: "POST" });
      assert.equal(result.status, 200);
      assert.equal(result.headers.get("content-type"), media);
      assert.doesNotMatch(await result.text(), /SENSITIVE|SOCKET/);
      assert.match(result.headers.get("set-cookie"), /HttpOnly/i);
    }
  });
}

for (const status of [400, 401, 403, 429, 500]) {
  test(`safe valid/empty/malformed error bodies preserve ${status}`, async () => {
    for (const body of ["", "malformed SENSITIVE", '"SENSITIVE"', '{"status":"failed","data":null}']) {
      const h = harness(async () => new Response(body, { status, headers: { "content-type": "application/json", "retry-after": "3" } }));
      const result = await h.invoke();
      assert.equal(result.status, status);
      assert.equal(result.headers.get("retry-after"), "3");
      assert.doesNotMatch(await result.text(), /SENSITIVE/);
      assert.equal(h.logs.length, 1);
    }
  });
}

test("unexpected auth envelopes/media fail closed and authenticated public JSON never streams", async () => {
  for (const body of [
    { data: { nested: { access_token: "SENSITIVE" } } },
    { access_token: "ONE", data: { access_token: "OTHER" } },
    { access_token: "SENSITIVE", data: [] },
    { data: {} },
  ]) {
    const h = harness(async () => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } }));
    const result = await h.invoke(["v1", "user", "auth", "login"], { method: "POST" });
    assert.equal(result.status, 502);
    assert.doesNotMatch(await result.text(), /SENSITIVE|ONE|OTHER/);
  }
  for (const media of ["text/plain", "invalid", ""]) {
    const h = harness(async () => new Response('{"access_token":"SENSITIVE"}', { headers: { "content-type": media } }));
    const result = await h.invoke(undefined, { headers: { cookie: "access_token=existing" } });
    assert.equal(result.status, 502);
    assert.doesNotMatch(await result.text(), /SENSITIVE/);
  }
  const h = harness(async () => new Response('{"data":{"access_token":"SENSITIVE"}}', { headers: { "content-type": "application/json" } }));
  assert.doesNotMatch(await (await h.invoke(undefined, { headers: { cookie: "access_token=existing" } })).text(), /SENSITIVE/);
});

test("timer cleanup, caller isolation, stream-construction failure and backpressure", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const h = harness(async () => {});
  const { createBackendRequest } = h.load("utils/backendRequest.ts");
  const { constructStreamResponse, streamBackendBody } = h.load("utils/backendResponse.ts");
  const caller = new AbortController();
  const first = createBackendRequest("proxy", "GET", caller.signal, 100);
  assert.equal(getEventListeners(caller.signal, "abort").length, 1);
  const second = createBackendRequest("proxy", "GET", undefined, 100);
  caller.abort();
  assert.equal(first.signal.aborted, true);
  assert.equal(second.signal.aborted, false);
  first.close(); second.close();
  assert.equal(getEventListeners(caller.signal, "abort").length, 0);
  t.mock.timers.tick(200);
  assert.equal(second.signal.aborted, false);
  const scope = createBackendRequest("proxy", "GET", undefined, 100);
  scope.headersReceived();
  let cancelled = false;
  await assert.rejects(constructStreamResponse(new Response(new ReadableStream({ cancel() { cancelled = true; } })), scope, () => { throw new Error("construction"); }));
  assert.ok(cancelled);
  assert.ok(scope.signal.aborted);
  const slow = createBackendRequest("proxy", "GET", undefined, 100);
  slow.headersReceived();
  const body = streamBackendBody(new ReadableStream({ start(c) { c.enqueue(new Uint8Array([1])); } }), slow);
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  t.mock.timers.tick(2_000);
  assert.equal(slow.signal.aborted, false);
  await body.cancel();
  t.mock.timers.reset();
});

test("unsupported/absent media, exact allowlist and error-body timeout are fail-safe", async () => {
  const h = harness(async () => new Response('{"data":{}}'));
  const { canStreamPublicJson } = h.load("utils/backendResponse.ts");
  for (const path of [["v2", "user", "properties"], ["v1", "user", "properties", "1"], ["v1", "user", "properties", "map", "extra"]])
    assert.equal(canStreamPublicJson("GET", path, false, 200), false);
  assert.equal(canStreamPublicJson("GET", ["v1", "user", "properties"], true, 200), false);
  const response = new Response('{"access_token":"PRIVATE"}');
  response.headers.delete("content-type");
  const absent = harness(async () => response);
  assert.equal((await absent.invoke()).status, 502);
  const stalled = harness(async () => new Response(new ReadableStream({}), { status: 500, headers: { "content-type": "application/json" } }), "10");
  assert.equal((await stalled.invoke()).status, 504);
  assert.equal(stalled.logs.length, 1);
  assert.equal(stalled.logs[0][1].kind, "timeout");
  assert.equal(stalled.logs[0][1].status, 500);
});

test("real local HTTP: multipart streaming, gzip/Brotli, early rejection, truncation and disconnect", async (t) => {
  let mode = "upload";
  let upstreamClosed = false;
  let receivedBytes = 0;
  let drainCount = 0;
  const upstream = createServer(async (request, response) => {
    response.on("error", () => {});
    if (mode === "upload") {
      let prefix = "";
      let suffix = "";
      for await (const chunk of request) {
        receivedBytes += chunk.length;
        if (!prefix) prefix = chunk.toString().slice(0, 100);
        suffix = chunk.toString().slice(-40);
      }
      assert.match(prefix, /--fixture-boundary/);
      assert.match(suffix, /--fixture-boundary--/);
      response.writeHead(200, { "content-type": "application/json" });
      response.end('{"data":{"uploaded":true}}');
    } else if (mode === "reject") {
      request.resume();
      response.writeHead(401, { "content-type": "application/json" });
      response.end("malformed PRIVATE");
    } else if (mode === "gzip" || mode === "br") {
      const json = Buffer.from(JSON.stringify({ data: "payload".repeat(5000) }));
      const encoded = mode === "gzip" ? gzipSync(json) : brotliCompressSync(json);
      response.writeHead(200, { "content-type": "application/json", "content-encoding": mode, "content-length": encoded.length });
      response.end(encoded);
    } else if (mode === "backpressure") {
      response.writeHead(200, { "content-type": "application/json" });
      response.write('{"data":"');
      for (let i = 0; i < 256; i++) {
        if (!response.write("b".repeat(16384))) { drainCount++; await once(response, "drain"); }
      }
      response.end('"}');
    } else if (mode === "interrupt") {
      response.writeHead(200, { "content-type": "application/json" });
      response.write('{"data":"partial');
      setTimeout(() => response.destroy(), 20);
    } else {
      response.on("close", () => { upstreamClosed = true; });
      response.writeHead(200, { "content-type": "application/json" });
      response.write('{"data":"');
      const timer = setInterval(() => response.write("x".repeat(1024)), 5);
      response.on("close", () => clearInterval(timer));
    }
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");
  t.after(() => { upstream.closeAllConnections(); upstream.close(); });
  const backendOrigin = `http://127.0.0.1:${upstream.address().port}`;
  const h = harness(globalThis.fetch, "5000", { NEXT_PUBLIC_BASE_URL: backendOrigin });
  const proxy = createServer(async (request, response) => {
    const controller = new AbortController();
    response.on("close", () => { if (!response.writableFinished) controller.abort(); });
    try {
      const path = request.url.includes("attachments") ? ["v1", "attachments"] : ["v1", "user", "properties"];
      const result = await h.invoke(path, {
        method: request.method, headers: request.headers, signal: controller.signal,
        ...(request.method === "POST" ? { body: Readable.toWeb(request), duplex: "half" } : {}),
      });
      response.writeHead(result.status, Object.fromEntries(result.headers));
      if (result.body) await pipeline(Readable.fromWeb(result.body), response);
      else response.end();
    } catch { response.destroy(); }
  });
  proxy.listen(0, "127.0.0.1");
  await once(proxy, "listening");
  t.after(() => { proxy.closeAllConnections(); proxy.close(); });
  const origin = `http://127.0.0.1:${proxy.address().port}`;
  const prefix = '--fixture-boundary\r\nContent-Disposition: form-data; name="file"; filename="fixture.bin"\r\n\r\n';
  const suffix = "\r\n--fixture-boundary--\r\n";
  const upload = () => Readable.toWeb(Readable.from((async function* () {
    yield Buffer.from(prefix);
    for (let i = 0; i < 192; i++) {
      yield Buffer.alloc(16384, 65);
      await new Promise((resolve) => setImmediate(resolve));
    }
    yield Buffer.from(suffix);
  })()));
  let result = await fetch(origin + "/attachments", { method: "POST", body: upload(), duplex: "half", headers: { "content-type": "multipart/form-data; boundary=fixture-boundary" } });
  assert.equal(result.status, 200);
  assert.equal((await result.json()).data.uploaded, true);
  assert.equal(receivedBytes, Buffer.byteLength(prefix) + 192 * 16384 + Buffer.byteLength(suffix));
  for (mode of ["gzip", "br"]) {
    result = await fetch(origin + "/properties");
    assert.equal(result.headers.get("content-encoding"), null);
    assert.equal(result.headers.get("content-length"), null);
    assert.equal((await result.json()).data, "payload".repeat(5000));
  }
  mode = "reject";
  result = await fetch(origin + "/attachments", { method: "POST", body: upload(), duplex: "half", headers: { "content-type": "multipart/form-data; boundary=fixture-boundary" } });
  assert.equal(result.status, 401);
  assert.doesNotMatch(await result.text(), /PRIVATE/);
  mode = "backpressure";
  result = await fetch(origin + "/properties");
  const reader = result.body.getReader();
  const chunks = [];
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    chunks.push(Buffer.from(chunk.value));
    await new Promise((resolve) => setTimeout(resolve, 2));
  }
  assert.equal(JSON.parse(Buffer.concat(chunks).toString()).data.length, 256 * 16384);
  assert.ok(drainCount > 0);
  mode = "interrupt";
  result = await fetch(origin + "/properties");
  await assert.rejects(result.json());
  mode = "disconnect";
  const caller = new AbortController();
  result = await fetch(origin + "/properties", { signal: caller.signal });
  caller.abort();
  await assert.rejects(result.text());
  for (let i = 0; i < 50 && !upstreamClosed; i++) await new Promise((resolve) => setTimeout(resolve, 10));
  assert.ok(upstreamClosed);
  assert.doesNotMatch(JSON.stringify(h.logs), /PRIVATE/);
});

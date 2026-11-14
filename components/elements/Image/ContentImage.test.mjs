import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import ts from "typescript";

const require = createRequire(import.meta.url);
const rootUrl = new URL("../../../", import.meta.url);
let imageProps;
const load = (relative) => {
  const compiledModule = { exports: {} };
  const source = ts.transpileModule(readFileSync(new URL(relative, rootUrl), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const localRequire = (name) => {
    if (name === "next/image") return function ImageStub(props) {
      imageProps = props;
      const { unoptimized, ...domProps } = props;
      return React.createElement("img", domProps);
    };
    if (name === "@/utils/urls") return load("utils/urls.ts");
    return require(name);
  };
  new Function("require", "module", "exports", source)(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
};
const ContentImage = load("components/elements/Image/ContentImage.tsx").default;
const { getUploadedImageUrl } = load("features/upload/mappers/upload-image.mapper.ts");
const image = {
  id: 52316, bucket: "jayab-s3", end_point: "hot.ir-central1.arvanstorage.ir",
  path: "jayab/images/properties", name: "legacy.jpg",
  medium: "medium-v1-legacy.jpg", thumbnail: "thumbnail-legacy.jpg",
};

test("legacy URL mapping preserves original and derivative keys without probing Storage", () => {
  const base = "https://jayab-s3.hot.ir-central1.arvanstorage.ir/jayab/images/properties/";
  assert.equal(getUploadedImageUrl(image), base + "legacy.jpg");
  assert.equal(getUploadedImageUrl(image, "thumbnail"), base + image.thumbnail);
  assert.equal(getUploadedImageUrl(image, "medium"), base + image.medium);
  assert.equal(getUploadedImageUrl({ ...image, thumbnail: null }, "thumbnail"), base + image.name);
  assert.equal(getUploadedImageUrl({ ...image, end_point: "https://jayab-s3.hot.ir-central1.arvanstorage.ir/" }), base + image.name);
  assert.equal(getUploadedImageUrl("blob:preview", "thumbnail"), "blob:preview");
  assert.equal(getUploadedImageUrl({ ...image, file_location: "/local.jpg" }), "/local.jpg");
});

test("image fallbacks recover missing derivatives, stop after the placeholder, and reset for new inputs", async () => {
  const dom = new JSDOM("<div id='root'></div>");
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const previousAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById("root"));
  const props = {
    alt: "legacy photo", width: 320, height: 240, sizes: "320px", quality: 85,
    src: getUploadedImageUrl(image, "thumbnail"), originalSrc: getUploadedImageUrl(image),
    fallbackSrc: "/placeholder.svg",
  };
  const render = async (next) => act(() => root.render(React.createElement(ContentImage, next)));
  const fail = async () => act(() => document.querySelector("img").dispatchEvent(new dom.window.Event("error")));
  const current = () => document.querySelector("img").getAttribute("src");
  try {
    let errors = 0;
    await render({ ...props, onError: () => errors++ });
    assert.equal(current(), props.src);
    await fail();
    assert.equal(current(), props.originalSrc);
    assert.equal(imageProps.unoptimized, false);
    assert.equal(imageProps.sizes, "320px");
    assert.equal(imageProps.quality, 85);
    await fail();
    assert.equal(current(), "/placeholder.svg");
    assert.equal(imageProps.unoptimized, true);
    await fail();
    assert.equal(current(), "/placeholder.svg");
    assert.equal(errors, 3);

    await render({ ...props, src: "/other.jpg" });
    assert.equal(current(), "/other.jpg");
    await render(props);
    assert.equal(current(), props.src);
    await render({ ...props, src: "/other.jpg" });
    await fail();
    assert.equal(current(), props.originalSrc);
    await render({ ...props, src: "/other.jpg", originalSrc: "/updated.jpg" });
    assert.equal(current(), "/other.jpg");
    await fail();
    assert.equal(current(), "/updated.jpg");

    await render({ ...props, originalSrc: props.src });
    await fail();
    assert.equal(current(), "/placeholder.svg");

    await render({ ...props, src: undefined, originalSrc: undefined, fallbackSrc: "/avatar.svg" });
    assert.equal(current(), "/avatar.svg");
    await fail();
    assert.equal(current(), "/avatar.svg");

    await render({ ...props, src: "blob:preview" });
    assert.equal(current(), "blob:preview");
    assert.equal(imageProps.unoptimized, true);
  } finally {
    await act(() => root.unmount());
    dom.window.close();
    globalThis.window = previousWindow;
    globalThis.document = previousDocument;
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousAct;
  }
});

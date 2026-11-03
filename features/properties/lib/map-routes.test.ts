import assert from "node:assert/strict";
import test from "node:test";

import { isProxyablePath } from "@/utils/proxyAllowlist";
import { apiRoutes } from "@/utils/urls";

// The browser reaches the API only through the proxy, which allows exactly the routes
// registered in apiRoutes. The new map routes have to pass it, and nothing near them may.
test("the map routes are registered and reach the API through the proxy", () => {
  assert.equal(apiRoutes.GET_PROPERTIES_MAP, "/user/properties/map");
  assert.equal(
    apiRoutes.GET_PROPERTIES_PRICE_HISTOGRAM,
    "/user/properties/price-histogram",
  );
  assert.equal(
    apiRoutes.PROPERTY_MAP_PREVIEW(12),
    "/user/properties/12/map-preview",
  );

  assert.ok(isProxyablePath(["v1", "user", "properties", "map"]));
  assert.ok(isProxyablePath(["v1", "user", "properties", "price-histogram"]));
  assert.ok(isProxyablePath(["v1", "user", "properties", "12", "map-preview"]));
});

test("the proxy still refuses paths that only look like the map routes", () => {
  assert.equal(
    isProxyablePath(["v1", "user", "properties", "map", "x"]),
    false,
  );
  assert.equal(
    isProxyablePath(["v1", "user", "properties", "..", "map"]),
    false,
  );
  assert.equal(isProxyablePath(["v9", "user", "properties", "map"]), false);
});

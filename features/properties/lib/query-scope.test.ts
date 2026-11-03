import assert from "node:assert/strict";
import test from "node:test";

import {
  isSameMapSearch,
  listQueryKey,
  mapQueryKey,
  mapQueryScope,
} from "./query-scope";
import { normalizePropertyFilters } from "./normalize-property-filters";
import { propertyKeys } from "../api/property.keys";

const view = { bbox: "51.2,35.5,51.6,35.9", zoom: 11 };
const pinsKey = (
  filters: Record<string, string>,
  camera = view,
  locale: "fa" | "en" = "fa",
) => mapQueryKey(mapQueryScope(filters, camera, locale));

test("a page rendered with page=2 and a box is cached under the key the client asks for", () => {
  const url = {
    page: "2",
    has_pool: "1",
    bbox: "51.23451,35.5,51.6,35.9",
    filter_order: "has_pool",
  };
  assert.deepEqual(
    listQueryKey(url, "fa"),
    propertyKeys.list(normalizePropertyFilters({ ...url, locale: "fa" })),
  );
  assert.deepEqual(
    listQueryKey({ ...url, bbox: "51.2345,35.5,51.6,35.9" }, "fa"),
    listQueryKey(url, "fa"),
  );
  assert.notDeepEqual(
    listQueryKey(url, "fa"),
    listQueryKey({ ...url, page: "3" }, "fa"),
  );
  assert.notDeepEqual(listQueryKey(url, "fa"), listQueryKey(url, "en"));
});

test("the pins' key is the search and the camera, nothing presentational", () => {
  const noisy = pinsKey({
    has_pool: "1",
    page: "3",
    per_page: "10",
    sort_type: "price_asc",
    filter_order: "has_pool",
    bbox: "50,34,53,37",
  });
  assert.deepEqual(noisy, pinsKey({ has_pool: "1" }));
});

test("a different search, camera, zoom or language is a different request", () => {
  const base = pinsKey({ has_pool: "1" });
  for (const other of [
    pinsKey({ has_pool: "1", cities: "5" }),
    pinsKey({ has_pool: "1" }, { ...view, bbox: "51,35,52,36" }),
    pinsKey({ has_pool: "1" }, { ...view, zoom: 12 }),
    pinsKey({ has_pool: "1" }, view, "en"),
  ])
    assert.notDeepEqual(other, base);
});

test("the camera's fractional zoom and long box become what the server accepts", () => {
  const scope = mapQueryScope(
    {},
    { bbox: "51.23451,35.5,51.6,35.9", zoom: 11.4 },
    "fa",
  );
  assert.equal(scope.zoom, 11);
  assert.equal(scope.bbox, "51.2345,35.5,51.6,35.9");
});

test("an unreadable box has no pin request to make", () => {
  assert.equal(mapQueryScope({}, { bbox: "oops", zoom: 11 }, "fa").bbox, null);
});

test("pins carry over only inside the same search", () => {
  const scope = mapQueryScope({ cities: "6" }, view, "fa");
  const sameSearchKey = pinsKey({ cities: "6" }, { ...view, zoom: 9 });
  const otherSearchKey = pinsKey({ cities: "5" });
  assert.equal(isSameMapSearch(sameSearchKey, scope.filters), true);
  assert.equal(isSameMapSearch(otherSearchKey, scope.filters), false);
  assert.equal(isSameMapSearch(undefined, scope.filters), false);
});

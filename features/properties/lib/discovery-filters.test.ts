import assert from "node:assert/strict";
import test from "node:test";

import {
  baselineConflicts,
  canonicalizeDiscoveryFilters,
  nextFilterOrder,
  planDiscoveryNavigation,
  withoutBaseline,
} from "./discovery-filters";
import { normalizePropertyFilters } from "./normalize-property-filters";
import { countActiveFilters } from "./count-active-filters";
import { orderFilterChips } from "./filter-order";
import { withMapArea } from "./discovery-filter-policy";

test("the legacy premium alias becomes the single has_blue_tick condition", () => {
  assert.deepEqual(canonicalizeDiscoveryFilters({ is_premium: "1" }), {
    has_blue_tick: "1",
  });
  assert.deepEqual(canonicalizeDiscoveryFilters({ is_premium: 1, q: "a" }), {
    has_blue_tick: "1",
    q: "a",
  });
});

test("an explicit has_blue_tick wins over the alias, in either direction", () => {
  assert.deepEqual(
    canonicalizeDiscoveryFilters({ is_premium: "1", has_blue_tick: "1" }),
    { has_blue_tick: "1" },
  );
  assert.deepEqual(
    canonicalizeDiscoveryFilters({ has_blue_tick: "0", is_premium: "1" }),
    { has_blue_tick: "0" },
  );
});

test("an inactive alias adds no condition and filters without it are untouched", () => {
  assert.deepEqual(canonicalizeDiscoveryFilters({ is_premium: "0", a: "1" }), {
    a: "1",
  });
  const plain = { has_pool: "1" };
  assert.equal(canonicalizeDiscoveryFilters(plain), plain);
});

test("canonicalizing keeps the position of the filter so chips do not jump", () => {
  assert.deepEqual(
    Object.keys(
      canonicalizeDiscoveryFilters({ a: "1", is_premium: "1", b: "2" }),
    ),
    ["a", "has_blue_tick", "b"],
  );
});

test("the same condition under two names is requested and counted once", () => {
  const both = { is_premium: "1", has_blue_tick: "1" };
  assert.deepEqual(normalizePropertyFilters(both), { has_blue_tick: "1" });
  assert.equal(countActiveFilters(canonicalizeDiscoveryFilters(both)), 1);
  assert.deepEqual(
    normalizePropertyFilters({ is_premium: "1" }),
    normalizePropertyFilters({ has_blue_tick: "1" }),
  );
});

test("filter_order is display metadata and never reaches the search request", () => {
  assert.deepEqual(
    normalizePropertyFilters({ has_pool: "1", filter_order: "has_pool" }),
    { has_pool: "1" },
  );
});

test("a filter keeps its place while its value is edited and moves to the end when re-added", () => {
  const first = nextFilterOrder(undefined, {
    checkin: "2026-10-21",
    checkout: "2026-10-22",
    total_guests: "2",
    property_type: "1",
    pattern: "3",
  });
  assert.deepEqual(first, [
    "checkin",
    "checkout",
    "total_guests",
    "property_type",
    "pattern",
  ]);

  const edited = nextFilterOrder(first.join(","), {
    property_type: "2",
    pattern: "3",
    checkin: "2026-10-21",
    checkout: "2026-10-22",
    total_guests: "2",
  });
  assert.deepEqual(edited, first);

  const removed = nextFilterOrder(first.join(","), {
    checkin: "2026-10-21",
    checkout: "2026-10-22",
    total_guests: "2",
    pattern: "3",
  });
  assert.deepEqual(removed, ["checkin", "checkout", "total_guests", "pattern"]);

  const readded = nextFilterOrder(removed.join(","), {
    checkin: "2026-10-21",
    checkout: "2026-10-22",
    total_guests: "2",
    pattern: "3",
    property_type: "1",
  });
  assert.deepEqual(readded, [...removed, "property_type"]);
});

test("destination, sort, search text and paging are not part of the filter order", () => {
  assert.deepEqual(
    nextFilterOrder(undefined, {
      cities: "1",
      sort_type: "popular",
      q: "x",
      page: "2",
      has_pool: "0",
    }),
    ["has_pool"],
  );
});

test("the order survives the trip through the address bar and back", () => {
  const plan = planDiscoveryNavigation({
    baseline: {},
    pathname: "/rooms",
    intended: { total_guests: "2", property_type: "1", has_pool: "0" },
  });
  const url = new URLSearchParams(plan.query as Record<string, string>);
  const reloaded = Object.fromEntries(url);
  assert.equal(reloaded.filter_order, "total_guests,property_type,has_pool");

  const chips = [
    { id: "pool", queryKeys: ["has_pool"], active: true },
    { id: "type", queryKeys: ["property_type"], active: true },
    { id: "trip", queryKeys: ["checkin", "total_guests"], active: true },
    { id: "price", queryKeys: ["min_price"], active: false },
  ];
  const expected = ["trip", "type", "pool", "price"];
  assert.deepEqual(
    orderFilterChips(chips, reloaded).map(({ id }) => id),
    expected,
  );
  // Back/forward and refresh hand the same URL to the same function.
  assert.deepEqual(
    orderFilterChips(chips, { ...reloaded }).map(({ id }) => id),
    expected,
  );
});

test("a URL without filter_order keeps its deterministic query-string order", () => {
  const chips = [
    { id: "a", queryKeys: ["has_pool"], active: true },
    { id: "b", queryKeys: ["property_type"], active: true },
  ];
  assert.deepEqual(
    orderFilterChips(chips, { property_type: "1", has_pool: "1" }).map(
      ({ id }) => id,
    ),
    ["b", "a"],
  );
});

test("a chip is placed by the earliest of its keys", () => {
  const chips = [
    { id: "price", queryKeys: ["min_price", "max_price"], active: true },
    { id: "type", queryKeys: ["property_type"], active: true },
  ];
  assert.deepEqual(
    orderFilterChips(chips, {
      filter_order: "max_price,property_type,min_price",
      min_price: "1",
      max_price: "2",
      property_type: "3",
    }).map(({ id }) => id),
    ["price", "type"],
  );
});

const landing = { cities: "7", has_pool: "1" };

test("a landing keeps its path and writes only its extras to the URL", () => {
  const plan = planDiscoveryNavigation({
    baseline: landing,
    pathname: "/pool",
    intended: { ...landing, total_guests: "4", page: "3" },
  });
  assert.equal(plan.path, "/pool");
  assert.deepEqual(plan.query, {
    total_guests: "4",
    filter_order: "total_guests",
  });
});

test("dropping or contradicting a landing condition moves the request to /rooms", () => {
  const removed = planDiscoveryNavigation({
    baseline: landing,
    pathname: "/pool",
    intended: { cities: "7", total_guests: "4" },
  });
  assert.equal(removed.path, "/rooms");
  assert.deepEqual(removed.query, {
    cities: "7",
    total_guests: "4",
    filter_order: "total_guests",
  });

  const contradicted = planDiscoveryNavigation({
    baseline: landing,
    pathname: "/pool",
    intended: { ...landing, has_pool: "0" },
  });
  assert.equal(contradicted.path, "/rooms");
  assert.equal(contradicted.query.has_pool, "0");
});

test("sort and search text on a landing are not baseline conflicts", () => {
  const plan = planDiscoveryNavigation({
    baseline: landing,
    pathname: "/pool",
    intended: { ...landing, sort_type: "popular", q: "x" },
  });
  assert.equal(plan.path, "/pool");
  assert.deepEqual(plan.query, { sort_type: "popular", q: "x" });
});

test("equivalent baseline lists are not a conflict", () => {
  assert.deepEqual(
    baselineConflicts({ property_type: "1,2" }, { property_type: [2, 1] }),
    [],
  );
  assert.deepEqual(
    withoutBaseline({ property_type: "1,2" }, { property_type: "2,1", a: "1" }),
    { a: "1" },
  );
});

test("a landing declared with the legacy premium key matches the canonical URL key", () => {
  const baseline = canonicalizeDiscoveryFilters({ is_premium: "1", cities: "7" });
  assert.deepEqual(baseline, { has_blue_tick: "1", cities: "7" });
  const plan = planDiscoveryNavigation({
    baseline: baseline as Record<string, string>,
    pathname: "/premium",
    intended: { is_premium: "1", cities: "7" },
  });
  assert.equal(plan.path, "/premium");
  assert.deepEqual(plan.query, {});
});

test("a stale zero for guests or bedrooms is dropped but has_pool=0 is a real choice", () => {
  const plan = planDiscoveryNavigation({
    baseline: {},
    pathname: "/rooms",
    intended: { total_guests: 0, total_bedrooms: "0", has_pool: "0" },
  });
  assert.deepEqual(plan.query, { has_pool: "0", filter_order: "has_pool" });
});

test("an old URL carrying is_premium is rewritten with one key", () => {
  const plan = planDiscoveryNavigation({
    baseline: {},
    pathname: "/rooms",
    intended: { is_premium: "1", has_blue_tick: "1" },
  });
  assert.deepEqual(plan.query, {
    has_blue_tick: "1",
    filter_order: "has_blue_tick",
  });
});

test("searching a map area from a city landing leaves it for /rooms and keeps the non-spatial filters", () => {
  const plan = planDiscoveryNavigation({
    baseline: { cities: "5", has_pool: "1" },
    intended: withMapArea({ cities: "5", has_pool: "1" }, "51.2,35.5,51.6,35.9"),
    pathname: "/ramsar",
  });
  assert.equal(plan.path, "/rooms");
  assert.deepEqual(plan.query, {
    has_pool: "1",
    bbox: "51.2,35.5,51.6,35.9",
    filter_order: "has_pool",
  });
});

test("moving the map on /rooms stays on /rooms and does not touch filter order", () => {
  const plan = planDiscoveryNavigation({
    baseline: {},
    intended: { has_pool: "1", bbox: "51.2,35.5,51.6,35.9" },
    pathname: "/rooms",
    previousOrder: "has_pool",
  });
  assert.equal(plan.path, "/rooms");
  assert.equal(plan.query.filter_order, "has_pool");
  assert.equal(plan.query.bbox, "51.2,35.5,51.6,35.9");
});

test("the same box in any spelling shares one request key", () => {
  const a = normalizePropertyFilters({ bbox: "51.23451,35.5,51.6,35.9" });
  const b = normalizePropertyFilters({ bbox: "51.2345,35.5,51.6,35.9" });
  assert.deepEqual(a, b);
  assert.equal(normalizePropertyFilters({ bbox: "oops" }).bbox, "oops");
});

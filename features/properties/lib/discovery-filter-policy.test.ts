import assert from "node:assert/strict";
import test from "node:test";

import { countActiveFilters, countFilterGroup } from "./count-active-filters";
import {
  extraDiscoveryFilters,
  resetDiscoveryFilters,
  withMapArea,
  withoutMapArea,
} from "./discovery-filter-policy";

const destination = { cities: "1,2,3,4,5,6" };

test("cities, provinces and presentation parameters never count as extra filters", () => {
  assert.equal(
    countActiveFilters({
      ...destination,
      provinces: "10",
      province_id: "10",
      page: "3",
      per_page: "30",
      q: "ویلا",
      sort_type: "newest",
      locale: "fa",
      filter_order: "cities,has_pool,property_type",
    }),
    0,
  );
  assert.equal(countActiveFilters({ ...destination, has_pool: "1" }), 1);
});

test("reset removes applied property filters and neighbourhoods but preserves the destination", () => {
  const applied = {
    ...destination,
    provinces: "10",
    province_id: "10",
    sort_type: "newest",
    q: "ویلا",
    regions: "101,102",
    has_pool: "1",
    pool_type: "3,4",
    min_price: "2000000",
    max_price: "4000000",
    total_guests: "4",
    checkin: "2026-10-20",
    checkout: "2026-10-23",
    page: "5",
    per_page: "10",
    filter_order: "cities,has_pool",
  };
  const result = resetDiscoveryFilters(applied);
  assert.deepEqual(result, {
    ...destination,
    provinces: "10",
    province_id: "10",
    sort_type: "newest",
    q: "ویلا",
  });
  assert.equal(countActiveFilters(result), 0);
  assert.equal(applied.regions, "101,102");
});

test("a single city's neighbourhoods are filters and reset does not remove their city", () => {
  const applied = { cities: "1", regions: "101,102" };
  assert.equal(countActiveFilters(applied), 2);
  assert.deepEqual(resetDiscoveryFilters(applied), { cities: "1" });
});

test("reset preserves the landing baseline without counting its conditions as extra choices", () => {
  const defaults = { cities: "1", property_type: "7", has_pool: "1" };
  const applied = {
    ...defaults,
    regions: "101",
    total_guests: "6",
    has_discount: "1",
  };
  assert.equal(countActiveFilters(extraDiscoveryFilters(applied, defaults)), 3);
  const reset = resetDiscoveryFilters(applied, defaults);
  assert.deepEqual(reset, defaults);
  assert.equal(countActiveFilters(extraDiscoveryFilters(reset, defaults)), 0);
});

test("an override of a landing condition is counted and resets to the baseline", () => {
  const defaults = { cities: "1", property_type: "7", min_price: "1000000" };
  const applied = {
    ...defaults,
    property_type: "8",
    min_price: "2000000",
    has_pool: "0",
  };
  const extra = extraDiscoveryFilters(applied, defaults);
  assert.equal(countActiveFilters(extra), 3);
  assert.equal(countFilterGroup(extra, ["property_type"]), 1);
  assert.deepEqual(resetDiscoveryFilters(applied, defaults), defaults);
});

test("equivalent baseline lists do not create false active filters", () => {
  const filters = { property_type: [2, 1], has_pool: 1 };
  assert.deepEqual(
    extraDiscoveryFilters(filters, { property_type: "1,2", has_pool: "1" }),
    {},
  );
});

test("reset works with no applied filters and restores an unapplied draft to the same baseline", () => {
  assert.deepEqual(resetDiscoveryFilters(destination), destination);
  assert.deepEqual(resetDiscoveryFilters({}), {});
  const defaults = { cities: "1", has_pool: "1" };
  assert.deepEqual(resetDiscoveryFilters(defaults, defaults), defaults);
});

test("ranges, stay dates and combined rules retain their existing counting semantics", () => {
  const filters = {
    min_price: "1",
    max_price: "2",
    min_building_area: "10",
    max_building_area: "50",
    checkin: "2026-10-20",
    checkout: "2026-10-23",
    party: "1,2",
    pet: "3,4",
    has_pool: "0",
    welfare: "5,6",
  };
  assert.equal(countActiveFilters(filters), 8);
  assert.equal(
    countActiveFilters(filters, ["checkin", "checkout", "welfare"]),
    5,
  );
});

test("a map area is search context: reset keeps it and it is never counted", () => {
  const applied = { bbox: "51.2,35.5,51.6,35.9", has_pool: "1", page: "2" };
  assert.equal(countActiveFilters({ bbox: applied.bbox }), 0);
  assert.equal(countActiveFilters(applied), 1);
  assert.deepEqual(resetDiscoveryFilters(applied), {
    bbox: "51.2,35.5,51.6,35.9",
  });
});

test("choosing a map area replaces the named destination and its neighbourhoods", () => {
  const result = withMapArea(
    { cities: "5", provinces: "2", province_id: "2", regions: "9", has_pool: "1", page: "3" },
    "51.2,35.5,51.6,35.9",
  );
  assert.deepEqual(result, { has_pool: "1", bbox: "51.2,35.5,51.6,35.9" });
});

test("removing the map area keeps every other filter", () => {
  assert.deepEqual(
    withoutMapArea({ bbox: "51.2,35.5,51.6,35.9", has_pool: "1", q: "ویلا", page: "2" }),
    { has_pool: "1", q: "ویلا" },
  );
});

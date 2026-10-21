import assert from "node:assert/strict";
import test from "node:test";

import { mergeOrderedSearchFilters, orderFilterChips } from "./filter-order";

const chips = [
  { id: "property", queryKeys: ["property_type"], active: true },
  { id: "pool", queryKeys: ["has_pool"], active: false },
  { id: "pattern", queryKeys: ["pattern"], active: true },
  {
    id: "trip",
    queryKeys: ["checkin", "checkout", "total_guests"],
    active: true,
  },
];

test("active filters follow their selection order before idle filters", () => {
  const query = {
    checkin: "2026-10-21",
    checkout: "2026-10-22",
    total_guests: "2",
    property_type: "1",
    pattern: "3",
  };
  assert.deepEqual(
    orderFilterChips(chips, query).map(({ id }) => id),
    ["trip", "property", "pattern", "pool"],
  );
});

test("an activated filter moves ahead of idle filters without reordering older selections", () => {
  const query = {
    property_type: "1",
    pattern: "3",
    has_pool: "1",
  };
  const activated = chips.map((chip) =>
    chip.id === "pool" ? { ...chip, active: true } : chip,
  );
  assert.deepEqual(
    orderFilterChips(activated, query).map(({ id }) => id),
    ["property", "pattern", "pool", "trip"],
  );
});

test("search keeps previously selected dates ahead of inferred property filters", () => {
  const query = mergeOrderedSearchFilters(
    { checkin: "2026-10-21", checkout: "2026-10-22", total_guests: "2" },
    { property_type: "1", pattern: "3", total_guests: "4" },
  );
  assert.deepEqual(Object.keys(query), [
    "checkin",
    "checkout",
    "total_guests",
    "property_type",
    "pattern",
  ]);
  assert.equal(query.total_guests, "2");
});

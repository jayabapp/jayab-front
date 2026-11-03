import assert from "node:assert/strict";
import test from "node:test";

import { priceHistogramFilters, priceSliderMaximum } from "./price-histogram";

test("changing a price range keeps the distribution of the same search", () => {
  const base = { cities: "1,2", has_pool: "1", bbox: "51,35,52,36" };
  assert.deepEqual(
    priceHistogramFilters({
      ...base,
      min_price: "1000000",
      max_price: "5000000",
      page: "3",
      sort_type: "price_desc",
      filter_order: "has_pool,min_price",
    }),
    priceHistogramFilters(base),
  );
  assert.notDeepEqual(
    priceHistogramFilters({ ...base, total_guests: "5" }),
    priceHistogramFilters(base),
  );
});

test("prices beyond forty million and deep-linked selections fit the slider without capping the search", () => {
  assert.equal(priceSliderMaximum(65_100_000, {}), 65_500_000);
  assert.equal(priceSliderMaximum(null, { min_price: "72000000" }), 72_000_000);
  assert.equal(
    priceSliderMaximum(2_000_000, { max_price: "90000000" }),
    90_000_000,
  );
  assert.equal(priceSliderMaximum(null, {}), 40_000_000);
});

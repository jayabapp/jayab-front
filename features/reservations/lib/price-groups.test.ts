import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { groupNightsByPrice } from "./price-groups";

const nights = (prices: number[]) =>
  prices.map((price, index) => ({
    date: `2026-10-${index + 1}`,
    day_column: "normal" as const,
    base_price: price + 100_000,
    final_price: price,
    is_discounted: true,
    is_peak: false,
  }));

describe("nightly price groups", () => {
  it("combines nonconsecutive equal final rates and preserves the full rent total", () => {
    const breakdown = nights([
      2_700_000,
      ...Array<number>(4).fill(3_500_000),
      ...Array<number>(4).fill(4_500_000),
      ...Array<number>(4).fill(3_500_000),
      ...Array<number>(2).fill(5_500_000),
    ]);
    const groups = groupNightsByPrice(breakdown);
    assert.deepEqual(groups, [
      { count: 1, price: 2_700_000 },
      { count: 8, price: 3_500_000 },
      { count: 4, price: 4_500_000 },
      { count: 2, price: 5_500_000 },
    ]);
    assert.equal(
      groups.reduce((sum, group) => sum + group.count * group.price, 0),
      59_700_000,
    );
    assert.equal(
      groups.reduce((sum, group) => sum + group.count, 0),
      breakdown.length,
    );
  });

  it("handles long stays and does not mutate the quote", () => {
    const breakdown = nights(Array<number>(76).fill(3_500_000));
    const before = JSON.stringify(breakdown);
    assert.deepEqual(groupNightsByPrice(breakdown), [
      { count: 76, price: 3_500_000 },
    ]);
    assert.equal(JSON.stringify(breakdown), before);
    assert.deepEqual(groupNightsByPrice([]), []);
  });
});

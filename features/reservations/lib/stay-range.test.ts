import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isDayDisabled,
  lastSelectableCheckout,
  nightsBetween,
  selectDay,
} from "./stay-range";

const date = (value: string) => new Date(`${value}T00:00:00`);
const today = date("2026-10-06");

describe("reservation date selection", () => {
  it("allows 76 nights across multiple months in the shared calendar selector", () => {
    const reserved = new Set<string>();
    const start = selectDay(today, {}, reserved, today).range;
    const checkout = date("2026-12-21");
    assert.equal(isDayDisabled(checkout, start, reserved, today), false);
    const selected = selectDay(checkout, start, reserved, today);
    assert.equal(selected.blocked, undefined);
    assert.equal(nightsBetween(selected.range.start!, selected.range.end!), 76);
    assert.equal(lastSelectableCheckout(today, reserved), null);
  });

  it("allows checkout on the first reserved day but prevents crossing it after day 15", () => {
    const reserved = new Set(["2027-01-01", "2026-11-05"]);
    const range = { start: today };
    const checkout = date("2026-11-05");
    assert.equal(isDayDisabled(checkout, range, reserved, today), false);
    assert.equal(
      selectDay(checkout, range, reserved, today).blocked,
      undefined,
    );
    assert.equal(
      isDayDisabled(date("2026-12-21"), range, reserved, today),
      true,
    );
    assert.equal(
      selectDay(date("2026-12-21"), range, reserved, today).blocked,
      "reserved",
    );
  });

  it("still rejects reserved arrivals and past dates and lets users restart a range", () => {
    const reserved = new Set(["2026-10-10"]);
    assert.equal(
      selectDay(date("2026-10-10"), {}, reserved, today).blocked,
      "reserved",
    );
    assert.equal(
      selectDay(date("2026-10-05"), {}, reserved, today).blocked,
      "past",
    );
    const range = { start: date("2026-10-12") };
    assert.equal(
      selectDay(today, range, reserved, today).range.start?.getTime(),
      today.getTime(),
    );
  });
});

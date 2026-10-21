import assert from "node:assert/strict";
import test from "node:test";

import { tripDateLabel } from "./trip-date-label";
import { formatJalaliDisplay } from "@/helpers/intl/jalali";

const format = (value: string | number | Date | null | undefined, pattern: string) =>
  formatJalaliDisplay(value, pattern, "fa");

test("same-month trip dates display their month once", () => {
  assert.equal(
    tripDateLabel("2026-10-21", "2026-10-22", "تا", format),
    "29 تا 30 مهر",
  );
});

test("cross-month trip dates display both months", () => {
  assert.equal(
    tripDateLabel("2026-10-22", "2026-10-23", "تا", format),
    "30 مهر تا 1 آبان",
  );
});

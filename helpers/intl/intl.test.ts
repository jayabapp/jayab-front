import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatTimestamp } from "./chat-time";
import { localizeDigits, normalizeDigits } from "./digits";
import { formatJalaliDisplay } from "./jalali";
import { formatCalendarCellPriceFor, formatNumber, formatTomanAmount } from "./number";

const labels = {
  months: ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"],
  weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

describe("digits", () => {
  it("normalizes Persian and Arabic-Indic digits and leaves text alone", () => {
    assert.equal(normalizeDigits("۰۹۱۲"), "0912");
    assert.equal(normalizeDigits("٠٩١٢"), "0912");
    assert.equal(normalizeDigits("room ۲ سالن"), "room 2 سالن");
  });
  it("localizes only for Arabic", () => {
    assert.equal(localizeDigits("2026", "ar"), "٢٠٢٦");
    assert.equal(localizeDigits("2026", "fa"), "2026");
    assert.equal(localizeDigits("2026", "en"), "2026");
  });
});

describe("numbers and toman", () => {
  it("keeps the Persian look: Latin digits and commas", () => {
    assert.equal(formatNumber(1234567), "1,234,567");
    assert.equal(formatTomanAmount(2500000, "تومان"), "2,500,000 تومان");
  });
  it("prints zero and empty values as 0, never blank", () => {
    assert.equal(formatNumber(0), "0");
    assert.equal(formatNumber(null), "0");
    assert.equal(formatNumber(undefined), "0");
    assert.equal(formatTomanAmount(null, "Toman", "en"), "0 Toman");
  });
  it("Arabic uses Arabic-Indic digits and separator, the unit stays toman", () => {
    assert.equal(formatNumber(1234567, "ar"), "١٬٢٣٤٬٥٦٧");
  });
});

describe("calendar cell price", () => {
  it("is toman / 1000 rounded with no suffix", () => {
    assert.equal(formatCalendarCellPriceFor(3100000), "3100");
    assert.equal(formatCalendarCellPriceFor(2500499), "2500");
    assert.equal(formatCalendarCellPriceFor(2500500), "2501");
  });
  it("is empty without a positive price", () => {
    for (const value of [0, -5, null, undefined]) assert.equal(formatCalendarCellPriceFor(value), "");
  });
  it("only the digits change per language", () => {
    assert.equal(formatCalendarCellPriceFor(3100000, "en"), "3100");
    assert.equal(formatCalendarCellPriceFor(3100000, "ar"), "٣١٠٠");
  });
});

describe("timestamps", () => {
  it("are in Tehran time wherever the process runs", () => {
    assert.equal(formatTimestamp("2026-10-10T12:00:00Z"), "15:30 - 1405/07/18");
    // 22:00 UTC is already the next Tehran day
    assert.equal(formatTimestamp("2026-10-10T22:00:00Z"), "01:30 - 1405/07/19");
  });
  it("returns an empty string for bad input and supports an unpadded day", () => {
    assert.equal(formatTimestamp("nope"), "");
    assert.equal(formatTimestamp(null), "");
    assert.equal(formatTimestamp("2026-03-25T12:00:00Z", "fa", "numeric"), "15:30 - 1405/01/5");
  });
});

describe("jalali display", () => {
  it("keeps the Persian output for fa", () => {
    assert.equal(formatJalaliDisplay("2026-10-10T12:00:00Z", "jD jMMMM", "fa", labels), "18 مهر");
  });
  it("uses translated names and Latin digits for English", () => {
    assert.equal(formatJalaliDisplay("2026-10-10T12:00:00Z", "dddd، jD jMMMM jYYYY", "en", labels), "Saturday, 18 Mehr 1405");
  });
  it("uses Arabic-Indic digits for Arabic", () => {
    assert.equal(formatJalaliDisplay("2026-10-10T12:00:00Z", "jYYYY/jMM/jD", "ar", labels), "١٤٠٥/٠٧/١٨");
  });
});

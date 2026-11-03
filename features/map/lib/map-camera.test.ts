import assert from "node:assert/strict";
import test from "node:test";

import {
  boundsOfPoints,
  destinationKey,
  pinPrice,
  publicPoints,
} from "./map-camera";

test("the pin shortens the nightly amount to millions, two decimals at most", () => {
  assert.deepEqual(pinPrice(1_590_000, "fa"), {
    unit: "million",
    value: "۱٫۵۹",
  });
  assert.deepEqual(pinPrice(1_500_000, "fa"), {
    unit: "million",
    value: "۱٫۵",
  });
  assert.deepEqual(pinPrice(4_000_000, "fa"), { unit: "million", value: "۴" });
  assert.deepEqual(pinPrice(1_050_000, "en"), {
    unit: "million",
    value: "1.05",
  });
  assert.deepEqual(pinPrice(1_500_000, "ar"), {
    unit: "million",
    value: "١٫٥",
  });
});

test("small and very large amounts pick their own unit", () => {
  assert.deepEqual(pinPrice(800_000, "fa"), { unit: "thousand", value: "۸۰۰" });
  assert.deepEqual(pinPrice(2_500_000_000, "en"), {
    unit: "billion",
    value: "2.5",
  });
  assert.deepEqual(pinPrice(950, "fa"), { unit: "toman", value: "۹۵۰" });
});

test("rounding never leaves a unit with a value of a thousand", () => {
  assert.deepEqual(pinPrice(999_999, "en"), { unit: "million", value: "1" });
});

test("a missing, zero or broken price has no short amount", () => {
  for (const price of [null, 0, -5, Number.NaN])
    assert.equal(pinPrice(price, "fa"), null);
});

test("bounds cover every point, and nothing yields no bounds", () => {
  assert.equal(boundsOfPoints([]), null);
  assert.deepEqual(
    boundsOfPoints([
      { lat: 35.7, lng: 51.4 },
      { lat: 36.2, lng: 50.9 },
      { lat: 35.1, lng: 51.9 },
    ]),
    [50.9, 35.1, 51.9, 36.2],
  );
});

test("only listings with a public point contribute points", () => {
  const point = { lat: 1, lng: 2, radius_m: 0, precision: "exact" as const };
  assert.deepEqual(
    publicPoints([{ public_location: point }, { public_location: null }, {}]),
    [point],
  );
});

test("the destination key changes with the place and with nothing else", () => {
  assert.equal(destinationKey({ cities: "5", has_pool: "1" }), "5|||");
  assert.equal(destinationKey({ has_pool: "1" }), "|||");
  assert.notEqual(
    destinationKey({ cities: "5" }),
    destinationKey({ cities: "6" }),
  );
  assert.notEqual(
    destinationKey({ cities: "5" }),
    destinationKey({ cities: "5", regions: "9" }),
  );
});

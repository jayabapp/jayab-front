import assert from "node:assert/strict";
import test from "node:test";

import {
  boundsOfPoints,
  destinationKey,
  pinPriceLabel,
  publicPoints,
} from "./map-camera";

const words = { currency: "T", fallback: "مشاهده" };

test("the pin shows the whole nightly amount, grouped, with the currency mark", () => {
  assert.equal(pinPriceLabel(1_500_000, "fa", words), "۱,۵۰۰,۰۰۰T");
  assert.equal(pinPriceLabel(800_000, "fa", words), "۸۰۰,۰۰۰T");
  assert.equal(pinPriceLabel(1_500_000, "ar", words), "١٬٥٠٠٬٠٠٠T");
  assert.equal(pinPriceLabel(1_500_000, "en", words), "1,500,000T");
});

test("the amount is never rounded to a shorter unit", () => {
  assert.equal(pinPriceLabel(4_499_999, "en", words), "4,499,999T");
});

test("a missing, zero or broken price never becomes a number on the pin", () => {
  for (const price of [null, 0, -5, Number.NaN])
    assert.equal(pinPriceLabel(price, "fa", words), "مشاهده");
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

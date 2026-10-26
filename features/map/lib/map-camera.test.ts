import assert from "node:assert/strict";
import test from "node:test";

import {
  boundsOfPoints,
  destinationKey,
  pinPriceLabel,
  publicPoints,
} from "./map-camera";

const words = { million: "م", fallback: "مشاهده" };

test("the pin shortens millions for display and says so in the unit", () => {
  assert.equal(pinPriceLabel(4_500_000, "fa", words), "4.5 م");
  assert.equal(pinPriceLabel(12_000_000, "fa", words), "12 م");
  assert.equal(pinPriceLabel(4_500_000, "ar", words), "٤٫٥ م");
  assert.equal(pinPriceLabel(4_500_000, "en", { ...words, million: "M" }), "4.5 M");
});

test("a price below a million is shown in full", () => {
  assert.equal(pinPriceLabel(800_000, "fa", words), "800,000");
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
  assert.notEqual(destinationKey({ cities: "5" }), destinationKey({ cities: "6" }));
  assert.notEqual(destinationKey({ cities: "5" }), destinationKey({ cities: "5", regions: "9" }));
});

import assert from "node:assert/strict";
import test from "node:test";

import {
  canonicalBbox,
  clampMapZoom,
  formatBbox,
  hasUsableBbox,
  isPointLikeBbox,
  parseBbox,
} from "./bbox";

test("a valid box is read as west, south, east, north", () => {
  assert.deepEqual(parseBbox("51.2,35.5,51.6,35.9"), [51.2, 35.5, 51.6, 35.9]);
  assert.deepEqual(parseBbox(" -10 , -20 , 10 , 20 "), [-10, -20, 10, 20]);
});

test("unusable boxes are rejected, never guessed", () => {
  for (const value of [
    "",
    "1,2,3",
    "1,2,3,4,5",
    "1,,3,4",
    "NaN,2,3,4",
    "1,2,Infinity,4",
    "1e1,2,30,40",
    "a,b,c,d",
    "52,35,51,36",
    "51,36,52,35",
    "51,35,51,36",
    "-181,0,10,10",
    "0,-85.1,10,10",
    "170,0,-170,10",
  ])
    assert.equal(parseBbox(value), null, value);
  assert.equal(parseBbox(undefined), null);
  assert.equal(parseBbox(["1", "2", "3", "4"]), null);
});

test("a box is written with at most four decimals, rounded outward", () => {
  const box = parseBbox("51.23451,35.50001,51.60009,35.90004");
  assert.ok(box);
  assert.equal(formatBbox(box), "51.2345,35.5,51.6001,35.9001");
});

test("writing a box twice gives the same box", () => {
  const once = canonicalBbox("51.2345678,35.5123456,51.6,35.9");
  assert.equal(once, "51.2345,35.5123,51.6,35.9");
  assert.equal(canonicalBbox(once), once);
  assert.equal(canonicalBbox("51.2346,35.5,51.6,35.9"), "51.2346,35.5,51.6,35.9");
});

test("a camera that reports the whole world is held to the valid range", () => {
  assert.equal(formatBbox([-190, -89, 200, 89]), "-180,-85,180,85");
});

test("a broken box blocks the request instead of widening it", () => {
  assert.equal(hasUsableBbox({}), true);
  assert.equal(hasUsableBbox({ bbox: "" }), true);
  assert.equal(hasUsableBbox({ bbox: "51,35,52,36" }), true);
  assert.equal(hasUsableBbox({ bbox: "oops" }), false);
  assert.equal(hasUsableBbox({ bbox: "52,35,51,36" }), false);
});

test("zoom is a whole number inside the range the server accepts", () => {
  assert.equal(clampMapZoom(0), 2);
  assert.equal(clampMapZoom(Number.NaN), 2);
  assert.equal(clampMapZoom(11.4), 11);
  assert.equal(clampMapZoom(11.6), 12);
  assert.equal(clampMapZoom(25), 19);
});

test("a cluster from a single spot is recognised by its empty box", () => {
  assert.equal(isPointLikeBbox([51.4, 35.7, 51.4, 35.7]), true);
  assert.equal(isPointLikeBbox([51.4, 35.7, 51.41, 35.71]), false);
});

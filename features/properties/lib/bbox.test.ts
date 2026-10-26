import assert from "node:assert/strict";
import test from "node:test";

import { formatBbox, parseBbox } from "./bbox";

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

test("a formatted box reads back as the same box", () => {
  const box = parseBbox("51.2345678,35.5,51.6,35.9");
  assert.ok(box);
  assert.equal(formatBbox(box), "51.23457,35.5,51.6,35.9");
  assert.deepEqual(parseBbox(formatBbox(box)), [51.23457, 35.5, 51.6, 35.9]);
});

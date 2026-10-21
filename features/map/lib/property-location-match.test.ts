import assert from "node:assert/strict";
import { it } from "node:test";

import type { SearchedLocation } from "@/types/features/map";

import {
  findAddressNearCity,
  findCityLocation,
} from "./property-location-match";

const result = (
  title: string,
  address: string,
  x: number,
  y: number,
): SearchedLocation => ({
  title,
  address,
  location: { x, y, z: "" },
  region: "",
  neighbourhood: "",
  category: "",
  type: "",
});

it("rejects Tehran streets named after the selected city", () => {
  const tehranStreet = result("خیابان بندر انزلی", "تهران، میدان فلسطین", 51.4, 35.7);
  const anzali = result("بندر انزلی", "استان گیلان، بندر انزلی", 49.46, 37.47);

  assert.equal(
    findCityLocation([tehranStreet, anzali], "بندر انزلی", "گیلان"),
    anzali,
  );
});

it("prefers the selected neighborhood and ignores distant address matches", () => {
  const anzali = result("بندر انزلی", "استان گیلان، بندر انزلی", 49.46, 37.47);
  const tehranStreet = result("ساحل ۱۳", "تهران، خیابان بندر انزلی", 51.4, 35.7);
  const otherRegion = result("ساحل ۱۳", "گیلان، بندر انزلی، مرکز شهر", 49.45, 37.47);
  const otaba = result("ساحل ۱۳", "گیلان، بندر انزلی، اطبا", 49.47, 37.48);

  assert.equal(
    findAddressNearCity(
      [tehranStreet, otherRegion, otaba],
      anzali,
      "بندر انزلی",
      "اطبا",
      "بندر انزلی، بلوار اطبا، کوچه ساحل ۱۳",
    ),
    otaba,
  );
});

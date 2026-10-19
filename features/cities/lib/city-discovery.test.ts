import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCitySelectionQuery,
  resolveQueryCities,
  resolveQueryProvinceCities,
} from "./city-selection";
import {
  buildLocationLabel,
  currentLocationQuery,
  pickLocationQuery,
  resolveLocationFromTree,
} from "./location-label";

import type { NewCitiesListDto } from "@/api_services/city/city.interface";

const tree: NewCitiesListDto[] = [
  {
    id: 10,
    title: "استان اول",
    slug: "one",
    image: null,
    child: [
      {
        id: 1,
        title: "شهر اول",
        child: [
          { id: 101, title: "محله اول" },
          { id: 102, title: "محله دوم" },
        ],
      },
      { id: 2, title: "شهر دوم", child: [{ id: 201, title: "محله سوم" }] },
    ],
  },
  {
    id: 20,
    title: "استان دوم",
    slug: "two",
    image: null,
    child: [
      { id: 3, title: "شهر سوم" },
      { id: 4, title: "شهر چهارم" },
      { id: 5, title: "شهر پنجم" },
      { id: 6, title: "شهر ششم" },
    ],
  },
];
const words = {
  city: "شهر",
  province: "استان",
  local: "محله",
  separator: "، ",
};

test("city editing starts from the URL and ignores a destination stored for another page", () => {
  const stored = { path: "/old-landing", query: { cities: "1" } };
  assert.deepEqual(currentLocationQuery({ cities: "2,3" }, stored, "/rooms"), {
    cities: "2,3",
  });
  assert.deepEqual(currentLocationQuery({}, stored, "/rooms"), {});
});

test("a landing destination is available to both its label and the city picker", () => {
  const stored = { path: "/city-one", query: { cities: [1] } };
  const query = currentLocationQuery({}, stored, "/city-one");
  assert.deepEqual(query, { cities: "1" });
  assert.deepEqual(
    resolveQueryCities(tree, query.cities).map((city) => city.id),
    [1],
  );
  assert.equal(
    buildLocationLabel(resolveLocationFromTree(tree, query), words),
    "شهر اول",
  );
});

test("province landings and legacy province_id use the same preselection", () => {
  const query = currentLocationQuery(
    {},
    { path: "/province-one", query: { province_id: 10 } },
    "/province-one",
  );
  assert.deepEqual(query, { provinces: "10" });
  assert.equal(resolveQueryProvinceCities(tree, query.provinces).length, 2);
  assert.deepEqual(pickLocationQuery({ province_id: "20" }), {
    provinces: "20",
  });
});

test("clearing neighbourhoods does not resurrect stored neighbourhood selections", () => {
  const stored = { path: "/city-one", query: { cities: "1", regions: "101" } };
  assert.deepEqual(
    currentLocationQuery({ regions: "102" }, stored, "/city-one"),
    { cities: "1", regions: "102" },
  );
  assert.deepEqual(currentLocationQuery({}, stored, "/city-one"), {
    cities: "1",
  });
});

test("a URL destination overrides the landing fallback during browser navigation", () => {
  const stored = { path: "/city-one", query: { cities: "1" } };
  for (const cities of ["2,3", "1", "2,3"]) {
    assert.deepEqual(currentLocationQuery({ cities }, stored, "/city-one"), {
      cities,
    });
  }
});

test("changing city drops old neighbourhoods, legacy province and pagination while preserving other filters", () => {
  const base = {
    cities: "1",
    regions: "101,102",
    province_id: "10",
    page: "3",
    has_pool: "1",
  };
  const { body } = buildCitySelectionQuery(tree, [tree[0].child[1]], base);
  assert.deepEqual(body, { cities: [2], has_pool: "1" });
  assert.equal(base.regions, "101,102");
});

test("keeping a city retains only neighbourhoods belonging to the remaining selection", () => {
  const { body } = buildCitySelectionQuery(tree, [tree[0].child[0]], {
    cities: "1,2",
    regions: "101,201",
  });
  assert.deepEqual(body, { cities: [1], regions: ["101"] });
});

test("clearing all destinations removes the previous province and its neighbourhoods", () => {
  const { body, storedCities, storedProvinces } = buildCitySelectionQuery(
    tree,
    [],
    {
      provinces: "10",
      province_id: "10",
      regions: "101",
      has_pool: "1",
    },
  );
  assert.deepEqual(body, { has_pool: "1" });
  assert.deepEqual(storedCities, []);
  assert.deepEqual(storedProvinces, []);
});

test("selecting every city in a province stores the province once and can preselect it again", () => {
  const { body, storedCities, storedProvinces } = buildCitySelectionQuery(
    tree,
    tree[0].child,
    {},
  );
  assert.deepEqual(body, { provinces: [10] });
  assert.deepEqual(storedCities, []);
  assert.equal(storedProvinces.length, 1);
  assert.deepEqual(
    resolveQueryProvinceCities(tree, `${body.provinces}`).map(
      (city) => city.id,
    ),
    [1, 2],
  );
});

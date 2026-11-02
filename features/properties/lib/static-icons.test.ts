import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { describe, it } from "node:test";
import {
  LANDING_CARD_ICONS,
  OPTION_ICON_RULES,
  OVERVIEW_ICONS,
  PROPERTY_TYPE_CARD_ICONS,
  PROPERTY_TYPE_CARD_ICONS_BY_ID,
} from "../constants/static-icons";
import {
  landingStaticIcon,
  optionStaticIcon,
  propertyTypeStaticIcon,
} from "./static-icons";

import type { StaticIconRef } from "@/types/components/elements/static-icon";

const filesOf = ({ set, n }: StaticIconRef) =>
  set === "card-icons"
    ? [`icon-${n}-primary.svg`, `icon-${n}-accent.svg`].map(
        (file) => `public/assets/${set}/${file}`,
      )
    : [`icon-${n}-day.svg`, `icon-${n}-night.svg`].map(
        (file) => `public/assets/${set}/${file}`,
      );

describe("static option icons", () => {
  it("only point at files that exist for both themes", () => {
    const refs = [
      ...OPTION_ICON_RULES.map((rule) => rule.icon),
      ...PROPERTY_TYPE_CARD_ICONS.map((rule) => rule.icon),
      ...Object.values(PROPERTY_TYPE_CARD_ICONS_BY_ID),
      ...Object.values(LANDING_CARD_ICONS),
      ...Object.values(OVERVIEW_ICONS),
    ];
    for (const ref of refs)
      for (const file of filesOf(ref))
        assert.ok(existsSync(file), `${file} is missing`);
  });

  it("matches Persian titles with Arabic letters, half-spaces and spacing", () => {
    assert.deepEqual(optionStaticIcon("وای‌فای", "welfare"), {
      set: "amenities",
      n: "01",
    });
    assert.deepEqual(optionStaticIcon("پاركينگ", "welfare"), {
      set: "amenities",
      n: "05",
    });
    assert.deepEqual(optionStaticIcon("کولر  آبی", "cool_heat"), {
      set: "heating-cooling",
      n: "11",
    });
    assert.deepEqual(optionStaticIcon("ماشین لباسشویی", "kitchen"), {
      set: "kitchen-amenities",
      n: "02",
    });
  });

  it("keeps a heating title out of the pool rules", () => {
    assert.equal(
      optionStaticIcon("سیستم گرمایشی", "cool_heat")?.set,
      "heating-cooling",
    );
    assert.equal(optionStaticIcon("استخر روباز", "pool_type")?.n, "02");
    assert.equal(optionStaticIcon("استخر", "pool_type")?.n, "04");
  });

  it("returns nothing for an unknown title outside a pool group", () => {
    assert.equal(optionStaticIcon("چیزی که نیست", "welfare"), null);
  });

  it("finds home tiles by landing slug and by property type id or any-language title", () => {
    assert.deepEqual(landingStaticIcon("/animal-lover"), {
      set: "card-icons",
      n: "06",
    });
    assert.equal(landingStaticIcon("/something-new"), null);
    assert.equal(propertyTypeStaticIcon(7, "Villa")?.n, "10");
    assert.equal(propertyTypeStaticIcon(999, "Boutique hotel")?.n, "16");
    assert.equal(propertyTypeStaticIcon(999, "باغ تالار")?.n, "18");
  });
});

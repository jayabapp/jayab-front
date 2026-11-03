import assert from "node:assert/strict";
import test from "node:test";

import { getAllowedRuleIds, getRuleOptions } from "./rule-options";

const groups = {
  PARTY: [
    { id: 1, title: "Allowed", canonical_title: "مجاز" },
    { id: 2, title: "Not allowed", canonical_title: "مجاز نیست" },
    { id: 3, title: "On request", canonical_title: "با هماهنگی" },
  ],
  PET: [{ id: 9, title: "Not allowed", canonical_title: "مجاز نیست" }],
};

test("a rule is offered as the ids that mean allowed, whatever language the titles are in", () => {
  assert.equal(getAllowedRuleIds(groups.PARTY), "1,3");
  assert.equal(getAllowedRuleIds(undefined), "");
});

test("a rule with nothing allowed, or hidden by the caller, is not offered", () => {
  const titles = { party: "Party", pet: "Pet" };
  assert.deepEqual(getRuleOptions(groups, titles), [
    { queryKey: "party", title: "Party", id: "1,3" },
  ]);
  assert.deepEqual(getRuleOptions(groups, titles, ["party"]), []);
});

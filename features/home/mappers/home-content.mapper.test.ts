import { test } from "node:test";
import assert from "node:assert/strict";
import type { ContentByKeyDto } from "@/api_services/home/home.interface";
import { resolveHomeContent } from "./home-content.mapper";

const fallback = {
  title: "Home content",
  small_text: "Stays across Iran",
  full_text: "Rent directly from hosts",
};
const base: ContentByKeyDto = {
  id: 114,
  slug: "home",
  key: "homeContent",
  feature_image_id: null,
  is_active: true,
  category_id: null,
  order: null,
  view_count: 0,
  link: null,
  video_id: null,
  fields: {},
  created_at: "2026-10-11T00:00:00.000Z",
  updated_at: "2026-10-11T00:00:00.000Z",
  category: null,
  feature_image: null,
  video: null,
  attachments: [],
  title: "محتوای خانه",
  small_text: "عنوان فارسی",
  full_text: "شعار فارسی",
  html: "<p>متن فارسی</p>",
  seo: { canonicalURL: "https://jayab.org/", metaTitle: "عنوان فارسی" },
};

test("Persian continues to use the existing CMS record", () => {
  assert.equal(resolveHomeContent(base, "fa", fallback), base);
});

test("a matching CMS edition takes precedence over the built-in fallback", () => {
  const edition = {
    ...base,
    content_locale: "en" as const,
    full_text: "Edited in the CMS",
  };
  assert.equal(resolveHomeContent(edition, "en", fallback), edition);
});

test("missing editions/old API responses cannot put a Persian slogan or body in English", () => {
  for (const data of [base, { ...base, content_locale: "fa" as const }]) {
    const resolved = resolveHomeContent(data, "en", fallback);
    assert.equal(resolved?.full_text, fallback.full_text);
    assert.equal(resolved?.small_text, fallback.small_text);
    assert.equal(resolved?.html, "");
    assert.deepEqual(resolved?.seo, {
      canonicalURL: "https://jayab.org/",
      metaTitle: fallback.small_text,
      metaDescription: fallback.full_text,
    });
    assert.equal(data.html, base.html);
  }
});

test("a failed CMS read stays null so the hero can use its translated fallback", () => {
  assert.equal(resolveHomeContent(null, "ar", fallback), null);
});

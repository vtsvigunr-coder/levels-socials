// src/data/explorePlatform.test.js
import EXPLORE_PLATFORM_SLIDES from "./explorePlatform.js";

test("has exactly 4 slides with the expected ids and layout in Figma order", () => {
  expect(EXPLORE_PLATFORM_SLIDES.map((s) => s.id)).toEqual([
    "six-plus",
    "earned-access",
    "fourteen-days",
    "dashboard",
  ]);
  expect(EXPLORE_PLATFORM_SLIDES.map((s) => s.layout)).toEqual([
    "text-left",
    "card-left",
    "text-left",
    "card-left",
  ]);
});

test("every slide has at least one line and non-empty lead copy", () => {
  for (const slide of EXPLORE_PLATFORM_SLIDES) {
    expect(slide.lines.length).toBeGreaterThan(0);
    expect(slide.lead.length).toBeGreaterThan(0);
  }
});

test("accent segments land on the words highlighted orange in Figma", () => {
  const sixPlus = EXPLORE_PLATFORM_SLIDES.find((s) => s.id === "six-plus");
  const accentText = sixPlus.lines.flat().filter((seg) => seg.accent).map((seg) => seg.text).join("");
  expect(accentText).toBe("topstrategy providers");
});

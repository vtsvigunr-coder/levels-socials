// Headline line breaks match the Figma layout (422px @ Onest Medium 42/46).
// `accent` segments render in --accent orange; everything else is black.
const EXPLORE_PLATFORM_SLIDES = [
  {
    id: "six-plus",
    layout: "text-left",
    lines: [
      [{ text: "The bridge between" }],
      [{ text: "investors and " }, { text: "top", accent: true }],
      [{ text: "strategy providers", accent: true }],
    ],
    lead: "Connect capital to selected strategy providers",
  },
  {
    id: "earned-access",
    layout: "card-left",
    lines: [
      [{ text: "Built on a selection" }],
      [{ text: "standard most" }],
      [{ text: "providers " }, { text: "never pass", accent: true }],
    ],
    lead: "Every provider must pass documented criteria",
  },
  {
    id: "fourteen-days",
    layout: "text-left",
    lines: [
      [{ text: "Where serious capital" }],
      [{ text: "meets the highest" }],
      [{ text: "selection standard in" }],
      [{ text: "social trading", accent: true }],
    ],
    lead: "Selected providers for serious investor capital",
  },
  {
    id: "dashboard",
    layout: "card-left",
    lines: [
      [{ text: "Everything You Need to See" }],
      [{ text: "Before Deciding", accent: true }],
    ],
    lead: "Full provider data, performance history, and portfolio tools — all in your dashboard.",
  },
];

export default EXPLORE_PLATFORM_SLIDES;

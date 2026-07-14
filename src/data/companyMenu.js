import aboutRaw from "../assets/icons/nav/about.svg?raw";
import howItWorksRaw from "../assets/icons/nav/how-it-works.svg?raw";
import strategyProvidersRaw from "../assets/icons/nav/strategy-providers.svg?raw";
import affiliatesRaw from "../assets/icons/nav/affiliates.svg?raw";
import platformRaw from "../assets/icons/nav/platform.svg?raw";
import selectionStandardRaw from "../assets/icons/nav/selection-standard.svg?raw";
import investorsStoriesRaw from "../assets/icons/nav/investors-stories.svg?raw";

// Normalize icon colors to `currentColor` so CSS can drive them:
// grey (#949494) when inactive, white on hover.
const currentColorize = (svg) =>
  svg
    .replace(/stroke="(white|#[0-9a-fA-F]{3,6})"/g, 'stroke="currentColor"')
    .replace(/fill="white"/g, 'fill="currentColor"');

const COMPANY_MENU = [
  { id: "about", title: "About", subtitle: "Company story and mission", icon: currentColorize(aboutRaw) },
  { id: "how-it-works", title: "How It Works", subtitle: "Simple platform walkthrough", icon: currentColorize(howItWorksRaw) },
  { id: "strategy-providers", title: "Strategy Providers", subtitle: "Review selected providers", icon: currentColorize(strategyProvidersRaw) },
  { id: "affiliates", title: "Affiliates", subtitle: "Partner with us", icon: currentColorize(affiliatesRaw) },
  { id: "platform", title: "Platform", subtitle: "Explore product features", icon: currentColorize(platformRaw) },
  { id: "selection-standard", title: "Selection Standard", subtitle: "See provider criteria", icon: currentColorize(selectionStandardRaw) },
  { id: "investors-stories", title: "Investors Stories", subtitle: "Read client experiences", icon: currentColorize(investorsStoriesRaw), badge: "New" },
];

export default COMPANY_MENU;

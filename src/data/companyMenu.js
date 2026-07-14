import about from "../assets/icons/nav/about.svg";
import howItWorks from "../assets/icons/nav/how-it-works.svg";
import strategyProviders from "../assets/icons/nav/strategy-providers.svg";
import affiliates from "../assets/icons/nav/affiliates.svg";
import platform from "../assets/icons/nav/platform.svg";
import selectionStandard from "../assets/icons/nav/selection-standard.svg";
import investorsStories from "../assets/icons/nav/investors-stories.svg";

const COMPANY_MENU = [
  { id: "about", title: "About", subtitle: "Company story and mission", icon: about, active: true },
  { id: "how-it-works", title: "How It Works", subtitle: "Simple platform walkthrough", icon: howItWorks },
  { id: "strategy-providers", title: "Strategy Providers", subtitle: "Review selected providers", icon: strategyProviders },
  { id: "affiliates", title: "Affiliates", subtitle: "Partner with us", icon: affiliates },
  { id: "platform", title: "Platform", subtitle: "Explore product features", icon: platform },
  { id: "selection-standard", title: "Selection Standard", subtitle: "See provider criteria", icon: selectionStandard },
  { id: "investors-stories", title: "Investors Stories", subtitle: "Read client experiences", icon: investorsStories, badge: "New" },
];

export default COMPANY_MENU;

// FAQ category tabs — id must match a faq item's `category`, except "all".
export const FAQ_CATEGORIES = [
  { id: "all", label: "All", icon: "all" },
  { id: "getting-started", label: "Getting Started", icon: "getting-started" },
  { id: "copy-trading", label: "Copy Trading", icon: "copy-trading" },
  { id: "strategy-providers", label: "Strategy Providers", icon: "strategy-providers" },
];

const FAQ_ITEMS = [
  {
    id: "control-capital",
    category: "copy-trading",
    question: "Do I stay in control of my capital?",
    answer:
      "Yes. Capital stays in your own account — providers execute trades on your behalf, but you can pause, adjust allocation, or withdraw at any time.",
  },
  {
    id: "provider-selection",
    category: "strategy-providers",
    question: "How are strategy providers selected?",
    answer:
      "Providers must pass documented performance criteria and carry a data-backed track record before being made available",
  },
  {
    id: "returns-guaranteed",
    category: "copy-trading",
    question: "Are returns guaranteed?",
    answer:
      "No. Past performance from any provider is not a guarantee of future results — trading carries risk, and capital is at risk.",
  },
  {
    id: "provider-selection-2",
    category: "strategy-providers",
    question: "How are strategy providers selected?",
    answer:
      "Providers must pass documented performance criteria and carry a data-backed track record before being made available",
  },
  {
    id: "multiple-providers",
    category: "getting-started",
    question: "Can I connect to more than one provider?",
    answer:
      "Yes, you can follow multiple providers at once and manage your allocation across all of them from one dashboard.",
  },
  {
    id: "disconnect-provider",
    category: "getting-started",
    question: "Can I disconnect from a provider?",
    answer:
      "Yes, you can disconnect from a provider at any time — open positions are handled according to your account settings.",
  },
];

export default FAQ_ITEMS;

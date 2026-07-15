// Strategy provider cards for the Providers section carousel.
const PROVIDERS = [
  {
    id: "aurix-pulse",
    name: "Aurix - Pulse",
    strategy: "Balanced FX",
    risk: "low",
    description:
      "Automated low-drawdown system trading Gold and EURUSD in strong trends, with controlled hedging and capital preservation.",
    totalRoi: "+3077.55%",
    accuracy: "75.39%",
    drawdown: "-43.96%",
  },
  {
    id: "aureon-aos",
    name: "Aureon AOS",
    strategy: "Trend Following",
    risk: "medium",
    description:
      "Trend-following system built to capture directional moves while managing downside exposure",
    totalRoi: "+132.64%",
    accuracy: "83.56%",
    drawdown: "-22.47%",
  },
  {
    id: "wallstreet-ai",
    name: "Wallstreet AI",
    strategy: "Trend Following",
    risk: "low",
    description:
      "AI-assisted trend strategy using market signals, risk filters, and systematic trade execution",
    totalRoi: "+1241.83%",
    accuracy: "72.16%",
    drawdown: "-18.35%",
  },
];

export const RISK_LABEL = { low: "Low Risk", medium: "Medium Risk" };

export default PROVIDERS;

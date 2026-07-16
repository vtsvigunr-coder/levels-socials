import withdrawalsImg from "../assets/keynumbers/withdrawals.webp";
import investorsImg from "../assets/keynumbers/investors.webp";
import affiliatesImg from "../assets/keynumbers/affiliates.webp";

import barsChart from "../assets/keynumbers/chart-bars.svg";
import barsChartHover from "../assets/keynumbers/chart-bars-hover.svg";
import areaChart from "../assets/keynumbers/chart-area.svg";
import areaChartHover from "../assets/keynumbers/chart-area-hover.svg";
import linesChart from "../assets/keynumbers/chart-lines.svg";
import linesChartHover from "../assets/keynumbers/chart-lines-hover.svg";

// The three "Levels Socials Today" stat cards. Each shares a header
// (metric + label + Risk Disclaimer) but differs in its chart visual and
// footer. Charts crossfade to an orange variant on hover (see KeyNumbers.css).
const KEY_NUMBERS = [
  {
    id: "withdrawals",
    theme: "light",
    img: withdrawalsImg,
    metric: "$10M",
    label: "Of Withdrawals",
    chart: {
      variant: "bars",
      default: barsChart,
      hover: barsChartHover,
      tag: "+8.6%",
    },
    footer: { type: "text", text: "Capital withdrawn by investors, on demand" },
  },
  {
    id: "investors",
    theme: "dark",
    img: investorsImg,
    metric: "15,000",
    label: "Investors already participating in provider performance",
    chart: {
      variant: "area",
      default: areaChart,
      hover: areaChartHover,
      axis: ["Start", "Active Growth", "Today"],
    },
    footer: { type: "pill", text: "Active Trading Accounts" },
  },
  {
    id: "affiliates",
    theme: "dark",
    img: affiliatesImg,
    metric: "200+",
    label: "Affiliates & Partners",
    topIcon: true,
    plate: true,
    chart: {
      variant: "lines",
      default: linesChart,
      hover: linesChartHover,
    },
    footer: {
      type: "text",
      text: "Each one passed documented performance criteria before going live",
    },
  },
];

export default KEY_NUMBERS;

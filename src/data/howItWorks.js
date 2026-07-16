// "How to Get Started" step circle + tracker content — one entry per step,
// all copy taken from the Figma reference (nodes 799:15818, 789:15947,
// 799:15900). The floating card content per step lives directly in
// GetStartedSection.jsx since each step's cards differ too much in
// structure/graphics to usefully share one data shape.
const HOW_IT_WORKS_STEPS = [
  {
    id: "choose",
    number: "01",
    label: "Choose",
    tag: "Step 1",
    title: "Choose a Provider",
    description: "Review each provider's track record data",
  },
  {
    id: "connect",
    number: "02",
    label: "Connect",
    tag: "Step 2",
    title: "Connect Capital",
    description: "Link capital and follow strategy providers",
  },
  {
    id: "control",
    number: "03",
    label: "Control",
    tag: "Step 3",
    title: "Monitor Performance",
    description: "Track results and disconnect at any time",
  },
];

export default HOW_IT_WORKS_STEPS;

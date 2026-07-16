import providerEvaluationImg from "../assets/selection/provider-evaluation.webp";
import invitationOnlyImg from "../assets/selection/invitation-only.webp";
import verificationBlackImg from "../assets/selection/verification-black.webp";
import verificationWhiteImg from "../assets/selection/verification-white.webp";

// The horizontal-scroll "Selection Standard" section has 4 slides, but only 3
// distinct steps: the last slide repeats step 3's copy on a light background,
// so scrolling past it crossfades the whole section from dark to light.
const SELECTION_STEPS = [
  {
    id: "quality",
    step: 1,
    label: "Quality Standard",
    image: providerEvaluationImg,
    description: "Every provider is carefully reviewed, tested in the providers pool, and fully verified before going live",
  },
  {
    id: "invitation",
    step: 2,
    label: "By Invitation Only",
    image: invitationOnlyImg,
    description: "Every provider is handpicked. Only a select few reach the platform.",
  },
  {
    id: "verification-dark",
    step: 3,
    label: "Third Party Verification",
    image: verificationBlackImg,
    description: "MyFXBook independently verifies every provider's track record before they go live on the platform",
  },
  {
    id: "verification-light",
    step: 3,
    label: "Third Party Verification",
    image: verificationWhiteImg,
    description: "MyFXBook independently verifies every provider's track record before they go live on the platform",
  },
];

export default SELECTION_STEPS;

import { memo, useEffect, useRef } from "react";
import heroVideo from "../../assets/hero.mp4";
import heroPoster from "../../assets/hero-poster.webp";

// Shared full-screen video background. Persists across the Hero -> Providers
// scroll transition; only its blur changes. Plays once and holds the last frame.
function BackgroundVideo({ blurred = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className={`bg-video ${blurred ? "bg-video--blur" : ""}`}
      data-testid="hero-video"
      src={heroVideo}
      poster={heroPoster}
      autoPlay
      muted
      playsInline
    />
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(BackgroundVideo);

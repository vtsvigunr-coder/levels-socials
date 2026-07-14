import { useEffect, useRef, useState } from "react";
import BackgroundVideo from "../sections/Hero/BackgroundVideo.jsx";
import Hero from "../sections/Hero/Hero.jsx";
import ProvidersSection from "../sections/Providers/ProvidersSection.jsx";
import "./HomePage.css";

const LOCK_MS = 1200;

export default function HomePage() {
  const [stage, setStage] = useState(0); // 0 = hero, 1 = providers
  const stageRef = useRef(0);
  const lockedRef = useRef(false);

  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    const go = (dir) => {
      if (lockedRef.current) return;
      const cur = stageRef.current;
      const next = dir > 0 ? Math.min(1, cur + 1) : Math.max(0, cur - 1);
      if (next === cur) return;
      lockedRef.current = true;
      setStage(next);
      setTimeout(() => { lockedRef.current = false; }, LOCK_MS);
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) < 8) return;
      go(e.deltaY > 0 ? 1 : -1);
    };

    let touchY = null;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchY == null) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) > 45) { go(dy > 0 ? 1 : -1); touchY = null; }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const atProviders = stage === 1;

  return (
    <main className="home" data-testid="home" data-stage={stage}>
      <BackgroundVideo blurred={atProviders} />
      <div className="home__overlay" />

      <div className="home__stage home__stage--hero" aria-hidden={atProviders}>
        <Hero />
      </div>

      <div className="home__stage home__stage--providers" aria-hidden={!atProviders}>
        <ProvidersSection />
      </div>
    </main>
  );
}

import Header from "./Header.jsx";
import Button from "../../components/Button.jsx";
import heroVideo from "../../assets/hero.mp4";
import heroPoster from "../../assets/hero-poster.jpg";
import arrowDown from "../../assets/icons/arrow-down.svg";
import "./Hero.css";

export const HERO_LINES = ["Social Copy Trading", "Built for Transparency", "and Control"];

export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        data-testid="hero-video"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        playsInline
      />
      <div className="hero-overlay" />

      <Header />

      <h1 className="hero-title">
        {HERO_LINES.map((line) => (
          <span className="hero-line" key={line}>{line}</span>
        ))}
      </h1>

      <div className="hero-cta">
        <p className="hero-lead">
          A platform where investors connect to strategy providers and participate in
          their performance, with full data and complete capital control.
        </p>
        <Button variant="solid">Start with Levels Socials</Button>
      </div>

      <a className="hero-explore" href="#next">
        Explore more <img src={arrowDown} alt="" aria-hidden="true" />
      </a>
    </section>
  );
}

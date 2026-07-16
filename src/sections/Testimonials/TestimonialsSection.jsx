import { useState } from "react";
import TestimonialCard from "./TestimonialCard.jsx";
import TESTIMONIALS from "../../data/testimonials.js";
import logoIcon from "../../assets/logo-icon.svg";
import arrowLeft from "../../assets/testimonials/arrow-left.svg";
import arrowRight from "../../assets/testimonials/arrow-right.svg";
import "./Testimonials.css";

const CARD_W = 428;
const GAP = 20;
const STEP = CARD_W + GAP;
const SLIDE_COUNT = TESTIMONIALS.length;

export default function TestimonialsSection({ active = false }) {
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  const goNext = () => setIndex((i) => (i + 1) % SLIDE_COUNT);

  const thumbFrac = 1 / SLIDE_COUNT;
  const thumbPos = SLIDE_COUNT > 1 ? index / (SLIDE_COUNT - 1) : 0;

  return (
    <section className="testimonials" data-active={active ? "true" : "false"}>
      <div className="testimonials__inner">
        <div className="testimonials__head">
          <div className="testimonials__tag">
            <img className="testimonials__logoicon" src={logoIcon} alt="" aria-hidden="true" />
            Trust &amp; Transparency
          </div>
          <div className="testimonials__headtext">
            <h2 className="testimonials__title">See Every Trade Clearly and Keep Capital Control</h2>
            <p className="testimonials__lead">Every trade, every position, every result — visible in real time</p>
          </div>
        </div>

        <div className="testimonials__carousel">
          <div className="testimonials__viewport">
            <div className="testimonials__enter">
              <div
                className="testimonials__track"
                style={{ transform: `translate3d(${-index * STEP}px,0,0)` }}
              >
                {TESTIMONIALS.map((t) => (
                  <TestimonialCard key={t.id} testimonial={t} />
                ))}
              </div>
            </div>
          </div>

          <div className="testimonials__nav">
            <div className="testimonials__scrollbar">
              <span className="testimonials__scrolltrack" />
              <span
                className="testimonials__scrollthumb"
                style={{ width: `${(thumbFrac * 100).toFixed(3)}%`, left: `${(thumbPos * (1 - thumbFrac) * 100).toFixed(3)}%` }}
              />
            </div>
            <div className="testimonials__arrows">
              <button type="button" className="testimonials__arrowbtn" onClick={goPrev} aria-label="Previous testimonial">
                <img src={arrowLeft} alt="" aria-hidden="true" />
              </button>
              <button type="button" className="testimonials__arrowbtn" onClick={goNext} aria-label="Next testimonial">
                <img src={arrowRight} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

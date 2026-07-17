import { memo, useCallback, useEffect, useRef, useState } from "react";
import RevealLines from "../../components/RevealLines.jsx";
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
const DRAG_THRESHOLD = 4;

function TestimonialsSection({ active = false }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const dragRef = useRef(null);

  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const [trackW, setTrackW] = useState(0);
  const [dragging, setDragging] = useState(false);

  const clamp = useCallback((v, max = maxOffset) => Math.min(Math.max(v, 0), max), [maxOffset]);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const vw = viewport.clientWidth;
    const tw = track.scrollWidth;
    const max = Math.max(0, tw - vw);
    setViewportW(vw);
    setTrackW(tw);
    setMaxOffset(max);
    setOffset((o) => Math.min(o, max));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const goPrev = () => setOffset((o) => clamp(o - STEP));
  const goNext = () => setOffset((o) => clamp(o + STEP));

  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = { startX: e.clientX, startOffset: offset, moved: false };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > DRAG_THRESHOLD) drag.moved = true;
    if (drag.moved) setOffset(clamp(drag.startOffset - dx));
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const thumbFrac = trackW > 0 ? Math.min(1, viewportW / trackW) : 1 / SLIDE_COUNT;
  const thumbPos = maxOffset > 0 ? offset / maxOffset : 0;

  return (
    <section className="testimonials" data-active={active ? "true" : "false"}>
      <div className="testimonials__inner">
        <div className="testimonials__head">
          <div className="testimonials__tag">
            <img className="testimonials__logoicon" src={logoIcon} alt="" aria-hidden="true" />
            Trust &amp; Transparency
          </div>
          <div className="testimonials__headtext">
            <RevealLines
              as="h2"
              className="testimonials__title"
              lines={["See Every Trade Clearly", "and Keep Capital Control"]}
              baseDelay={0.17}
            />
            <RevealLines
              as="p"
              className="testimonials__lead"
              lines={["Every trade, every position, every result", "— visible in real time"]}
              baseDelay={0.17}
            />
          </div>
        </div>

        <div className="testimonials__carousel">
          <div className="testimonials__viewport" ref={viewportRef}>
            <div className="testimonials__enter">
              <div
                className={`testimonials__track${dragging ? " is-dragging" : ""}`}
                ref={trackRef}
                style={{ transform: `translate3d(${-offset}px,0,0)` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={dragging ? endDrag : undefined}
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
              <button type="button" className="testimonials__arrowbtn" onClick={goPrev} disabled={offset <= 0} aria-label="Previous testimonial">
                <img src={arrowLeft} alt="" aria-hidden="true" />
              </button>
              <button type="button" className="testimonials__arrowbtn" onClick={goNext} disabled={offset >= maxOffset} aria-label="Next testimonial">
                <img src={arrowRight} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(TestimonialsSection);

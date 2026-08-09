import { useEffect, useRef, useState } from "react";
import { useTestimonials } from "../context/TestimonialsContext";
import "./Testimonials.css";

function ReviewCard({ item }) {
  return (
    <article className="testimonial-card">
      <img src={item.image} alt={item.name} className="avatar" />
      <p className="quote">“{item.quote}”</p>
      <div className="stars" aria-label="5 star rating">
        ★★★★★
      </div>
      <h3>{item.name}</h3>
      {item.title ? <span>{item.title}</span> : null}
    </article>
  );
}

export default function Testimonials() {
  const { items, section } = useTestimonials();
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const loop = items.length >= 3;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let frame = 0;
    let last = performance.now();
    const speed = 36;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!paused) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (maxScroll > 4) {
          track.scrollLeft += speed * dt;

          if (loop) {
            const half = track.scrollWidth / 2;
            if (track.scrollLeft >= half) {
              track.scrollLeft -= half;
            }
          } else if (track.scrollLeft >= maxScroll - 1) {
            track.scrollLeft = 0;
          }
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [items, paused, loop]);

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <h2 className="section-title">{section.title || "Kind Words"}</h2>
        <div className="divider" />
        <p className="section-subtitle">
          {section.subtitle ||
            "Love notes from brides, celebrities, and creatives who trusted Roshani with their look."}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="container">
          <p className="portfolio-empty">No testimonials yet.</p>
        </div>
      ) : (
        <div
          className="testimonial-scroller"
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="testimonial-track">
            {items.map((item) => (
              <ReviewCard key={item.id || item.name} item={item} />
            ))}
            {loop
              ? items.map((item) => (
                  <ReviewCard
                    key={`loop-${item.id || item.name}`}
                    item={item}
                  />
                ))
              : null}
          </div>
        </div>
      )}
    </section>
  );
}

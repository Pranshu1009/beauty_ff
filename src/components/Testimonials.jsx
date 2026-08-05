import { useState } from "react";
import { TESTIMONIALS } from "../data";
import "./Testimonials.css";

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const visible = TESTIMONIALS;

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <h2 className="section-title">Kind Words</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Love notes from brides, celebrities, and creatives who trusted Roshani with their look.
        </p>

        <div className="testimonial-grid">
          {visible.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <img src={item.image} alt={item.name} className="avatar" />
              <p className="quote">“{item.quote}”</p>
              <div className="stars" aria-label="5 star rating">
                ★★★★★
              </div>
              <h3>{item.name}</h3>
              <span>{item.title}</span>
            </article>
          ))}
        </div>

        <div className="dots" role="tablist" aria-label="Testimonials pages">
          {[0, 1, 2].map((dot) => (
            <button
              key={dot}
              className={page === dot ? "dot active" : "dot"}
              aria-label={`Show testimonials page ${dot + 1}`}
              onClick={() => setPage(dot)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

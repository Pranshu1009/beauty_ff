import { useTestimonials } from "../context/TestimonialsContext";
import "./Testimonials.css";

export default function Testimonials() {
  const { items, section } = useTestimonials();

  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <h2 className="section-title">{section.title || "Kind Words"}</h2>
        <div className="divider" />
        <p className="section-subtitle">
          {section.subtitle ||
            "Love notes from brides, celebrities, and creatives who trusted Roshani with their look."}
        </p>

        <div className="testimonial-grid">
          {items.length === 0 ? (
            <p className="portfolio-empty">No testimonials yet.</p>
          ) : (
            items.map((item) => (
              <article className="testimonial-card" key={item.id || item.name}>
                <img src={item.image} alt={item.name} className="avatar" />
                <p className="quote">“{item.quote}”</p>
                <div className="stars" aria-label="5 star rating">
                  ★★★★★
                </div>
                <h3>{item.name}</h3>
                {item.title ? <span>{item.title}</span> : null}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

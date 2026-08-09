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
  const shouldMarquee = items.length > 0;

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

      {!shouldMarquee ? (
        <div className="container">
          <p className="portfolio-empty">No testimonials yet.</p>
        </div>
      ) : (
        <div className="testimonial-scroller" aria-label="Client reviews">
          <div
            className="testimonial-track"
            style={{
              "--marquee-duration": `${Math.max(items.length * 8, 24)}s`,
            }}
          >
            <div className="testimonial-group">
              {items.map((item) => (
                <ReviewCard key={item.id || item.name} item={item} />
              ))}
            </div>
            <div className="testimonial-group" aria-hidden="true">
              {items.map((item) => (
                <ReviewCard
                  key={`loop-${item.id || item.name}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

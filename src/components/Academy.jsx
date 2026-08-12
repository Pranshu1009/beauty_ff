import { Link } from "react-router-dom";
import { useAcademy } from "../context/AcademyContext";
import "./Academy.css";

const TOPICS = [
  "Bridal & soft glam foundations",
  "Camera & stage makeup technique",
  "Hair styling essentials",
  "Portfolio & client readiness",
];

function GalleryShot({ item }) {
  return (
    <figure className="academy-shot">
      <img src={item.image} alt={item.alt} loading="lazy" />
    </figure>
  );
}

export default function Academy() {
  const { items } = useAcademy();
  const loop = items.length >= 2;

  return (
    <section className="section academy-section" id="academy">
      <div className="container academy-intro">
        <p className="eyebrow">Learn the craft</p>
        <h2 className="section-title">Creative Makeup &amp; Hair Academy</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Hands-on masterclasses covering bridal soft glam, editorial technique,
          hair artistry, and on-set professionalism — built for artists ready to
          grow a luxury beauty career.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="container">
          <p className="portfolio-empty">Academy photos coming soon.</p>
        </div>
      ) : (
        <div className="academy-scroller" aria-label="Academy teaching gallery">
          <div
            className="academy-track"
            style={{
              "--academy-duration": `${Math.max(items.length * 7, 28)}s`,
              animationPlayState: loop ? undefined : "paused",
            }}
          >
            <div className="academy-group">
              {items.map((item) => (
                <GalleryShot key={item.id || item.image} item={item} />
              ))}
            </div>
            {loop ? (
              <div className="academy-group" aria-hidden="true">
                {items.map((item) => (
                  <GalleryShot
                    key={`loop-${item.id || item.image}`}
                    item={item}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="container academy-cta">
        <p className="academy-cta-label">What you’ll learn</p>
        <ul className="academy-topics">
          {TOPICS.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
        <Link to="/contact" className="btn btn-solid">
          Enquire Now
        </Link>
      </div>
    </section>
  );
}

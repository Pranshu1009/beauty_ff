import { Link } from "react-router-dom";
import PageHero from "./PageHero";
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

export default function Academy({ preview = false }) {
  const { items } = useAcademy();
  const shown = preview ? items.slice(0, 4) : items;
  const hasMore = preview && items.length > 4;

  return (
    <>
      {!preview ? (
        <PageHero
          title="Academy Gallery"
          subtitle="A look inside Creative Makeup & Hair Academy — hands-on training, bridal practice, and studio sessions."
          ctaLabel="Enquire Now"
          ctaTo="/contact"
        />
      ) : null}

      <section
        className={`section academy-section${preview ? "" : " academy-section--page"}`}
        id="academy"
      >
        {preview ? (
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
        ) : (
          <div className="container academy-intro">
            <h2 className="section-title">All Academy Photos</h2>
            <div className="divider" />
            <p className="section-subtitle">
              Browse every teaching and practice moment from the academy studio.
            </p>
          </div>
        )}

        {shown.length === 0 ? (
          <div className="container">
            <p className="portfolio-empty">Academy photos coming soon.</p>
          </div>
        ) : (
          <div className="container">
            <div
              className={`academy-grid${preview ? " academy-grid--preview" : ""}`}
              aria-label={preview ? "Academy preview gallery" : "Full academy gallery"}
            >
              {shown.map((item) => (
                <GalleryShot key={item.id || item.image} item={item} />
              ))}
            </div>
          </div>
        )}

        <div className="container academy-cta">
          {preview ? (
            <>
              <p className="academy-cta-label">What you’ll learn</p>
              <ul className="academy-topics">
                {TOPICS.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              <div className="academy-actions">
                {(hasMore || items.length > 0) && (
                  <Link to="/academy" className="btn btn-outline">
                    View all images
                  </Link>
                )}
                <Link to="/contact" className="btn btn-solid">
                  Enquire Now
                </Link>
              </div>
            </>
          ) : (
            <div className="academy-actions">
              <Link to="/#academy" className="btn btn-outline">
                Back to Academy
              </Link>
              <Link to="/contact" className="btn btn-solid">
                Enquire Now
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

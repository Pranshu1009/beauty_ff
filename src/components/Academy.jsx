import { Link } from "react-router-dom";
import { ACADEMY_GALLERY } from "../data";
import "./Academy.css";

function GalleryShot({ item }) {
  return (
    <figure className="academy-shot">
      <img src={item.src} alt={item.alt} loading="lazy" />
    </figure>
  );
}

export default function Academy() {
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

      <div className="academy-scroller" aria-label="Academy teaching gallery">
        <div
          className="academy-track"
          style={{ "--academy-duration": `${Math.max(ACADEMY_GALLERY.length * 7, 36)}s` }}
        >
          <div className="academy-group">
            {ACADEMY_GALLERY.map((item) => (
              <GalleryShot key={item.src} item={item} />
            ))}
          </div>
          <div className="academy-group" aria-hidden="true">
            {ACADEMY_GALLERY.map((item) => (
              <GalleryShot key={`loop-${item.src}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="container academy-footer">
        <ul className="academy-points">
          <li>Bridal & soft glam foundations</li>
          <li>Camera & stage makeup technique</li>
          <li>Hair styling essentials</li>
          <li>Portfolio & client readiness</li>
        </ul>
        <Link to="/contact" className="btn btn-solid">
          Enquire Now
        </Link>
      </div>
    </section>
  );
}

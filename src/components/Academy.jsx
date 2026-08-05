import { Link } from "react-router-dom";
import { IMAGES } from "../data";
import "./Academy.css";

export default function Academy() {
  return (
    <section className="section academy-section" id="academy">
      <div className="container academy-split">
        <div
          className="academy-media"
          style={{ backgroundImage: `url(${IMAGES.academy})` }}
          role="img"
          aria-label="Makeup academy training session"
        />
        <div className="academy-copy">
          <p className="eyebrow">Learn the craft</p>
          <h2>
            Creative Makeup
            <br />
            &amp; Hair Academy
          </h2>
          <p>
            Hands-on masterclasses covering bridal soft glam, editorial technique, hair artistry,
            and on-set professionalism — designed for aspiring artists ready to build a luxury
            beauty career.
          </p>
          <ul>
            <li>Bridal & soft glam foundations</li>
            <li>Camera & stage makeup technique</li>
            <li>Hair styling essentials</li>
            <li>Portfolio & client readiness</li>
          </ul>
          <Link to="/contact" className="btn btn-solid">
            Enquire Now
          </Link>
        </div>
      </div>
    </section>
  );
}

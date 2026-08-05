import Icon from "./Icon";
import { ABOUT_SPECIALTIES, IMAGES } from "../data";
import "./About.css";

export default function About({ compact = false }) {
  return (
    <section className={`about-section ${compact ? "compact" : ""}`} id="about">
      <div className="about-grid">
        <div className="about-copy fade-up">
          <h2 className="about-heading">
            <span className="about-heading-script">About</span>
            <span className="about-heading-name">ROSHANI</span>
          </h2>

          <div className="about-body">
            <p>Roshani Chaurasiya is a Professional Makeup Artist based in Mumbai.</p>
            <p>
              With a strong passion for beauty and an eye for perfection, she creates
              timeless looks that enhance natural beauty and leave a lasting impression.
            </p>
            <p>
              From television and celebrity appearances to bridal and editorial
              transformations, her work is all about elegance, precision and creativity.
            </p>
          </div>
        </div>

        <div className="about-media fade-up fade-up-delay-1">
          <img src={IMAGES.about} alt="Roshani Chaurasiya" />
        </div>
      </div>

      <div className="container specialty-row">
        {ABOUT_SPECIALTIES.map((item) => (
          <div className="specialty" key={item.label}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import "./PageHero.css";

export default function PageHero({ title, subtitle, ctaLabel = "Book Now", ctaTo = "/contact" }) {
  return (
    <section className="page-hero">
      <div className="page-hero-overlay" />
      <div className="container page-hero-content fade-up">
        <p className="eyebrow">Roshani Chaurasiya</p>
        <h1>{title}</h1>
        {subtitle && <p className="page-hero-sub">{subtitle}</p>}
        <Link to={ctaTo} className="btn btn-white">
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

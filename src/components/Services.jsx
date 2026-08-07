import { Link } from "react-router-dom";
import Icon from "./Icon";
import { SERVICES } from "../data";
import "./Services.css";

export default function Services({ limit = null, showAllLink = false }) {
  const items = limit == null ? SERVICES : SERVICES.slice(0, limit);

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <h2 className="section-title">Services</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Specialized in creating flawless looks for every occasion.
        </p>

        <div className={`services-grid${limit ? " services-grid--main" : ""}`}>
          {items.map((service) => (
            <article className="service-card" key={service.title}>
              <Icon name={service.icon} />
              <h3>{service.title}</h3>
            </article>
          ))}
        </div>

        <div className="services-cta">
          {showAllLink ? (
            <Link to="/services" className="btn btn-outline">
              All Services
            </Link>
          ) : (
            <Link to="/contact" className="btn btn-solid">
              Book Your Look
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

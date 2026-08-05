import { Link } from "react-router-dom";
import Icon from "./Icon";
import { SERVICES } from "../data";
import "./Services.css";

export default function Services() {
  return (
    <section className="section services-section" id="services">
      <div className="container">
        <h2 className="section-title">Services</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Specialized in creating flawless looks for every occasion.
        </p>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <article className="service-card" key={service.title}>
              <Icon name={service.icon} />
              <h3>{service.title}</h3>
            </article>
          ))}
        </div>

        <div className="services-cta">
          <Link to="/contact" className="btn btn-solid">
            Book Your Look
          </Link>
        </div>
      </div>
    </section>
  );
}

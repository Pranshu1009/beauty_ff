import { Link } from "react-router-dom";
import Icon from "./Icon";
import { AVAILABLE_FOR, CONTACT, NAV_LINKS } from "../data";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand-name">
            ROSHANI <em>Chaurasiya</em>
          </div>
          <p className="footer-tag">Celebrity Makeup Artist</p>
          <p className="footer-bio">
            Soft glam, camera-ready beauty, and unforgettable bridal looks crafted with love and
            precision.
          </p>
        </div>

        <div className="footer-col footer-links-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col footer-available">
          <h4>Available For</h4>
          <ul className="footer-links">
            {AVAILABLE_FOR.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="footer-col footer-follow">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a
              className="footer-social"
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <Icon name="whatsapp" />
            </a>
            <a
              className="footer-social"
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              <Icon name="instagram" />
            </a>
            <a
              className="footer-social"
              href={`tel:${CONTACT.phoneTel}`}
              aria-label="Call"
              title="Call"
            >
              <Icon name="phone" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Roshani Chaurasiya. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

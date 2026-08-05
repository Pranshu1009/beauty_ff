import { Link } from "react-router-dom";
import { AVAILABLE_FOR, INSTAGRAM_GRID, NAV_LINKS } from "../data";
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
          <h4>Follow Me</h4>
          <a
            className="ig-handle"
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            @roshanichaurasiya
          </a>
          <div className="ig-grid">
            {INSTAGRAM_GRID.map((src) => (
              <img key={src} src={src} alt="Instagram look" loading="lazy" />
            ))}
          </div>
        </div>

        <a
          className="btn btn-solid whatsapp-btn"
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
        >
          Chat on WhatsApp
        </a>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Roshani Chaurasiya. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

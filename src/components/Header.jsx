import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data";
import "./Header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="announcement">
        Now booking bridal season &amp; destination glam — limited slots available
      </div>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-name">
              ROSHANI <em>Chaurasiya</em>
            </span>
            <span className="brand-tag">Celebrity Makeup Artist</span>
          </Link>

          <nav className={`nav ${open ? "open" : ""}`} aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                end={link.path === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/contact" className="btn btn-solid book-btn">
              Book Now
            </Link>
            <button
              className={`menu-toggle ${open ? "open" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

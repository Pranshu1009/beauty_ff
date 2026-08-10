import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "../data";
import { useAuth } from "../context/AuthContext";
import { useAnnouncement } from "../context/AnnouncementContext";
import "./Header.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isOwner, logout } = useAuth();
  const { text: announcementText } = useAnnouncement();
  const banner =
    announcementText ||
    "Now booking bridal season & destination glam — limited slots available";

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
      <div className="announcement" role="status" aria-live="polite">
        <div className="announcement-track">
          <span className="announcement-item">{banner}</span>
          <span className="announcement-item" aria-hidden="true">
            {banner}
          </span>
          <span className="announcement-item" aria-hidden="true">
            {banner}
          </span>
          <span className="announcement-item" aria-hidden="true">
            {banner}
          </span>
        </div>
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
            {isOwner ? (
              <>
                <NavLink to="/admin" className="nav-link owner-link">
                  Admin
                </NavLink>
                <button type="button" className="nav-link owner-link owner-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/admin/login" className="nav-link owner-link">
                Owner Login
              </NavLink>
            )}
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

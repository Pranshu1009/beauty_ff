import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PORTFOLIO_ITEMS, PORTFOLIO_TABS } from "../data";
import "./Portfolio.css";

export default function Portfolio({ limit = 5, showAllLink = true }) {
  const [active, setActive] = useState("Celebrity");

  const items = useMemo(() => {
    const filtered = PORTFOLIO_ITEMS.filter((item) => item.category === active);
    const rest = PORTFOLIO_ITEMS.filter((item) => item.category !== active);
    return [...filtered, ...rest].slice(0, limit);
  }, [active, limit]);

  return (
    <section className="section portfolio-section" id="portfolio">
      <div className="container">
        <h2 className="section-title">Portfolio</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Every face tells a story, I just enhance it.
        </p>

        <div className="portfolio-tabs" role="tablist">
          {PORTFOLIO_TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={active === tab}
              className={active === tab ? "tab active" : "tab"}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {items.map((item, index) => (
            <article
              className="portfolio-card fade-up"
              style={{ animationDelay: `${index * 0.08}s` }}
              key={item.id}
            >
              <img src={item.image} alt={item.title} />
              <div className="portfolio-meta">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>

        {showAllLink && (
          <div className="portfolio-cta">
            <Link to="/portfolio" className="btn btn-outline">
              View All Work
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

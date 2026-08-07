import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import "./Portfolio.css";

export default function Portfolio({ limit = 5, showAllLink = true }) {
  const { items, categories } = usePortfolio();
  const [active, setActive] = useState(categories[0] || "Celebrity");

  const visible = useMemo(() => {
    const filtered = items.filter((item) => item.category === active);
    if (limit == null) return filtered;
    return filtered.slice(0, limit);
  }, [items, active, limit]);

  return (
    <section className="section portfolio-section" id="portfolio">
      <div className="container">
        <h2 className="section-title">Portfolio</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Every face tells a story, I just enhance it.
        </p>

        <div className="portfolio-tabs" role="tablist">
          {categories.map((tab) => (
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
          {visible.length === 0 ? (
            <p className="portfolio-empty">No looks in this category yet.</p>
          ) : (
            visible.map((item, index) => (
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
            ))
          )}
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

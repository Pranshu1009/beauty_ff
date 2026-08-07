import StatsBar from "./StatsBar";
import { TV_STATS } from "../data";
import { useShowWork } from "../context/ShowWorkContext";
import "./TVWork.css";

export default function TVWork() {
  const { items } = useShowWork();

  return (
    <section className="section tv-section" id="tv-work">
      <div className="container">
        <h2 className="section-title">Celebrity & TV Work</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Proud to be a part of amazing shows and memorable moments.
        </p>

        <div className="show-grid">
          {items.length === 0 ? (
            <p className="portfolio-empty">No TV work added yet.</p>
          ) : (
            items.map((show) => (
              <article className="show-card" key={show.id}>
                <div className="show-media">
                  <img src={show.image} alt={show.title} loading="lazy" />
                  <div className="show-overlay">
                    <h3>{show.title}</h3>
                    {show.subtitle ? <p>{show.subtitle}</p> : null}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <StatsBar stats={TV_STATS} variant="section" />
      </div>
    </section>
  );
}

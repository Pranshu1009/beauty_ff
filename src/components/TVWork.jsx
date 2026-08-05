import StatsBar from "./StatsBar";
import { TV_STATS } from "../data";
import "./TVWork.css";

const SHOW_CARDS = [
  {
    title: "Indian Idol",
    subtitle: "Seasons 13 – 15",
    image: "/images/tv-1.jpg?v=shows1",
  },
  {
    title: "Dance Deewane",
    subtitle: "National dance reality",
    image: "/images/tv-2.jpg?v=shows1",
  },
  {
    title: "Superstar Singer",
    subtitle: "Season 3",
    image: "/images/tv-3.jpg?v=shows1",
  },
  {
    title: "Battle of Bands",
    subtitle: "Live music competition",
    image: "/images/tv-4.jpg?v=shows1",
  },
  {
    title: "Bharat Ka Amrit Kalash",
    subtitle: "National celebration",
    image: "/images/tv-5.jpg?v=shows1",
  },
];

export default function TVWork() {
  return (
    <section className="section tv-section" id="tv-work">
      <div className="container">
        <h2 className="section-title">Celebrity & TV Work</h2>
        <div className="divider" />
        <p className="section-subtitle">
          Proud to be a part of amazing shows and memorable moments.
        </p>

        <div className="show-grid">
          {SHOW_CARDS.map((show) => (
            <article className="show-card" key={show.title}>
              <div className="show-media">
                <img src={show.image} alt={show.title} loading="lazy" />
                <div className="show-overlay">
                  <h3>{show.title}</h3>
                  <p>{show.subtitle}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <StatsBar stats={TV_STATS} variant="section" />
      </div>
    </section>
  );
}

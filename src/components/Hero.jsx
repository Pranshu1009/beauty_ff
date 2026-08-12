import { Link } from "react-router-dom";
import StatsBar from "./StatsBar";
import { HERO_STATS } from "../data";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-stage">
        <div className="hero-copy">
          <h1>
            <span className="hero-firstname">ROSHANI</span>
            <span className="hero-surname">
              <span className="hero-surname-text">Chaurasiya</span>
            </span>
          </h1>
          <p className="hero-role">Celebrity Makeup Artist</p>
          <p className="hero-cats">Bridal | Editorial | Fashion | TV & Film</p>

          <Link to="/contact" className="hero-book">
            Book Appointment
          </Link>

          <Link to="/portfolio" className="hero-portfolio">
            View Portfolio
            <span className="hero-arrow" aria-hidden="true">
              ›
            </span>
          </Link>
        </div>

        <div className="hero-photo">
          <img
            src="/images/hero-portrait.jpg?v=blazer1"
            alt="Roshani Chaurasiya, celebrity makeup artist"
          />
        </div>
      </div>

      <StatsBar stats={HERO_STATS} />
    </section>
  );
}

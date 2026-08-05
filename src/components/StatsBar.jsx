import "./StatsBar.css";

export default function StatsBar({ stats, variant = "hero" }) {
  return (
    <div className={`stats-bar ${variant}`}>
      <div className="container stats-grid">
        {stats.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <div className="stat-icon" aria-hidden="true">
              <span />
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

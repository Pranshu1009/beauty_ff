import { useEffect, useState } from "react";
import StatsBar from "./StatsBar";
import { TV_STATS } from "../data";
import { useShowWork } from "../context/ShowWorkContext";
import "./TVWork.css";

export default function TVWork() {
  const { items } = useShowWork();
  const [activeShow, setActiveShow] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = activeShow?.images?.length
    ? activeShow.images
    : activeShow?.image
      ? [activeShow.image]
      : [];

  useEffect(() => {
    if (!activeShow) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") setActiveShow(null);
      if (e.key === "ArrowRight" && photos.length > 1) {
        setPhotoIndex((i) => (i + 1) % photos.length);
      }
      if (e.key === "ArrowLeft" && photos.length > 1) {
        setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeShow, photos.length]);

  const openShow = (show) => {
    setActiveShow(show);
    setPhotoIndex(0);
  };

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
            items.map((show) => {
              const count = show.images?.length || (show.image ? 1 : 0);
              return (
                <button
                  type="button"
                  className="show-card"
                  key={show.id}
                  onClick={() => openShow(show)}
                >
                  <div className="show-media">
                    <img src={show.image} alt={show.title} loading="lazy" />
                    <div className="show-overlay">
                      <h3>{show.title}</h3>
                      {show.subtitle ? <p>{show.subtitle}</p> : null}
                      {count > 1 ? (
                        <span className="show-count">{count} photos</span>
                      ) : (
                        <span className="show-count">View photos</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <StatsBar stats={TV_STATS} variant="section" />
      </div>

      {activeShow && (
        <div
          className="show-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeShow.title} gallery`}
          onClick={() => setActiveShow(null)}
        >
          <div
            className="show-lightbox-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="show-lightbox-head">
              <div>
                <h3>{activeShow.title}</h3>
                {activeShow.subtitle ? <p>{activeShow.subtitle}</p> : null}
              </div>
              <button
                type="button"
                className="show-lightbox-close"
                onClick={() => setActiveShow(null)}
                aria-label="Close gallery"
              >
                ×
              </button>
            </header>

            <div className="show-lightbox-stage">
              {photos.length > 1 && (
                <button
                  type="button"
                  className="show-nav prev"
                  onClick={() =>
                    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)
                  }
                  aria-label="Previous photo"
                >
                  ‹
                </button>
              )}
              <img
                src={photos[photoIndex]}
                alt={`${activeShow.title} photo ${photoIndex + 1}`}
              />
              {photos.length > 1 && (
                <button
                  type="button"
                  className="show-nav next"
                  onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                  aria-label="Next photo"
                >
                  ›
                </button>
              )}
            </div>

            {photos.length > 1 && (
              <>
                <p className="show-lightbox-meta">
                  {photoIndex + 1} / {photos.length}
                </p>
                <div className="show-thumbs">
                  {photos.map((src, index) => (
                    <button
                      type="button"
                      key={`${activeShow.id}-${index}`}
                      className={
                        index === photoIndex
                          ? "show-thumb active"
                          : "show-thumb"
                      }
                      onClick={() => setPhotoIndex(index)}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

import { useState } from "react";
import { fileToDataUrl } from "../../context/PortfolioContext";
import { useAcademy } from "../../context/AcademyContext";

export default function AdminAcademy() {
  const { items, usingFallback, addItem, deleteItem, resetToDefaults } =
    useAcademy();
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const onAdd = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please choose a photo.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const image = await fileToDataUrl(file);
      await addItem({
        image,
        alt: alt.trim() || "Academy teaching photo",
      });
      setAlt("");
      setFile(null);
      e.target.reset?.();
      setMessage("Academy photo added.");
    } catch (err) {
      setMessage(err.message || "Could not add photo.");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this academy photo?")) return;
    try {
      await deleteItem(id);
      setMessage("Photo deleted.");
    } catch (err) {
      setMessage(err.message || "Delete failed.");
    }
  };

  const onReset = async () => {
    if (!window.confirm("Reset academy gallery to defaults?")) return;
    try {
      await resetToDefaults();
      setMessage("Academy gallery reset to defaults.");
    } catch (err) {
      setMessage(err.message || "Reset failed.");
    }
  };

  return (
    <>
      <section className="admin-panel">
        <h2>Add academy photo</h2>
        <p className="admin-note" style={{ marginBottom: "1rem" }}>
          Photos appear in the Learn the Craft scrolling gallery.
        </p>
        <form className="admin-add-form" onSubmit={onAdd}>
          <label>
            Caption (optional)
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="e.g. Bridal practice session"
            />
          </label>
          <label>
            Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>
          <button
            type="submit"
            className="btn btn-solid"
            disabled={busy || usingFallback}
          >
            {busy ? "Uploading…" : "Add photo"}
          </button>
        </form>
        {message && <p className="admin-message">{message}</p>}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Academy gallery ({items.length})</h2>
          <button type="button" className="admin-reset" onClick={onReset}>
            Reset to defaults
          </button>
        </div>

        {items.length === 0 ? (
          <p className="admin-empty">No academy photos yet.</p>
        ) : (
          <div className="admin-grid">
            {items.map((item) => (
              <article className="admin-card" key={item.id}>
                <img src={item.image} alt={item.alt || "Academy photo"} />
                <div className="admin-card-body">
                  <h3>{item.alt || "Academy photo"}</h3>
                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="danger"
                      onClick={() => onDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

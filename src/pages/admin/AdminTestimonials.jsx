import { useEffect, useState } from "react";
import { fileToDataUrl } from "../../context/PortfolioContext";
import { useTestimonials } from "../../context/TestimonialsContext";

export default function AdminTestimonials() {
  const {
    items,
    section,
    usingFallback,
    addItem,
    updateItem,
    deleteItem,
    updateSection,
    resetToDefaults,
  } = useTestimonials();

  const [sectionTitle, setSectionTitle] = useState(section.title || "");
  const [sectionSubtitle, setSectionSubtitle] = useState(section.subtitle || "");
  const [sectionMsg, setSectionMsg] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editQuote, setEditQuote] = useState("");

  useEffect(() => {
    setSectionTitle(section.title || "");
    setSectionSubtitle(section.subtitle || "");
  }, [section.title, section.subtitle]);

  const onSaveSection = async (e) => {
    e.preventDefault();
    setSectionMsg("");
    try {
      await updateSection({
        title: sectionTitle.trim() || "Kind Words",
        subtitle: sectionSubtitle.trim(),
      });
      setSectionMsg("Section text updated.");
    } catch (err) {
      setSectionMsg(err.message || "Could not update section.");
    }
  };

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
        name: name.trim(),
        title: title.trim(),
        quote: quote.trim(),
        image,
      });
      setName("");
      setTitle("");
      setQuote("");
      setFile(null);
      e.target.reset?.();
      setMessage("Testimonial added.");
    } catch (err) {
      setMessage(err.message || "Could not add testimonial.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditTitle(item.title || "");
    setEditQuote(item.quote);
  };

  const saveEdit = async (id) => {
    try {
      await updateItem(id, {
        name: editName.trim(),
        title: editTitle.trim(),
        quote: editQuote.trim(),
      });
      setEditingId(null);
      setMessage("Testimonial updated.");
    } catch (err) {
      setMessage(err.message || "Update failed.");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await deleteItem(id);
      setMessage("Testimonial deleted.");
    } catch (err) {
      setMessage(err.message || "Delete failed.");
    }
  };

  const onReset = async () => {
    if (!window.confirm("Reset testimonials to defaults?")) return;
    try {
      await resetToDefaults();
      setSectionTitle("Kind Words");
      setSectionSubtitle(
        "Love notes from brides, celebrities, and creatives who trusted Roshani with their look."
      );
      setMessage("Testimonials reset to defaults.");
    } catch (err) {
      setMessage(err.message || "Reset failed.");
    }
  };

  return (
    <>
      <section className="admin-panel">
        <h2>Edit testimonials section</h2>
        <form className="admin-add-form admin-testimonial-form" onSubmit={onSaveSection}>
          <label>
            Section title
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="Kind Words"
            />
          </label>
          <label className="admin-span-2">
            Section subtitle
            <input
              type="text"
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              placeholder="Short supporting line"
            />
          </label>
          <button type="submit" className="btn btn-solid" disabled={usingFallback}>
            Save section
          </button>
        </form>
        {sectionMsg && <p className="admin-message">{sectionMsg}</p>}
      </section>

      <section className="admin-panel">
        <h2>Add testimonial</h2>
        <form className="admin-add-form admin-testimonial-form" onSubmit={onAdd}>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Client name"
              required
            />
          </label>
          <label>
            Role / title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bride / Actress"
            />
          </label>
          <label className="admin-span-2">
            Review
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Write the testimonial quote"
              rows={3}
              required
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
          <button type="submit" className="btn btn-solid" disabled={busy || usingFallback}>
            {busy ? "Uploading…" : "Add review"}
          </button>
        </form>
        {message && <p className="admin-message">{message}</p>}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>Reviews ({items.length})</h2>
          <button type="button" className="admin-reset" onClick={onReset}>
            Reset to defaults
          </button>
        </div>

        {items.length === 0 ? (
          <p className="admin-empty">No testimonials yet.</p>
        ) : (
          <div className="admin-grid">
            {items.map((item) => (
              <article className="admin-card" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="admin-card-body">
                  {editingId === item.id ? (
                    <div className="admin-edit-col">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Name"
                      />
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Role / title"
                      />
                      <textarea
                        value={editQuote}
                        onChange={(e) => setEditQuote(e.target.value)}
                        rows={3}
                        placeholder="Quote"
                      />
                      <button
                        type="button"
                        className="btn btn-solid"
                        onClick={() => saveEdit(item.id)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3>{item.name}</h3>
                      {item.title ? <p className="admin-card-sub">{item.title}</p> : null}
                      <p className="admin-card-sub">“{item.quote}”</p>
                    </>
                  )}
                  <div className="admin-card-actions">
                    <button type="button" onClick={() => startEdit(item)}>
                      Edit
                    </button>
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

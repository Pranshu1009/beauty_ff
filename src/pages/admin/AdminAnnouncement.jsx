import { useEffect, useState } from "react";
import { useAnnouncement } from "../../context/AnnouncementContext";

export default function AdminAnnouncement() {
  const { text, usingFallback, updateText } = useAnnouncement();
  const [value, setValue] = useState(text || "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValue(text || "");
  }, [text]);

  const onSave = async (e) => {
    e.preventDefault();
    const next = value.trim();
    if (!next) {
      setMessage("Announcement text is required.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await updateText(next);
      setMessage("Announcement banner updated.");
    } catch (err) {
      setMessage(err.message || "Could not update announcement.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin-panel">
      <h2>Top banner announcement</h2>
      <p className="admin-note" style={{ marginBottom: "1rem" }}>
        This text scrolls across the top of every page. Keep it short and clear.
      </p>
      <form className="admin-add-form admin-announcement-form" onSubmit={onSave}>
        <label className="admin-span-2">
          Banner text
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Now booking bridal season…"
            required
          />
        </label>
        <button
          type="submit"
          className="btn btn-solid"
          disabled={busy || usingFallback}
        >
          {busy ? "Saving…" : "Save banner"}
        </button>
      </form>
      {message && <p className="admin-message">{message}</p>}
    </section>
  );
}

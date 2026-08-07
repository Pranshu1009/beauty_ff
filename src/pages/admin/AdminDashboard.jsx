import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fileToDataUrl, usePortfolio } from "../../context/PortfolioContext";
import { useShowWork } from "../../context/ShowWorkContext";
import "./AdminDashboard.css";

const AREAS = [
  { id: "portfolio", label: "Portfolio" },
  { id: "tv", label: "TV Work" },
];

export default function AdminDashboard() {
  const { logout, changePassword, username } = useAuth();
  const portfolio = usePortfolio();
  const shows = useShowWork();
  const navigate = useNavigate();

  const [area, setArea] = useState("portfolio");
  const [activeCategory, setActiveCategory] = useState(
    portfolio.categories[0] || "Celebrity"
  );

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  const isPortfolio = area === "portfolio";
  const usingFallback = isPortfolio ? portfolio.usingFallback : shows.usingFallback;

  useEffect(() => {
    if (
      isPortfolio &&
      !portfolio.categories.includes(activeCategory) &&
      portfolio.categories[0]
    ) {
      setActiveCategory(portfolio.categories[0]);
    }
  }, [isPortfolio, portfolio.categories, activeCategory]);

  useEffect(() => {
    setTitle("");
    setSubtitle("");
    setFile(null);
    setMessage("");
    setEditingId(null);
  }, [area, activeCategory]);

  const filteredPortfolio = useMemo(
    () => portfolio.items.filter((item) => item.category === activeCategory),
    [portfolio.items, activeCategory]
  );

  const onLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const onAdd = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please choose a photo to upload.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const image = await fileToDataUrl(file);
      if (isPortfolio) {
        await portfolio.addItem({
          title,
          category: activeCategory,
          image,
        });
        setMessage("Photo added — all visitors will see it on the portfolio.");
      } else {
        await shows.addItem({ title, subtitle, image });
        setMessage("Added to TV Work — all visitors will see it.");
      }
      setTitle("");
      setSubtitle("");
      setFile(null);
      e.target.reset?.();
    } catch (err) {
      setMessage(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditSubtitle(item.subtitle || "");
  };

  const saveEdit = async (id) => {
    try {
      if (isPortfolio) {
        await portfolio.updateItem(id, {
          title: editTitle.trim() || "Untitled Look",
        });
      } else {
        await shows.updateItem(id, {
          title: editTitle.trim() || "Untitled",
          subtitle: editSubtitle.trim(),
        });
      }
      setEditingId(null);
      setMessage("Updated.");
    } catch (err) {
      setMessage(err.message || "Update failed.");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      if (isPortfolio) {
        await portfolio.deleteItem(id);
      } else {
        await shows.deleteItem(id);
      }
      setMessage("Deleted.");
    } catch (err) {
      setMessage(err.message || "Delete failed.");
    }
  };

  const onReset = async () => {
    const label = isPortfolio ? "portfolio" : "TV work";
    if (
      !window.confirm(
        `Reset ${label} to the original defaults? Custom uploads will be removed.`
      )
    ) {
      return;
    }
    try {
      if (isPortfolio) {
        await portfolio.resetToDefaults();
        setMessage("Portfolio reset to defaults.");
      } else {
        await shows.resetToDefaults();
        setMessage("TV Work reset to defaults.");
      }
    } catch (err) {
      setMessage(err.message || "Reset failed.");
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New password and confirm password do not match.");
      return;
    }

    setPasswordBusy(true);
    try {
      const data = await changePassword(currentPassword, newPassword);
      setPasswordMsg(data.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg(err.message || "Could not update password.");
    } finally {
      setPasswordBusy(false);
    }
  };

  const listItems = isPortfolio ? filteredPortfolio : shows.items;
  const sectionLabel = isPortfolio ? activeCategory : "TV Work";

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">
            Owner dashboard{username ? ` · ${username}` : ""}
          </p>
          <h1>Content Manager</h1>
        </div>
        <div className="admin-topbar-actions">
          <Link to="/" className="btn btn-outline">
            View site
          </Link>
          <button type="button" className="btn btn-solid" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <p className="admin-note">
        Manage Portfolio photos (including Celebrity) and TV Work show cards.
        Changes save to MongoDB Atlas and appear for every visitor.
      </p>

      {usingFallback && (
        <p className="admin-warning">
          API is offline — showing local defaults. Start the server and check your
          MongoDB URI in <code>.env</code>.
        </p>
      )}

      <section className="admin-panel">
        <h2>Change password</h2>
        <form className="admin-password-form" onSubmit={onChangePassword}>
          <label>
            Current password
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            New password
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-solid" disabled={passwordBusy}>
            {passwordBusy ? "Updating…" : "Update password"}
          </button>
        </form>
        {passwordMsg && <p className="admin-message">{passwordMsg}</p>}
      </section>

      <div className="admin-area-tabs" role="tablist" aria-label="Content area">
        {AREAS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={area === tab.id}
            className={area === tab.id ? "admin-area-tab active" : "admin-area-tab"}
            onClick={() => setArea(tab.id)}
          >
            {tab.label}
            <span>
              {tab.id === "portfolio" ? portfolio.items.length : shows.items.length}
            </span>
          </button>
        ))}
      </div>

      {isPortfolio && (
        <div className="admin-tabs" role="tablist">
          {portfolio.categories.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeCategory === tab}
              className={activeCategory === tab ? "admin-tab active" : "admin-tab"}
              onClick={() => setActiveCategory(tab)}
            >
              {tab}
              <span>
                {portfolio.items.filter((i) => i.category === tab).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <section className="admin-panel">
        <h2>Add · {sectionLabel}</h2>
        <form className="admin-add-form" onSubmit={onAdd}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isPortfolio ? "e.g. Soft Bridal Glow" : "e.g. Indian Idol"
              }
            />
          </label>
          {!isPortfolio && (
            <label>
              Subtitle
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Seasons 13 – 15"
              />
            </label>
          )}
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
            {busy ? "Uploading…" : "Add"}
          </button>
        </form>
        {message && <p className="admin-message">{message}</p>}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-head">
          <h2>
            {sectionLabel} ({listItems.length})
          </h2>
          <button type="button" className="admin-reset" onClick={onReset}>
            Reset to defaults
          </button>
        </div>

        {listItems.length === 0 ? (
          <p className="admin-empty">Nothing in this section yet.</p>
        ) : (
          <div className="admin-grid">
            {listItems.map((item) => (
              <article className="admin-card" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="admin-card-body">
                  {editingId === item.id ? (
                    <div className="admin-edit-col">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                      />
                      {!isPortfolio && (
                        <input
                          value={editSubtitle}
                          onChange={(e) => setEditSubtitle(e.target.value)}
                          placeholder="Subtitle"
                        />
                      )}
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
                      <h3>{item.title}</h3>
                      {!isPortfolio && item.subtitle ? (
                        <p className="admin-card-sub">{item.subtitle}</p>
                      ) : null}
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
    </div>
  );
}

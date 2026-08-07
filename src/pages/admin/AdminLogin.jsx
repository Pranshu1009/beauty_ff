import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { isOwner, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isOwner) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(username, password);
      const dest = location.state?.from || "/admin";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || "Incorrect username or password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-login-eyebrow">Owner access</p>
        <h1>Welcome back</h1>
        <p className="admin-login-sub">
          Sign in to manage portfolio photos by category.
        </p>

        <form onSubmit={onSubmit} className="admin-login-form">
          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </label>
          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit" className="btn btn-solid admin-login-btn" disabled={busy}>
            {busy ? "Signing in…" : "Login"}
          </button>
        </form>

        <Link to="/" className="admin-back-link">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

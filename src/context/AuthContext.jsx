import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [username, setUsername] = useState("");

  const isOwner = Boolean(token);

  useEffect(() => {
    if (!token) {
      setUsername("");
      return;
    }
    api("/auth/me", { auth: true })
      .then((data) => setUsername(data.username || ""))
      .catch(() => {
        setToken("");
        setTokenState("");
      });
  }, [token]);

  const value = useMemo(
    () => ({
      isOwner,
      username,
      async login(user, password) {
        const data = await api("/auth/login", {
          method: "POST",
          body: { username: user, password },
        });
        setToken(data.token);
        setTokenState(data.token);
        setUsername(data.username || user);
        return true;
      },
      logout() {
        setToken("");
        setTokenState("");
        setUsername("");
      },
      async changePassword(currentPassword, newPassword) {
        return api("/auth/change-password", {
          method: "POST",
          auth: true,
          body: { currentPassword, newPassword },
        });
      },
    }),
    [isOwner, username]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

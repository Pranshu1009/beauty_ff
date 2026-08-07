import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SHOW_ITEMS } from "../data";
import { api } from "../api";

const ShowWorkContext = createContext(null);

export function ShowWorkProvider({ children }) {
  const [items, setItems] = useState(SHOW_ITEMS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api("/shows");
      setItems(data.items || []);
      setUsingFallback(false);
    } catch {
      setItems(SHOW_ITEMS);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      items,
      loading,
      usingFallback,
      refresh,
      async addItem({ title, subtitle, image }) {
        const data = await api("/shows", {
          method: "POST",
          auth: true,
          body: { title, subtitle, image },
        });
        setItems((prev) => [data.item, ...prev]);
        return data.item;
      },
      async updateItem(id, patch) {
        const data = await api(`/shows/${id}`, {
          method: "PATCH",
          auth: true,
          body: patch,
        });
        setItems((prev) =>
          prev.map((item) => (String(item.id) === String(id) ? data.item : item))
        );
        return data.item;
      },
      async deleteItem(id) {
        await api(`/shows/${id}`, { method: "DELETE", auth: true });
        setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      },
      async resetToDefaults() {
        const data = await api("/shows/reset", { method: "POST", auth: true });
        setItems(data.items || []);
      },
    }),
    [items, loading, usingFallback, refresh]
  );

  return (
    <ShowWorkContext.Provider value={value}>{children}</ShowWorkContext.Provider>
  );
}

export function useShowWork() {
  const ctx = useContext(ShowWorkContext);
  if (!ctx) throw new Error("useShowWork must be used within ShowWorkProvider");
  return ctx;
}

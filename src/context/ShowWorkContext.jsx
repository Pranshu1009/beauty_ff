import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SHOW_ITEMS } from "../data";
import { api } from "../api";

const ShowWorkContext = createContext(null);

function withImages(item) {
  const images =
    Array.isArray(item.images) && item.images.length
      ? item.images
      : item.image
        ? [item.image]
        : [];
  return {
    ...item,
    images,
    image: images[0] || item.image || "",
  };
}

export function ShowWorkProvider({ children }) {
  const [items, setItems] = useState(SHOW_ITEMS.map(withImages));
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api("/shows");
      setItems((data.items || []).map(withImages));
      setUsingFallback(false);
    } catch {
      setItems(SHOW_ITEMS.map(withImages));
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
        setItems((prev) => [withImages(data.item), ...prev]);
        return withImages(data.item);
      },
      async updateItem(id, patch) {
        const data = await api(`/shows/${id}`, {
          method: "PATCH",
          auth: true,
          body: patch,
        });
        setItems((prev) =>
          prev.map((item) =>
            String(item.id) === String(id) ? withImages(data.item) : item
          )
        );
        return withImages(data.item);
      },
      async addShowImage(id, image) {
        const data = await api(`/shows/${id}/images`, {
          method: "POST",
          auth: true,
          body: { image },
        });
        setItems((prev) =>
          prev.map((item) =>
            String(item.id) === String(id) ? withImages(data.item) : item
          )
        );
        return withImages(data.item);
      },
      async deleteShowImage(id, index) {
        const data = await api(`/shows/${id}/images/${index}`, {
          method: "DELETE",
          auth: true,
        });
        setItems((prev) =>
          prev.map((item) =>
            String(item.id) === String(id) ? withImages(data.item) : item
          )
        );
        return withImages(data.item);
      },
      async deleteItem(id) {
        await api(`/shows/${id}`, { method: "DELETE", auth: true });
        setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      },
      async resetToDefaults() {
        const data = await api("/shows/reset", { method: "POST", auth: true });
        setItems((data.items || []).map(withImages));
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

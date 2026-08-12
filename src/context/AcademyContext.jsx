import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ACADEMY_GALLERY } from "../data";
import { api } from "../api";

const AcademyContext = createContext(null);

function toItem(entry) {
  return {
    id: entry.id,
    image: entry.image || entry.src || "",
    alt: entry.alt || "Academy teaching photo",
  };
}

const FALLBACK = ACADEMY_GALLERY.map((item, index) =>
  toItem({ id: `local-${index}`, image: item.src, alt: item.alt })
);

export function AcademyProvider({ children }) {
  const [items, setItems] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api("/academy");
      setItems((data.items || []).map(toItem));
      setUsingFallback(false);
    } catch {
      setItems(FALLBACK);
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
      async addItem({ image, alt }) {
        const data = await api("/academy", {
          method: "POST",
          auth: true,
          body: { image, alt },
        });
        setItems((prev) => [toItem(data.item), ...prev]);
        return toItem(data.item);
      },
      async deleteItem(id) {
        await api(`/academy/${id}`, { method: "DELETE", auth: true });
        setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      },
      async resetToDefaults() {
        const data = await api("/academy/reset", {
          method: "POST",
          auth: true,
        });
        setItems((data.items || []).map(toItem));
      },
    }),
    [items, loading, usingFallback, refresh]
  );

  return (
    <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>
  );
}

export function useAcademy() {
  const ctx = useContext(AcademyContext);
  if (!ctx) {
    throw new Error("useAcademy must be used within AcademyProvider");
  }
  return ctx;
}

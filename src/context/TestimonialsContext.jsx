import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TESTIMONIALS } from "../data";
import { api } from "../api";

const DEFAULT_SECTION = {
  title: "Kind Words",
  subtitle:
    "Love notes from brides, celebrities, and creatives who trusted Roshani with their look.",
};

const TestimonialsContext = createContext(null);

export function TestimonialsProvider({ children }) {
  const [items, setItems] = useState(TESTIMONIALS);
  const [section, setSection] = useState(DEFAULT_SECTION);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api("/testimonials");
      setItems(data.items || []);
      setSection(data.section || DEFAULT_SECTION);
      setUsingFallback(false);
    } catch {
      setItems(TESTIMONIALS);
      setSection(DEFAULT_SECTION);
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
      section,
      loading,
      usingFallback,
      refresh,
      async updateSection({ title, subtitle }) {
        const data = await api("/testimonials/section", {
          method: "PATCH",
          auth: true,
          body: { title, subtitle },
        });
        setSection(data.section || DEFAULT_SECTION);
        return data.section;
      },
      async addItem({ name, title, quote, image }) {
        const data = await api("/testimonials", {
          method: "POST",
          auth: true,
          body: { name, title, quote, image },
        });
        setItems((prev) => [data.item, ...prev]);
        return data.item;
      },
      async updateItem(id, patch) {
        const data = await api(`/testimonials/${id}`, {
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
        await api(`/testimonials/${id}`, { method: "DELETE", auth: true });
        setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      },
      async resetToDefaults() {
        const data = await api("/testimonials/reset", {
          method: "POST",
          auth: true,
        });
        setItems(data.items || []);
        setSection(data.section || DEFAULT_SECTION);
      },
    }),
    [items, section, loading, usingFallback, refresh]
  );

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const ctx = useContext(TestimonialsContext);
  if (!ctx) {
    throw new Error("useTestimonials must be used within TestimonialsProvider");
  }
  return ctx;
}

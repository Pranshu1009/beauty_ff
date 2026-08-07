import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PORTFOLIO_ITEMS, PORTFOLIO_TABS } from "../data";
import { api } from "../api";

const PortfolioContext = createContext(null);

/** Resize/compress image file to a data URL before sending to the API. */
export function fileToDataUrl(file, maxSize = 1100, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function PortfolioProvider({ children }) {
  const [items, setItems] = useState(PORTFOLIO_ITEMS);
  const [categories, setCategories] = useState(PORTFOLIO_TABS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api("/portfolio");
      setItems(data.items || []);
      setCategories(data.categories || PORTFOLIO_TABS);
      setUsingFallback(false);
    } catch {
      setItems(PORTFOLIO_ITEMS);
      setCategories(PORTFOLIO_TABS);
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
      categories,
      loading,
      usingFallback,
      refresh,
      async addItem({ title, category, image }) {
        const data = await api("/portfolio", {
          method: "POST",
          auth: true,
          body: { title, category, image },
        });
        setItems((prev) => [data.item, ...prev]);
        return data.item;
      },
      async updateItem(id, patch) {
        const data = await api(`/portfolio/${id}`, {
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
        await api(`/portfolio/${id}`, { method: "DELETE", auth: true });
        setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      },
      async resetToDefaults() {
        const data = await api("/portfolio/reset", { method: "POST", auth: true });
        setItems(data.items || []);
      },
    }),
    [items, categories, loading, usingFallback, refresh]
  );

  return (
    <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}

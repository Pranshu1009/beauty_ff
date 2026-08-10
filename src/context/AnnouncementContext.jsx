import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";

export const DEFAULT_ANNOUNCEMENT_TEXT =
  "Now booking bridal season & destination glam — limited slots available";

const AnnouncementContext = createContext(null);

export function AnnouncementProvider({ children }) {
  const [text, setText] = useState(DEFAULT_ANNOUNCEMENT_TEXT);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const data = await api("/announcement");
      setText(data.announcement?.text || DEFAULT_ANNOUNCEMENT_TEXT);
      setUsingFallback(false);
    } catch {
      setText(DEFAULT_ANNOUNCEMENT_TEXT);
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
      text,
      loading,
      usingFallback,
      refresh,
      async updateText(nextText) {
        const data = await api("/announcement", {
          method: "PATCH",
          auth: true,
          body: { text: nextText },
        });
        setText(data.announcement?.text || nextText);
        return data.announcement?.text;
      },
    }),
    [text, loading, usingFallback, refresh]
  );

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncement() {
  const ctx = useContext(AnnouncementContext);
  if (!ctx) {
    throw new Error("useAnnouncement must be used within AnnouncementProvider");
  }
  return ctx;
}

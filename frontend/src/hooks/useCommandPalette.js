import { useEffect } from "react";

export function useHotkey(combo, handler) {
  useEffect(() => {
    const onKey = (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (combo === "mod+k" && meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handler();
      }
      if (combo === "esc" && e.key === "Escape") handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [combo, handler]);
}

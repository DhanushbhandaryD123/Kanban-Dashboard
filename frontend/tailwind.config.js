/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Enables `dark:` prefix when [data-theme="dark"] is on any ancestor (set by ThemeContext on <html>)
  darkMode: ["class", "[data-theme='dark']"],
  theme: {
    extend: {
      colors: {
        // Theme-switching colors via CSS custom properties (defined in index.css)
        bg:       "var(--color-bg)",
        surface:  "var(--color-surface)",
        sidebar:  "var(--color-sidebar)",
        elevated: "var(--color-elevated)",
        line:     "var(--color-line)",
        ink:      "var(--color-ink)",
        muted:    "var(--color-muted)",
        faint:    "var(--color-faint)",
        // Accent colours stay fixed in both themes
        accent:       "#6366F1",
        "accent-soft": "#818CF8",
        success:  "#22C55E",
        warning:  "#F59E0B",
        danger:   "#EF4444",
        violet:   "#A855F7",
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["'Clash Display'", "Inter", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem", xl3: "1.75rem" },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,.3), 0 8px 24px -8px rgba(0,0,0,.5)",
        glow: "0 0 0 1px rgba(99,102,241,.25), 0 12px 40px -12px rgba(99,102,241,.45)",
        card: "0 1px 0 rgba(255,255,255,.03) inset, 0 12px 36px -16px rgba(0,0,0,.7)",
      },
      keyframes: {
        "fade-up": { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "none" } },
        shimmer:   { "100%": { transform: "translateX(100%)" } },
      },
      animation: { "fade-up": "fade-up .4s ease both" },
    },
  },
  plugins: [],
};

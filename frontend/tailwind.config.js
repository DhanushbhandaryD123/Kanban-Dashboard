/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090B",
        surface: "#111214",
        sidebar: "#0D0D0F",
        elevated: "#17181B",
        line: "#1F2024",
        accent: "#6366F1",
        "accent-soft": "#818CF8",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        violet: "#A855F7",
        ink: "#F8FAFC",
        muted: "#94A3B8",
        faint: "#5B616E",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
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
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { "fade-up": "fade-up .4s ease both" },
    },
  },
  plugins: [],
};

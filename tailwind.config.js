/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // AnyFeast Primary — Warm Orange
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#FF6A00",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        // AnyFeast Accent — Fresh Green (nutrition / health)
        accent: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          400: "#4ade80",
          500: "#22C55E",
          600: "#16a34a",
          700: "#15803d",
        },
        // AnyFeast Highlight — Warm Amber
        highlight: {
          400: "#FFA94D",
          500: "#f59e0b",
        },
        // Dark mode surfaces
        surface: {
          950: "#0F172A",
          900: "#1e293b",
          800: "#1e2535",
          700: "#263044",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #FF6A00 0%, #FFA94D 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
        "accent-gradient": "linear-gradient(135deg, #22C55E 0%, #4ade80 100%)",
        "dark-gradient": "linear-gradient(135deg, #0F172A 0%, #1e293b 100%)",
      },
      boxShadow: {
        "brand-sm": "0 2px 8px 0 rgba(255, 106, 0, 0.15)",
        "brand":    "0 4px 16px 0 rgba(255, 106, 0, 0.25)",
        "brand-lg": "0 8px 32px 0 rgba(255, 106, 0, 0.35)",
        "card":     "0 2px 8px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px 0 rgba(0,0,0,0.10), 0 2px 6px 0 rgba(0,0,0,0.06)",
      },
      animation: {
        "pulse-warm": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
}


import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/modules/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // -------------------------------------------------------------
        // Brand tokens. Never hardcode hex values in components — always
        // reference these classes (bg-brand-500, text-ink-900, etc.).
        // -------------------------------------------------------------
        brand: {
          50: "#FDF1EC",
          100: "#FBDFD3",
          200: "#F5B9A2",
          300: "#EE9271",
          400: "#E86B48",
          500: "#E84A2E", // primary — chili red-orange
          600: "#C93A21",
          700: "#A32D19",
          800: "#7C2213",
          900: "#571709",
        },
        gold: {
          50: "#FDF6E7",
          200: "#F2D384",
          400: "#E8A93B", // turmeric accent — specials/popular badges
          600: "#C08A22",
        },
        ink: {
          50: "#F7F4F1",
          100: "#EDE6E0",
          400: "#7A6D63",
          600: "#4D4038",
          800: "#332821",
          900: "#2B211C", // primary text
        },
        cream: {
          DEFAULT: "#FBF6EF", // background
          100: "#FFFFFF",
          200: "#F3ECE1",
        },
        bar: {
          900: "#1F3D2E", // reserved for Bar vertical accents only
          700: "#2E5A44",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      spacing: {
        "4.5": "1.125rem", // used by header notification/cart badges
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-slide-in": {
          "0%": { opacity: "0", transform: "translateX(4px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "bounce-sm": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        "check-pop": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "spin-slow": {
          "to": { "--angle": "360deg" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.28s ease-out",
        "fade-in": "fade-in 0.18s ease-out",
        "fade-slide-in": "fade-slide-in 0.3s ease-out",
        "bounce-sm": "bounce-sm 0.3s ease-in-out",
        "check-pop": "check-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "spin-slow": "spin-slow 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

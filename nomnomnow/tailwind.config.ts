import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#12100E",
        surface: "#1D1916",
        surface2: "#262019",
        chili: "#E63B2E",
        chilidark: "#B92A20",
        turmeric: "#F2A93B",
        cream: "#F5EFE6",
        muted: "#8A8074",
        veg: "#3E8560",
        line: "#332C24",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(245,239,230,0.05) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;

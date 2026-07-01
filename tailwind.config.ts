import type { Config } from "tailwindcss";

const config: Config = {
  
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-space)"],
      },
      colors: {
        "neon-blue": "#4da6ff",
        "neon-cyan": "#00e5ff",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      spacing: {
        "screen-90": "90vh",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      zIndex: {
        "-10": "-10",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
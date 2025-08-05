// tailwind.config.ts
import { li } from "framer-motion/client";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "subtitle-gray": "#6B7280",
        "divider-gray": "#D1D5DB",
      },
      borderColor: {
        "white-25": "hsla(0, 0%, 100%, 0.25)",
        "dark-gray-20": "rgba(40, 39, 39, 0.2)",
      },
      keyframes: {
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-down": "slide-down 0.3s ease-out forwards",
      },
      typography: (theme: any) => ({
        dark: {
          css: {
            color: theme("colors.gray.300"),
            '[class~="lead"]': { color: theme("colors.gray.400") },
            a: { color: theme("colors.white") },
            strong: { color: theme("colors.white") },
            h1: { color: theme("colors.white") },
            h2: { color: theme("colors.white") },
            h3: { color: theme("colors.white") },
            h4: { color: theme("colors.white") },
            ".prose pre": {
              backgroundColor: theme("colors.gray.800"),
              color: theme("colors.white"),
              padding: "1em",
              borderRadius: theme("borderRadius.lg"),
            },
            code: {
              backgroundColor: theme("colors.gray.800"),
              color: theme("colors.white"),
            },
            blockquote: {
              color: theme("colors.gray.300"),
              borderLeftColor: theme("colors.gray.600"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // …other plugins if any.
  ],
};

export default config;

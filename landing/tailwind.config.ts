import type { Config } from "tailwindcss";

/**
 * Design tokens live in two places, on purpose:
 *
 * - Values that differ between light and dark (colour) are CSS custom
 *   properties declared in globals.css and only referenced here, so switching
 *   theme is a class toggle rather than a re-render.
 * - Values that are theme-invariant (type scale, radii, easing) are plain
 *   values here, so Tailwind can tree-shake and autocomplete them.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        elevated: "hsl(var(--elevated) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        subtle: "hsl(var(--subtle) / <alpha-value>)",
        brand: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          strong: "hsl(var(--brand-strong) / <alpha-value>)",
          soft: "hsl(var(--brand-soft) / <alpha-value>)",
          on: "hsl(var(--brand-on) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // Fluid type scale — clamp() means no layout jump between breakpoints.
      fontSize: {
        "display-lg": [
          "clamp(2.75rem, 1.9rem + 4.2vw, 4.5rem)",
          { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        display: [
          "clamp(2.25rem, 1.7rem + 2.8vw, 3.5rem)",
          { lineHeight: "1.08", letterSpacing: "-0.028em", fontWeight: "600" },
        ],
        title: [
          "clamp(1.5rem, 1.3rem + 1vw, 2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        lead: [
          "clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)",
          { lineHeight: "1.6", letterSpacing: "-0.01em" },
        ],
      },
      borderRadius: {
        card: "1rem",
        pill: "9999px",
      },
      maxWidth: {
        content: "72rem",
        prose: "42rem",
      },
      transitionTimingFunction: {
        // Matches the spring-ish feel of the Framer Motion transitions.
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "marquee-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "marquee-x": "marquee-x 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

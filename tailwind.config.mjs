const shades = (name) =>
  Object.fromEntries(
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((step) => [
      step,
      `rgb(var(--c-${name}-${step}) / <alpha-value>)`,
    ])
  );

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Dark mode is switched by the "dark" class on <html> (ThemeToggle).
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // The neutral scales read CSS variables (globals.css), so dark mode
        // flips every gray / slate class, with its hover, border and opacity
        // variants, without a dark: class on each element.
        gray: shades("gray"),
        slate: shades("slate"),

        primary: "#0C3F8E",
        primaryBg: "#FEECF1",
        secondary: "#00215E",

        deepGray: "rgb(var(--c-deepGray) / <alpha-value>)",
        mediumGray: "rgb(var(--c-mediumGray) / <alpha-value>)",
        lightGray: "rgb(var(--c-lightGray) / <alpha-value>)",

        primaryFood: "#F40035",
        primaryBgFood: "#FEECF1",
        secondaryFood: "#00215E",

        primaryGrocery: "#2196F3",
        primaryBgGrocery: "#FEECF1",
        secondaryGrocery: "#00215E",

        primaryMedicine: "#41B3A2",
        primaryBgMedicine: "#FEECF1",
        secondaryMedicine: "#0D7C66",
      },
      container: {
        center: true,
      },
      height: {
        footer: "355px",
      },
    },
  },
  plugins: [],
};

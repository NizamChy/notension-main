/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: "#0C3F8E",
        primaryBg: "#FEECF1",
        secondary: "#00215E",

        deepGray: "#3B3B3B",
        mediumGray: "#6C6C6C",
        lightGray: "#959595",

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

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
        primary: "#F40035",
        primaryBg: "#FEECF1",
        secondary: "#00215E",
        deepGray: "#3B3B3B",
        mediumGray: "#6C6C6C",
        lightGray: "#959595",
      },
    },
  },
  plugins: [],
};

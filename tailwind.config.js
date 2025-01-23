/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Matches all your source files
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff", // Light mode background
          dark: "#1a202c",  // Dark mode background
        },
        text: {
          light: "#000000", // Light mode text
          dark: "#ffffff",  // Dark mode text
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
    },
  },
  darkMode: false, // Disables dark mode
  plugins: [],
};

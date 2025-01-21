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
    },
  },
  // darkMode: "media", // Enables dark mode based on user's system settings
  darkMode: false, // Disables dark mode

  plugins: [],
};

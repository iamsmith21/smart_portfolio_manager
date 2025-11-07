// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",   // scan all your source files
    "./components/**/*.{js,ts,jsx,tsx}", // include components folder
    "./app/**/*.{js,ts,jsx,tsx}",   // include Next.js app router files
  ],
  theme: {
    extend: {
      // you can add custom colors, fonts, spacing here later
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"), // enables line-clamp utilities
  ],
};
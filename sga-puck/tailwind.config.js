/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./puck.config.tsx",
  ],
  theme: {
    extend: {
      colors: {
        "sga-red": "#C8102E",
      },
    },
  },
  plugins: [],
}

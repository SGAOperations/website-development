/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/puck.config.tsx",
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

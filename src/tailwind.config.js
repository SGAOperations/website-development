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

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
    },
  }
};
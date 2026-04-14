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
    theme: {
    extend: {
      keyframes: {
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
        marquee2: {
        from: { transform: 'translateX(100%)' },
        to: { transform: 'translateX(0%)' },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  }
}

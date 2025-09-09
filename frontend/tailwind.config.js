// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xsm: "480px", // Correct placement
      },
      colors: {
        primary: {
          DEFAULT: "#0670f4",
          light: "#6cb2eb",
          dark: "#2779bd",
        },
        secondary: {
          DEFAULT: "#bb7139",
          light: "#fff38f",
          dark: "#f2d024",
        },
      },
    },
  },
  plugins: [],
};

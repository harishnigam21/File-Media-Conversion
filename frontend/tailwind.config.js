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
          light: "#0670f4",
          dark: "#0670f4",
        },
        secondary1: {
          DEFAULT: "#8e949b",
          light: "#8e949b",
          dark: "#8e949b",
        },
        secondary2: {
          DEFAULT: "#565f69",
          light: "#565f69",
          dark: "#565f69",
        },
      },
      fontFamily: {
        georgia: ["Georgia", "serif"],
        times: ["'Times New Roman'", "serif"],
      },
    },
  },
  plugins: [],
};

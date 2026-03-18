/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#191919",
        paper: "#f5f1e8",
        sand: "#e9e1d2",
        clay: "#a46c48",
        pine: "#37503b",
        mist: "#8d908b",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(24, 24, 24, 0.08)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryPurple: "#c3a6eb",
      },
      boxShadow: {
        neon: "0 0 20px #ff00ff",
      },
    },
  },
  plugins: [],
};

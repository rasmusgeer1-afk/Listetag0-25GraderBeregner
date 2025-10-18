/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Denne linje er VIGTIG! Den sikrer, at Tailwind scanner din .js(x) fil.
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

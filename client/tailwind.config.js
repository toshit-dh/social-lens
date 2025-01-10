/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/components/Navbar.jsx",
    "./src/pages/Home.jsx"
  ],
  theme: {
    extend: {
      backgroundImage: {
        bg: "url('./public/images/bg.png')",
      }
    },
  },
  plugins: [],
};


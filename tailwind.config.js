/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          marrom: '#6F4E37', // Brown
          verde: '#2E8B57',  // Green
          bege: '#FAF5F0',   // Light Beige
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ Enables dark mode via .dark class
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'], // ✅ Add your custom font here
      },
      colors: {
        // Optional: extend Tailwind’s palette slightly for better dark mode contrast
        darkbg: '#0f172a', // Slate-900
        darkcard: '#1e293b', // Slate-800
      },
    },
  },
  plugins: [],
}

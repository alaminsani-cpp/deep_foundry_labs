// tailwind.config.js
import { colors } from './src/config/colors.js'; // Adjust path as needed

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: colors.primary,
        gray: colors.neutral,
      },
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
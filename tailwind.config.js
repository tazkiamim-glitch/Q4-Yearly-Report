/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'h-sm': { raw: '(min-height: 667px)' },
        'h-md': { raw: '(min-height: 812px)' },
      },
      colors: {
        'shikho-pink': '#CF278D',
        'shikho-blue': '#354894',
        'shikho-yellow': '#EFAD1E',
        'shikho-red': '#EE3D5E',
      },
      fontFamily: {
        'noto-bengali': ['Noto Sans Bengali', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
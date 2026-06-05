/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./script.js",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0D9488',
          dark:    '#0F766E',
          light:   '#14B8A6',
          50:      '#F0FDFA',
        },
        gold: {
          DEFAULT: '#D4A843',
          light:   '#E8C36A',
          dark:    '#B8922F',
        },
        dark: {
          DEFAULT: '#0F172A',
          card:    '#1E293B',
          lighter: '#334155',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body:    ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

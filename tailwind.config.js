/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: '#C41230',
        jet: '#0A0A0A',
        white: '#F5F5F0',
        mid: '#1A1A1A',
        background: '#0A0A0A',
        foreground: '#F5F5F0'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

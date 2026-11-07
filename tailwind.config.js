/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // md width AND enough height for the hero's floating tag stack (avoids overlap on landscape phones)
        tall: { raw: '(min-width: 768px) and (min-height: 600px)' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        ui: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

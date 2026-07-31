/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5EFE3',
        parchment: '#ECE2D0',
        'parchment-deep': '#E1D3BC',
        wine: '#6D2E46',
        'wine-light': '#8C4A63',
        rose: '#A26769',
        'rose-light': '#C99B96',
        plum: '#4A3540',
        'plum-deep': '#2C1F27',
        ink: '#3A2530',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 20px 50px -20px rgba(44,31,39,0.35)',
      },
      borderColor: {
        line: 'rgba(74,53,64,0.14)',
      },
    },
  },
  plugins: [],
}

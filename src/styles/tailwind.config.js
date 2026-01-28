/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'var(--font-cairo)', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'sans-serif'],
      },
      colors: {
        "avt-green": "#00c22a",
      },
      animation: {
        'spin-slow': 'spin-slow 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      backgroundImage: {
        'conic-green': 'conic-gradient(from 0deg at 50% 50%, #00000000 0%, #0BFF00FF 33%, #00000000 66%)',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

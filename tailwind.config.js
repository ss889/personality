/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vibrant: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          orange: '#F97316',
          cyan: '#06B6D4',
        },
      },
      borderRadius: {
        'blob': '50% 40% 60% 50% / 40% 50% 50% 60%',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

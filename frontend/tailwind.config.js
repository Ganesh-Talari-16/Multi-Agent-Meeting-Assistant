/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#0284c7',
          600: '#0265d2',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        accent: {
          teal: '#0f766e',
          cyan: '#06b6d4',
          indigo: '#4f46e5',
          violet: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'premium-hover': '0 20px 35px -10px rgba(37, 99, 235, 0.12), 0 10px 15px -5px rgba(0, 0, 0, 0.04)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.25)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.25)',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '26px',
      }
    },
  },
  plugins: [],
}

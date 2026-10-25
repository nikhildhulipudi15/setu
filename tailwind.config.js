/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#1e3048',
          900: '#0f1d2e',
          950: '#0a121f',
        },
        civic: {
          teal: {
            DEFAULT: '#0d9488',
            hover: '#0f766e',
            light: '#ccfbf1',
            dark: '#115e59',
          },
          saffron: {
            DEFAULT: '#e67e22',
            light: '#fef3c7',
            dark: '#b45309',
            accent: '#f59e0b'
          },
          sand: '#fcfbf7',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

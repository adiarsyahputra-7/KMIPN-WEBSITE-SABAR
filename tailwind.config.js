/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./storage/framework/views/*.php",
  ],
  theme: {
    extend: {
      colors: {
        sabar: {
          50: '#f0fdf9',
          100: '#ccfbe8',
          200: '#9af6d4',
          300: '#5ee9bc',
          400: '#2dd49f',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          dark: '#0B1120',
          card: '#131D31',
          cardHover: '#18243D',
          border: '#1E293B',
          accent: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

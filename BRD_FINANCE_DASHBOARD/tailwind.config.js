/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          surface: '#f8fbff',
          panel: '#ffffff',
          nav: '#eff6ff',
          accent: '#1d4ed8',
          accentMuted: '#dbe4ff',
          border: '#dbeafe',
          text: '#0f172a',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
      boxShadow: {
        glow: '0 20px 45px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
}

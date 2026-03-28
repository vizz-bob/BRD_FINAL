/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0F172A',
        'brand-blue': '#2563EB',
        'brand-sky': '#38BDF8',
        'brand-emerald': '#10B981',
        'brand-slate': '#1E293B',
        'brand-sand': '#F8FAFC'
      },
      fontFamily: {
        display: ['"Inter"', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
};

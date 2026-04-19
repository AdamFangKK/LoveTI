/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dynamic-orange': '#FF6B35',
        'soft-cream': '#FFF8F0',
        'glass-white': 'rgba(255, 255, 255, 0.15)',
        'glass-border': 'rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

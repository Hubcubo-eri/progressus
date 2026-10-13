/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { cubo: { DEFAULT: '#10b981', dark: '#059669', soft: '#ecfdf5' } },
      fontFamily: { sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif'] },
    },
  },
  plugins: [],
}

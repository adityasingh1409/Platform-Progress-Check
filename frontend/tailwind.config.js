/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBg: '#f8fafc',
        lightCard: '#ffffff',
        brandPrimary: '#3b82f6',
        brandAccent: '#8b5cf6',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#1a1a1a',
        darkCard: '#282828',
        brandPrimary: '#2cbb5d',
        brandAccent: '#ffa116',
      }
    },
  },
  plugins: [],
}

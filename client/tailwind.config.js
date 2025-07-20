export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Tailwind blue-600
        accent: '#f59e0b',  // amber-500
        background: '#f9fafb', // gray-50
      },
    },
  },
  plugins: [],
}

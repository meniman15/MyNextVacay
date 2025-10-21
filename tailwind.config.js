/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/frontend/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/**/*.tsx",
    "./src/frontend/index.html",
    "./src/frontend/index.css",
    "./src/frontend/TestUI.tsx",
    "src/**/*.{js,ts,jsx,tsx}",
    "src/frontend/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Force generate the classes from TestUI
    'p-8',
    'space-y-4',
    'bg-blue-500',
    'text-white',
    'p-4',
    'rounded-lg',
    'bg-gradient-to-r',
    'from-purple-500',
    'to-pink-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [
     function({ addBase }) {
      console.log("Tailwind plugin is running!");
    }
  ],
}


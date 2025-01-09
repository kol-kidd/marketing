const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      boxShadow: {
        'right': '6px 0px 8px rgba(0, 0, 0, 0.1)', 
        'both': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',  
      },
      fontFamily: {
        'nun': ['Nunito Sans', 'sans-serif']
      },
      backgroundImage: {
        'AI': 'url(./src/assets/bgAI.jpg)'
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
  darkMode: 'class',
}


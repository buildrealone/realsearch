const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,tsx}", 
    "./components/**/*.{js,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        rose: colors.rose,
      },
    },
  },

  plugins: [require("@tailwindcss/forms"), require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
}

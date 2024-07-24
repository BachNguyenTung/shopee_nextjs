const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities }) {
  const newUtilities = {
    '.text-shadow': {
      textShadow: '2px 2px #ff0000',
    },
    '.text-shadow-md': {
      textShadow: '4px 4px #ff0000',
    },
    '.text-shadow-lg': {
      textShadow: '6px 6px #ff0000',
    },
    '.text-shadow-xl': {
      textShadow: '8px 8px #ff0000',
    },
  }

  addUtilities(newUtilities, ['responsive', 'hover'])
})

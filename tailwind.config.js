const sharedConfig = require('@shoppe_nextjs/tailwind-config/tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedConfig],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': 'var(--primary-color)',
        'background': 'var(--background-color)',
      },
    }
  }
}

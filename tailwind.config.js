const sharedConfig = require('@shoppe_nextjs/tailwind-config/tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedConfig],
  theme: {
    extend: {}
  },
  plugins: [
    require('@shoppe_nextjs/tailwind-config/plugins/typography.plugin.js')
  ],
}

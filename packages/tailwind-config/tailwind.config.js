const typographyPlugin = require('./plugins/typography.plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '10': ['10px', '12px'], // tailwindcss uses a tuple to provide a default line-height for each fontSize when use text-**
        '12': ['12px', '14px'],
        '14': ['14px', '16px'],
        '16': ['16px', '18px'],
        '18': ['18px', '20px'],
        '20': ['20px', '24px'],
        '24': ['24px', '28px'],
        '28': ['28px', '32px'],
        '32': ['32px', '36px'],
        '36': ['36px', '40px'],
        '40': ['40px', '44px'],
        '48': ['48px', '52px'],
        '60': ['60px', '66px'],
      },
      fontWeight: {
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      screens: {
        'pc3': '1600px',  // Example breakpoint, change as needed
        'pc2': '1280px',  // Example breakpoint, change as needed
        'mb': '640px',    // Example breakpoint, change as needed
      },
      tabSize: {
        1: '1',
        2: '2',
        4: '4',
        8: '8',
      },
      width: {
        clamp: "clamp(17rem, 19rem, 20rem)"
      }
    },
  },
  plugins: [typographyPlugin],
}

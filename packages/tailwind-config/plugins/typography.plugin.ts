import type { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config'

const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette')
const plugin = require('tailwindcss/plugin')


module.exports = plugin(function ({ addUtilities, matchUtilities, addComponents, theme }: PluginAPI) {


  // generate all value possible
  function generateDefaultValues() {
    const fontWeights = Object.keys(theme('fontWeight'));
    const fontSizes = Object.keys(theme('fontSize'));

    const defaultValues: Record<string, string> = {};

    fontWeights.forEach(weight => {
      fontSizes.forEach(size1 => {
        fontSizes.forEach(size2 => {
          const key = `${weight}-${size1}-${size2}`;
          defaultValues[key] = key;
        });
      });
    });

    return defaultValues;
  }

  function addTypography(
    fontWeight: string,
    mbSize: string,
    pcSize1: string,
    pcSize2?: string
  ) {
    return {
      '@screen pc3': {
        fontSize: theme(`fontSize.${pcSize2 ?? pcSize1}`)?.[0],
        lineHeight: theme(`fontSize.${pcSize2 ?? pcSize1}`)?.[1],
        fontWeight: theme(`fontWeight.${fontWeight}`),
      },
      '@screen pc2': {
        fontSize: theme(`fontSize.${pcSize1}`)?.[0],
        lineHeight: theme(`fontSize.${pcSize1}`)?.[1],
        fontWeight: theme(`fontWeight.${fontWeight}`),
      },
      '@screen mb': {
        fontSize: theme(`fontSize.${mbSize}`)?.[0],
        lineHeight: theme(`fontSize.${mbSize}`)?.[1],
        fontWeight: theme(`fontWeight.${fontWeight}`),
      },
    };
  }

  matchUtilities(
    {
      'typo': (value) => {
        const [fontWeight = 'normal', mbSize = '16', pcSize1 = '18', pcSize2] =
          typeof value === 'string' ? value.split('-') : ['normal', '16', '18'];
        return addTypography(
          fontWeight,
          mbSize,
          pcSize1,
          pcSize2
        ) as CSSRuleObject;
      },
    },
    {
      // Provide default values for the `typo` utility
      // should generate default value depend on needed
      values: generateDefaultValues()
    }
  )

  matchUtilities(
    {
      // Class name
      'my-custom-class': (value) => {
        return {
          backgroundColor: value, // Desired CSS properties here
          color: theme('colors.white') // Just for example non-dynamic value
        }
      },
    },
    // Default values.
    // `flattenColorPalette` required to support native Tailwind color classes like `red-500`, `amber-300`, etc.
    // In most cases you may just pass `theme('config-key')`, where `config-key` could be any (`spacing`, `fontFamily`, `foo`, `bar`)
    { values: flattenColorPalette(theme('colors')) }
  )


  addComponents({
    // Headings
    '.typography-heading3': {
      fontSize: theme('fontSize.lg'),
      lineHeight: '26px',
      fontFamily: theme('fontFamily.heading'),
      fontWeight: theme('fontWeight.semibold'),
      '@screen md': {
        fontSize: '24px',
        lineHeight: '32px',
      },
    },
    '.typography-heading4': {
      fontSize: theme('fontSize.xl'),
      lineHeight: '28px',
      fontFamily: theme('fontFamily.heading'),
      fontWeight: theme('fontWeight.semibold'),
      '@screen md': {
        fontSize: '28px',
        lineHeight: '38px',
      },
    },
  });

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
      textShadow: '9px 8px #ff0000',
    },
  }

  addUtilities(newUtilities)
})

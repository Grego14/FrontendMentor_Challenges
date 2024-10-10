import { createContext } from 'react'

// maybe later improve the way the themes are made
const transparent = 'transparent'
const colors = {
  red: 'var(--red-contrast)',

  rose_50: 'var(--rose-50)',
  rose_100: 'var(--rose-100)',
  rose_300: 'var(--rose-300)',
  rose_400: 'var(--rose-400)',
  rose_500: 'var(--rose-500)',
  rose_900: 'var(--rose-900)',

  dark_bg: '#110F1E',
  // used in the UserData element boxShadow
  dark_shadow: '#242040',

  // names from: https://colors.artyclick.com/color-name-finder/
  dull_lavender: '#af8dea',
  purple_heart: '#673ab7',
  ebony_clay: '#25213c'
}

const productsColors = {
  light: {},

  dark: {}
}

export const themes = {
  light: {
    spinner: {
      spinnerColor: colors.rose_400,
      bgColor: colors.rose_300,
      containerColor: colors.rose_100,

      variants: {
        cart: {
          containerColor: 'var(--rose-50)'
        },
        userdata: {
          containerColor: colors.rose_50
        }
      }
    },

    products: { ...productsColors.light },

    is: 'light'
  },

  dark: {
    spinner: {
      spinnerColor: colors.purple_heart,
      bgColor: '#47426c',
      containerColor: colors.dark_bg,

      variants: {
        cart: {},
        userdata: {
          containerColor: colors.ebony_clay,
          bgColor: '#4c4684',
          spinnerColor: '#917bb7'
        }
      }
    },

    products: { ...productsColors.dark },

    is: 'dark'
  }
}

export const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: () => {}
})

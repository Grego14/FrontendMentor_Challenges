import { createContext } from 'react'

// maybe later improve the way the themes are made
const colors = {
  red: 'var(--red-contrast)',

  rose_50: 'var(--rose-50)',
  rose_100: 'var(--rose-100)',
  rose_300: 'var(--rose-300)',
  rose_400: 'var(--rose-400)',
  rose_500: 'var(--rose-500)',
  rose_900: 'var(--rose-900)',

  dark_bg: '#110F1E',
  // used in the userData element boxShadow
  dark_shadow: '#242040',

  // names from: https://colors.artyclick.com/color-name-finder/
  dull_lavender: '#af8dea',
  purple_heart: '#673ab7',
  ebony_clay: '#25213c'
}

const productsColors = {
  light: {
    category: colors.rose_500,
    count: colors.red,

    price: {
      product: colors.red,
      cartProduct: colors.rose_400
    },

    totalPrice: colors.rose_500,

    quantityButtons: {
      backgroundColor: colors.red,
      color: colors.rose_50,

      hover: {
        backgroundColor: colors.rose_50
      },

      click: {
        backgroundColor: colors.red
      },

      svg: {
        fill: '#ffffff',

        hover: {
          backgroundColor: colors.rose_50,
          fill: colors.red
        }
      }
    },

    addToCartButton: {
      backgroundColor: colors.rose_50,
      borderColor: colors.rose_500,

      hover: {
        backgroundColor: colors.rose_100,
        borderColor: colors.red,
        color: colors.red
      },

      focus: {
        outline: '2px solid var(--red)'
      },

      svg: '#C73B0F'
    },

    image: {
      borderColor: colors.red
    }
  },

  dark: {
    category: '#a4a4a4',
    count: colors.dull_lavender,

    price: {
      product: colors.dull_lavender,
      cartProduct: '#a69abb'
    },

    totalPrice: '#e68fff',

    quantityButtons: {
      backgroundColor: colors.purple_heart,
      color: colors.rose_50,

      hover: {
        backgroundColor: colors.rose_50
      },

      click: {
        backgroundColor: colors.red
      },

      svg: {
        fill: colors.rose_50,

        hover: {
          backgroundColor: colors.rose_50,
          fill: colors.purple_heart
        }
      }
    },

    addToCartButton: {
      backgroundColor: colors.rose_50,
      color: colors.rose_900,
      borderColor: colors.purple_heart,

      hover: {
        backgroundColor: colors.rose_100,
        borderColor: colors.purple_heart,
        color: colors.purple_heart
      },

      focus: {
        outline: `2px solid ${colors.purple_heart}`
      },

      svg: colors.purple_heart
    },

    image: {
      borderColor: colors.purple_heart
    }
  }
}

export const themes = {
  light: {
    app: {
      backgroundColor: colors.rose_100,
      color: colors.rose_900
    },

    themeBtn: {
      backgroundColor: colors.red,
      color: colors.rose_50,

      focus: {
        outline: '2px solid var(--rose-400)'
      }
    },

    cart: {
      backgroundColor: colors.rose_50,
      boxShadow: `0 0 3px ${colors.rose_100}`,
      border: '2px solid transparent',

      title: colors.red,

      carbonNeutral: {
        backgroundColor: colors.rose_100,
        color: colors.rose_900
      },

      noproduct: colors.rose_400,

      confirmBtn: {
        backgroundColor: colors.red
      }
    },

    spinner: {
      spinnerColor: colors.rose_400,
      bgColor: colors.rose_300,
      containerColor: colors.rose_100,

      variants: {
        cart: {
          containerColor: 'var(--rose-50)'
        },
        userData: {
          containerColor: colors.rose_50
        }
      }
    },

    products: { ...productsColors.light },

    modal: {
      boxShadow: `0 0 3px ${colors.rose_100}`,
      backgroundColor: colors.rose_50,

      info: {
        color: colors.rose_900,
        backgroundColor: colors.rose_100
      },

      text: colors.rose_500,

      button: {
        backgroundColor: colors.red,
        color: colors.rose_50
      }
    },

    userData: {
      backgroundColor: colors.rose_50,
      boxShadow: '0 -2px 5px #888',

      userOrder: {
        text: colors.red
      }
    },

    totalPrice: {
      cart: {
        price: colors.rose_500,
        discount: colors.red
      },
      modal: {
        discount: colors.red
      }
    },

    discountInput: {
      backgroundColor: colors.rose_300,
      color: colors.rose_900
    },

    is: 'light'
  },

  dark: {
    app: {
      backgroundColor: colors.dark_bg,
      color: 'var(--rose-50)'
    },

    themeBtn: {
      backgroundColor: colors.purple_heart,
      color: 'var(--rose-50)',

      focus: {
        outline: '2px solid var(--rose-50)'
      }
    },

    cart: {
      backgroundColor: 'transparent',
      border: '2px solid #3c356a',

      noproduct: 'var(--rose-100)',

      carbonNeutral: {
        backgroundColor: colors.dull_lavender,
        color: '#0e0f20'
      },

      title: colors.dull_lavender,

      confirmBtn: {
        backgroundColor: colors.purple_heart
      }
    },

    spinner: {
      spinnerColor: colors.purple_heart,
      bgColor: '#47426c',
      containerColor: colors.dark_bg,

      variants: {
        cart: {},
        userData: {
          containerColor: colors.ebony_clay,
          bgColor: '#4c4684',
          spinnerColor: '#917bb7'
        }
      }
    },

    products: { ...productsColors.dark },

    modal: {
      boxShadow: `0 0 3px ${colors.rose_100}`,
      backgroundColor: '#121020',

      info: {
        color: colors.rose_50,
        backgroundColor: ''
      },

      text: colors.dull_lavender,

      button: {
        backgroundColor: colors.purple_heart,
        color: colors.rose_50
      }
    },

    userData: {
      backgroundColor: colors.ebony_clay,
      boxShadow: `0 -2px 5px ${colors.dark_shadow}`,

      userOrder: {
        text: '#c29fff'
      }
    },

    totalPrice: {
      cart: {
        discount: colors.dull_lavender
      },
      modal: {
        discount: colors.dull_lavender
      }
    },

    discountInput: {
      backgroundColor: colors.dull_lavender,
      color: '#0e0f20'
    },

    is: 'dark'
  }
}

export const ThemeContext = createContext({
  theme: themes.light,
  toggleTheme: () => {}
})

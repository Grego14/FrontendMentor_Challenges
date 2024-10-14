import { motion } from 'framer-motion'
import React, { useEffect, useState, useReducer, useRef } from 'react'
import Cart from '../cart/Cart.jsx'
import OrderModal from '../order/OrderModal.jsx'
import Spinner from '../others/spinner/Spinner.jsx'
import Products from '../product/Product.jsx'
import './App.css'
import productsReducer from '../../reducers/productsReducer.js'
import { ThemeContext, themes } from '../../theme-context.jsx'
import {
  device,
  getTotalPrice,
  getTotalProductPrice,
  invalidUserInteraction
} from '../../utils/utils.js'
import Section from '../others/Section.jsx'
import ToggleThemeButton from '../others/togglethemebutton/ToggleThemeButton.jsx'
import TotalPrice from '../others/totalprice/TotalPrice.jsx'

export default function App() {
  const storage = localStorage
  const cartRef = useRef(null)
  const userDevice = device.any()

  const storageProducts = storage.getItem('products-in-cart')
    ? new Map(Object.values(JSON.parse(storage.getItem('products-in-cart'))))
    : new Map()

  const [products, dispatch] = useReducer(productsReducer, storageProducts)
  const productsInCart = [...products.values()].filter(product => product.cart)

  const [componentStates, setComponentStates] = useState(
    new Map([
      ['modalVisible', false],
      ['cartVisible', false],
      ['productsFetched', false]
    ])
  )

  const [appTheme, setAppTheme] = useState({
    theme: themes[storage.getItem('theme')] || themes.light,
    toggleTheme
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [discount, setDiscount] = useState(storage.getItem('discount') || false)

  function toggleTheme(e) {
    if (e && invalidUserInteraction(e)) return

    setAppTheme(state => {
      const theme = state.theme === themes.light ? 'dark' : 'light'

      storage.setItem('theme', theme)

      return {
        theme: themes[theme],
        toggleTheme
      }
    })
  }

  function handleStates(stateProp, stateValue) {
    setComponentStates(state => {
      if (!state.has(stateProp)) return state

      const map = new Map(state)
      map.set(stateProp, stateValue || !state.get(stateProp))

      return map
    })
  }

  useEffect(() => {
    storage.setItem('discount', discount ? 'true' : '')
  }, [discount, storage.setItem])

  // logs, storage, totalPrice and productsCount
  useEffect(() => {
    console.groupCollapsed('Product Updated')
    console.table([...products.values()])
    console.groupEnd('Product Updated')

    storage.setItem(
      'products-in-cart',
      JSON.stringify(productsInCart.map(product => [product.id, product]))
    )

    setTotalPrice(() => {
      const prices = []

      for (const product of productsInCart) {
        prices.push(getTotalProductPrice(product.price, product.count))
      }

      return getTotalPrice(prices)
    })

    setProductsCount(() => {
      let count = 0

      for (const product of productsInCart) {
        count += product.count
      }

      return count
    })
  }, [products, productsInCart, storage.setItem])

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        console.log('data fetched %o', data)
        //setJsonLength(data.length)
        let idHandler = 0
        const dataWithIds = new Map()

        // fetch products... if they are in the storage they
        // must be in the products Map.
        for (const product of Object.values(data)) {
          const productToAdd = products.get(idHandler) || {
            ...product,
            id: idHandler,
            cart: false,
            count: 1
          }

          // initial will be used to manage ordering animations in the
          // CartProduct component, it means the product was added from
          // the localstorage when the page loads. If the user adds/removes
          // a product, initial must be false so we avoid the delay.
          dataWithIds.set(idHandler, { ...productToAdd, initial: true })
          idHandler++
        }

        dispatch({ type: 'fetch', products: dataWithIds })

        // cool effect
        setTimeout(() => {
          handleStates('productsFetched', true)
        }, 500)
      })
  }, [products.get])

  const scrollingElement = document.scrollingElement
  const productsFetched = componentStates.get('productsFetched')

  !productsFetched || componentStates.get('modalVisible')
    ? scrollingElement.classList.add('no-scroll')
    : scrollingElement.classList.remove('no-scroll')

  const themeClass = `${appTheme.theme.is}-theme`
  const lastThemeClass =
    scrollingElement.classList.value.match(/[a-z]+\-theme/)?.[0]

  scrollingElement.classList.contains(lastThemeClass)
    ? scrollingElement.classList.replace(lastThemeClass, themeClass)
    : scrollingElement.classList.add(themeClass)

  function handleConfirmOrder() {
    handleStates('modalVisible')
  }

  function handleNewOrder(e) {
    if (invalidUserInteraction(e)) return

    dispatch({ type: 'newOrder' })
    handleStates('modalVisible')
    setDiscount(false)
  }

  function handleCartVisibility() {
    handleStates('cartVisible', true)
  }

  const sideContentProps = {
    products: productsInCart,
    discount,
    cart: {
      removeProduct: dispatch,
      productsFetched,
      confirmOrder: handleConfirmOrder,
      setVisible: handleCartVisibility,
      ref: cartRef,
      totalPrice,
      productsCount,
      setDiscount
    },
    modal: {
      newOrder: handleNewOrder,
      visible: componentStates.get('modalVisible')
    }
  }

  const productsProps = {
    products: [...products.values()],
    productsHandler: dispatch,
    productsFetched,
    cartVisible: componentStates.get('cartVisible')
  }

  const userDataProps = {
    cartRef,
    totalPrice,
    productsCount,
    productsFetched,
    discount,
    theme: appTheme.theme
  }

  return (
    <ThemeContext.Provider value={appTheme}>
      <div className='app'>
        <Products {...productsProps} />
        <SideContent {...sideContentProps} />
        {userDevice === 'mobile' ? (
          <UserData {...userDataProps} />
        ) : (
          <ToggleThemeButton />
        )}
      </div>
    </ThemeContext.Provider>
  )
}

function UserData(props) {
  const theme = props.theme
  const userDataRef = useRef(null)
  const userDevice = device.any()
  const [isMoving, setIsMoving] = useState(false)

  const options = {
    root: null,
    rootMargin: '0px',
    // threshold[0] = when to move the userData to its initial position
    // threshold[1] = when to move the userData to the top of the screen
    // so it doesn't overlaps the confirm button in mobile devices...
    threshold: [0.2, 0.4]
  }
  const observer = new IntersectionObserver(callback, options)

  function callback(entries, observer) {
    for (const entrie of entries) {
      const ths = observer.thresholds
      const ratio = entrie.intersectionRatio

      if (ratio <= 0 || !entrie.isIntersecting) return false

      if (ratio >= ths[0] && ratio < ths[1]) {
        userDataRef.current.style.bottom = '0'
        userDataRef.current.style.top = 'unset'
      }

      if (ratio >= ths[1] && ratio > ths[0]) {
        userDataRef.current.style.bottom = 'unset'
        userDataRef.current.style.top = '0'
      }

      setIsMoving(true)
    }
  }

  useEffect(() => {
    if (userDevice === 'mobile') {
      observer.observe(props.cartRef.current)
    }

    return () => {
      if (userDevice === 'mobile') {
        observer.disconnect(props.cartRef.current)
      }
    }
  }, [props.cartRef.current, observer.observe, observer.disconnect, userDevice])

  const userOrderProps = {
    totalPrice: props.totalPrice,
    productsCount: props.productsCount,
    visible: props.productsFetched,
    discount: props.discount
  }

  const userDataContainerVariants = {
    hidden: {
      opacity: 0,
      scale: 0
    },
    show: {
      opacity: 1,
      scale: 1
    }
  }

  const userDataVariants = {
    hidden: {
      opacity: 0,
      y: '150%'
    },
    show: {
      opacity: 1,
      y: '0%'
    },
    move: {
      opacity: [0, 1],
      transition: {
        duration: 0.3
      },
      transitionEnd(e) {
        setTimeout(() => {
          setIsMoving(false)
        }, 50)
      }
    }
  }

  return (
    <motion.section
      className='app-section app-section--user-data'
      ref={userDataRef}
      initial='hidden'
      animate={['show', isMoving ? 'move' : '']}
      variants={userDataVariants}
      transition={{
        delay: 0.2,
        duration: 0.5,
        ease: 'easeInOut'
      }}>
      {props.productsFetched ? (
        <motion.div
          className='user-data-container'
          initial='hidden'
          animate='show'
          transition={{
            duration: 0.3
          }}
          variants={userDataContainerVariants}>
          <UserOrder {...userOrderProps} />

          <Section isFor='toggle-theme'>
            <ToggleThemeButton />
          </Section>
        </motion.div>
      ) : (
        <Spinner isFor='user-data' />
      )}
    </motion.section>
  )
}

function UserOrder({ visible, productsCount, totalPrice, discount }) {
  const userOrderVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: '-150%'
    },
    show: {
      opacity: 1,
      scale: 1
    }
  }

  return (
    <motion.div
      initial='show'
      animate={'show'}
      variants={userOrderVariants}
      role='status'
      aria-live='polite'
      aria-atomic='true'
      className='user-order'>
      <div>
        Products:{' '}
        <span className='user-order__products-count'>{productsCount}</span>
      </div>
      <div>
        Total Price:{' '}
        <TotalPrice
          price={totalPrice}
          discount={discount}
          totalClassName=' user-order__total-price'
        />
      </div>
    </motion.div>
  )
}

function SideContent({ products, discount, cart, modal }) {
  return (
    <>
      <Section isFor='cart'>
        <Cart {...cart} {...{ products, discount }} />
      </Section>

      <Section isFor='modal pos-absolute'>
        <OrderModal {...modal} {...{ products, discount }} />
      </Section>
    </>
  )
}

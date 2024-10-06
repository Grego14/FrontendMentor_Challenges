import { motion } from 'framer-motion'
import React, {
  useEffect,
  useState,
  useReducer,
  useContext,
  useRef
} from 'react'
import Cart from './components/cart/Cart.jsx'
import OrderModal from './components/order/OrderModal.jsx'
import Spinner from './components/others/Spinner.jsx'
import Products from './components/product/Product.jsx'
import './App.css'
import Section from './components/others/Section.jsx'
import useFocus from './hooks/useFocus.jsx'
import { ThemeContext, themes } from './theme-context'
import utils from './utils/utils.js'

function reducer(state, action) {
  switch (action.type) {
    case 'cart': {
      const map = new Map(state)
      const id = action.id
      const element = state.get(id)

      if (!element) return state

      const elementProps = { ...element, cart: !element.cart }

      map.set(id, {
        ...elementProps,

        // if elementProps.cart is false it means the product is being removed
        // so count should be reset to 1 and initial should be false otherwise
        // the initial animation will be fired once added again.
        count: elementProps.cart ? elementProps.count : 1,
        initial: false
      })
      return map
    }

    case 'quantity': {
      const id = action.id
      const element = state.get(id)
      const map = new Map(state)
      const quantity = action.quantity

      if (!element) return state

      let count = element.count
      quantity === 'increment' ? count++ : count--

      const elementProps = { ...element, count }
      const { name, category } = elementProps

      // compared to 0 because above the count is decremented
      // and if it was 1 now is 0
      if (quantity === 'decrement' && count === 0) {
        elementProps.cart = false
        elementProps.count = 1
      }

      map.set(id, elementProps)
      return map
    }

    case 'fetch':
      return new Map(action.products)

    case 'newOrder': {
      const map = new Map()

      for (const product of [...state.values()]) {
        map.set(product.id, { ...product, cart: false, count: 1 })
      }

      return map
    }

    default:
      return state
  }
}

export default function App() {
  const storage = localStorage
  const cartRef = useRef(null)

  const [componentStates, setComponentStates] = useState(
    new Map([
      ['modalVisible', false],
      ['cartVisible', false],
      ['productsFetched', false]
    ])
  )

  const [totalPrice, setTotalPrice] = useState(0)
  const [productsCount, setProductsCount] = useState(0)

  const storageProducts = storage.getItem('products-in-cart')
    ? new Map(Object.values(JSON.parse(storage.getItem('products-in-cart'))))
    : new Map()

  const [products, dispatch] = useReducer(reducer, storageProducts)
  const productsInCart = [...products.values()].filter(product => product.cart)

  const [appTheme, setAppTheme] = useState({
    theme: themes[storage.getItem('theme')] || themes.light,
    toggleTheme
  })

  const [discount, setDiscount] = useState(storage.getItem('discount') || false)

  // to avoid fetching the data.json again...
  //const [jsonLength, setJsonLength] = useState(0)

  function toggleTheme() {
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
        prices.push(utils.getTotalProductPrice(product.price, product.count))
      }

      return utils.getTotalPrice(prices)
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
    //if (jsonLength) return

    fetch('../data.json')
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
        }, 1000)
      })
  }, [products.get /*jsonLength*/])

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
    if (utils.invalidUserInteraction(e)) return

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
      style: {
        ...appTheme.theme.cart
      },
      ref: cartRef,
      totalPrice,
      productsCount,
      setDiscount,
      theme: appTheme.theme
    },
    modal: {
      newOrder: handleNewOrder,
      visible: componentStates.get('modalVisible'),
      style: {
        ...appTheme.theme.modal
      }
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
    theme: appTheme.theme,
    discount
  }

  return (
    <ThemeContext.Provider value={appTheme}>
      <div className='app' style={appTheme.theme.app}>
        <UserData {...userDataProps} />
        <Products {...productsProps} />
        <SideContent {...sideContentProps} />
      </div>
    </ThemeContext.Provider>
  )
}

function UserData(props) {
  const theme = props.theme
  const userDataRef = useRef(null)
  const device = utils.device.any()
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
    if (device === 'mobile') {
      observer.observe(props.cartRef.current)
    }

    return () => {
      if (device === 'mobile') {
        observer.disconnect(props.cartRef.current)
      }
    }
  }, [props.cartRef.current, observer.observe, observer.disconnect, device])

  const userOrderProps = {
    totalPrice: props.totalPrice,
    productsCount: props.productsCount,
    theme,
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
      style={{
        ...theme.userData
      }}
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
        <Spinner
          {...{ ...theme.spinner, ...theme.spinner.variants.userData }}
        />
      )}
    </motion.section>
  )
}

function UserOrder({ visible, productsCount, totalPrice, theme, discount }) {
  const textTheme = theme.userData.userOrder.text
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
      aria-hidden={visible ? 'false' : 'true'}
      variants={userOrderVariants}
      role='status'
      aria-live='polite'
      aria-atomic='true'
      className='user-order'>
      <div>
        Products:{' '}
        <span
          className='user-order__products-count'
          style={{ color: textTheme }}>
          {productsCount}
        </span>
      </div>
      <div>
        Total Price:{' '}
        <TotalPrice
          price={totalPrice}
          discount={discount}
          totalClassName=' user-order__total-price'
          totalStyle={{ color: discount ? 'inherit' : textTheme }}
          discountStyle={{
            color: textTheme,
            fontSize: '1.2rem'
          }}
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

function ToggleThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [isFocused, focusHandlers] = useFocus()

  return (
    <button
      className='toggle-theme'
      onClick={toggleTheme}
      type='button'
      onFocus={focusHandlers.focus}
      onBlur={focusHandlers.blur}
      style={{
        ...theme.themeBtn,
        ...(isFocused ? theme.themeBtn.focus : theme.themeBtn)
      }}>
      {/* maybe later use icons */}
      {theme.is === 'dark' ? 'L' : 'D'}
    </button>
  )
}

export function TotalPrice({
  price,
  discount,
  totalClassName,
  discountClassName,
  totalStyle,
  discountStyle
}) {
  return (
    <div className='total-price-container'>
      <span
        className={`price${totalClassName ? totalClassName : ''}`}
        style={totalStyle}>
        {utils.transformPrice(price)}
      </span>
      {discount && (
        <span
          className={`discount-price${discountClassName ? discountClassName : ''}`}
          style={discountStyle}>
          {utils.transformPrice(price - price / 10)}
        </span>
      )}
    </div>
  )
}

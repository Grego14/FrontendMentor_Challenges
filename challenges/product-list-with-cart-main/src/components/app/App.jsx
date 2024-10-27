import { LazyMotion, domAnimation } from 'framer-motion'
import { useEffect, useReducer, useRef, useState } from 'react'
import Cart from '../cart/Cart.jsx'
import OrderModal from '../order/OrderModal.jsx'
import Products from '../product/Product.jsx'
import './App.css'
import productsReducer from '../../reducers/productsReducer.js'
import {
  device,
  getTotalPrice,
  getTotalProductPrice,
  invalidUserInteraction
} from '../../utils/utils.js'
import ToggleThemeButton from '../others/togglethemebutton/ToggleThemeButton.jsx'
import TotalPrice from '../others/totalprice/TotalPrice.jsx'
import UserData from './userdata/UserData.jsx'

export default function App() {
  const storage = localStorage
  const cartRef = useRef(null)
  const userDevice = device.any()

  const storageProducts = storage.getItem('products-in-cart')
    ? parseMapFromStorage(storage.getItem('products-in-cart'))
    : new Map()

  const storageStock = storage.getItem('stock-quantitys')
    ? parseMapFromStorage(storage.getItem('stock-quantitys'))
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
    theme: storage.getItem('theme') || 'light',
    toggleTheme
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [discount, setDiscount] = useState(storage.getItem('discount') || false)

  function toggleTheme(e) {
    if (e && invalidUserInteraction(e)) return

    setAppTheme(state => {
      const theme = state.theme === 'light' ? 'dark' : 'light'

      storage.setItem('theme', theme)

      return {
        theme: theme,
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

  // biome-ignore lint: handleStates should not be used here as dependency
  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        console.log('data fetched %o', data)
        let idHandler = 0
        const dataWithIds = new Map()

        // fetch products... if they are in the storage they must be in the
        // products Map.
        for (const product of Object.values(data)) {
          // if the product isn't in the storage we set default values
          const productToAdd = products.get(idHandler) || {
            ...product,
            id: idHandler,
            cart: false,
            count: 0,
            // initial will be used to manage ordering animations in the
            // CartProduct component, it means the product was added from
            // the localstorage when the page loads. If the user adds/removes
            // a product, initial must be false so we avoid the delay.
            initial: true
          }

          productToAdd.quantity =
            storageStock?.get(idHandler) ?? Math.floor(Math.random() * 20 + 1)
          productToAdd.outOfStock = productToAdd.count >= productToAdd.quantity

          dataWithIds.set(productToAdd.id, productToAdd)
          idHandler++
        }

        if (!storage.getItem('stock-quantitys')) {
          storage.setItem(
            'stock-quantitys',
            JSON.stringify(
              [...dataWithIds.values()].map(product => [
                product.id,
                product.quantity
              ])
            )
          )
        }

        dispatch({ type: 'fetch', products: dataWithIds })
        handleStates('productsFetched', true)
      })
  }, [products.get, storageStock.get, storage.setItem, storage.getItem])

  useEffect(() => {
    storage.setItem('discount', discount ? 'true' : '')
  }, [discount, storage.setItem])

  // logs, storage
  useEffect(() => {
    console.groupCollapsed('Products Updated')
    console.table([...products.values()])
    console.groupEnd('Products Updated')

    storage.setItem(
      'products-in-cart',
      JSON.stringify(productsInCart.map(product => [product.id, product]))
    )
  }, [products, productsInCart.map, storage.setItem])

  useEffect(() => {
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
  }, [productsInCart])

  const scrollingElement = document.scrollingElement
  const productsFetched = componentStates.get('productsFetched')

  // prevent scrolling when the products aren't fetched or the modal is visible
  !productsFetched || componentStates.get('modalVisible')
    ? scrollingElement.classList.add('no-scroll')
    : scrollingElement.classList.remove('no-scroll')

  const themeClass = `${appTheme.theme}-theme`
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
    theme: appTheme.theme,
    toggleTheme: appTheme.toggleTheme
  }

  const cartProps = {
    removeProduct: dispatch,
    productsFetched,
    confirmOrder: handleConfirmOrder,
    setVisible: handleCartVisibility,
    ref: cartRef,
    totalPrice,
    productsCount,
    setDiscount
  }

  const modalProps = {
    newOrder: handleNewOrder,
    visible: componentStates.get('modalVisible')
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className='app'>
        <Products {...productsProps} />

        <Cart {...cartProps} products={productsInCart} discount={discount} />
        <OrderModal
          {...modalProps}
          products={productsInCart}
          discount={discount}
        />

        {userDevice === 'mobile' ? (
          <UserData {...userDataProps} />
        ) : (
          <ToggleThemeButton
            theme={appTheme.theme}
            toggleTheme={appTheme.toggleTheme}
          />
        )}
      </div>
    </LazyMotion>
  )
}

// only used here so don't move to utils folder
function parseMapFromStorage(mapInStorage) {
  return new Map(Object.values(JSON.parse(mapInStorage)))
}

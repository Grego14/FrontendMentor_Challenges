import { LazyMotion, domAnimation } from 'framer-motion'
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react'
import Products from '../product/Product.jsx'
import './App.css'
import productsReducer from '../../reducers/productsReducer.js'
import {
  device,
  getTotalPrice,
  getTotalProductPrice,
  invalidUserInteraction
} from '../../utils/utils.js'

const Cart = lazy(() => import('../cart/Cart.jsx'))
const OrderModal = lazy(() => import('../order/OrderModal.jsx'))
const UserData = lazy(() => import('./userdata/UserData.jsx'))

const ToggleThemeButton = lazy(
  () => import('../others/togglethemebutton/ToggleThemeButton.jsx')
)

export default function App() {
  const storage = localStorage
  const cartRef = useRef(null)
  const userDevice = device.any()

  const storageStock = getMapFromStorage(storage.getItem('stock-quantitys'))

  const [products, dispatch] = useReducer(
    productsReducer,
    getMapFromStorage(storage.getItem('products-in-cart'))
  )

  const productsInCart = [...products.values()].filter(product => product?.cart)

  const [modalVisible, setModalVisible] = useState(false)
  const [productsFetched, setProductsFetched] = useState(false)

  const [appTheme, setAppTheme] = useState({
    theme: storage.getItem('theme') || 'light',
    toggleTheme
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [productsCount, setProductsCount] = useState(0)
  const [discount, setDiscount] = useState(storage.getItem('discount') || false)

  function toggleTheme(e) {
    if (invalidUserInteraction(e)) return

    setAppTheme(state => {
      const theme = state.theme === 'light' ? 'dark' : 'light'

      storage.setItem('theme', theme)

      return {
        theme: theme,
        toggleTheme
      }
    })
  }

  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(data => {
        let idHandler = 0
        const dataWithIds = new Map()
        const l = data.length
        // fetch products... if they are in the
        // storage they must be in the products Map.
        for (let i = 0; i < l; i++) {
          const product = data[i]
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
            initial: true,
            quantity:
              storageStock?.get(idHandler) ?? Math.floor(Math.random() * 20 + 1)
          }

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
        setProductsFetched(true)
      })
  }, [storageStock.get, storage.setItem, storage.getItem, products.get])

  useEffect(() => {
    storage.setItem('discount', discount ? 'true' : '')
  }, [discount, storage.setItem])

  useEffect(() => {
    storage.setItem(
      'products-in-cart',
      JSON.stringify(productsInCart.map(product => [product.id, product]))
    )
  }, [storage.setItem, productsInCart])

  useEffect(() => {
    const l = productsInCart.length
    const prices = []
    let count = 0

    for (let i = 0; i < l; i++) {
      const product = productsInCart[i]

      prices.push(getTotalProductPrice(product.price, product.count))
      count += product.count
    }

    setTotalPrice(getTotalPrice(prices))
    setProductsCount(count)
  }, [productsInCart])

  const scrollingElement = document.scrollingElement

  // prevent scrolling when the products aren't fetched or the modal is visible
  !productsFetched || modalVisible
    ? scrollingElement.classList.add('no-scroll')
    : scrollingElement.classList.remove('no-scroll')

  const themeClass = `${appTheme.theme}-theme`
  const lastThemeClass =
    scrollingElement.classList.value.match(/[a-z]+\-theme/)?.[0]

  scrollingElement.classList.contains(lastThemeClass)
    ? scrollingElement.classList.replace(lastThemeClass, themeClass)
    : scrollingElement.classList.add(themeClass)

  function handleModalVisibility() {
    setModalVisible(state => !state)
  }

  function handleNewOrder(e) {
    if (invalidUserInteraction(e)) return

    dispatch({ type: 'newOrder' })
    handleModalVisibility()
    setDiscount(false)
  }

  const productsHandler = useCallback(({ id, type }) => {
    dispatch({ id, type })
  }, [])

  const productsProps = {
    products: [...products.values()],
    productsHandler,
    productsFetched
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
    confirmOrder: handleModalVisibility,
    ref: cartRef,
    totalPrice,
    productsCount,
    setDiscount
  }

  const modalProps = {
    newOrder: handleNewOrder,
    visible: modalVisible
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className='app'>
        <Products {...productsProps} />

        <Suspense>
          {productsFetched && (
            <Cart
              {...cartProps}
              products={productsInCart}
              discount={discount}
            />
          )}

          {modalProps.visible && (
            <OrderModal
              {...modalProps}
              products={productsInCart}
              discount={discount}
            />
          )}

          {userDevice === 'mobile' && productsFetched ? (
            <UserData {...userDataProps} />
          ) : (
            <ToggleThemeButton
              theme={appTheme.theme}
              toggleTheme={appTheme.toggleTheme}
            />
          )}
        </Suspense>
      </div>
    </LazyMotion>
  )
}

function getMapFromStorage(mapOnStorage) {
  const data = Object.values(JSON.parse(mapOnStorage || '[]'))
  return !data || data.length === 0 ? new Map() : new Map(data)
}

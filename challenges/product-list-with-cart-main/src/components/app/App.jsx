import { LazyMotion, domAnimation, useInView } from 'framer-motion'
import {
  Suspense,
  lazy,
  memo,
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
  transformPrice
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

  const storageStock = getMapFromStorage(storage.getItem('stock-quantitys'))

  const [products, dispatch] = useReducer(
    productsReducer,
    getMapFromStorage(storage.getItem('products-in-cart'))
  )

  const productsInCart = [...products.values()].filter(product => product?.cart)

  const [modalVisible, setModalVisible] = useState(false)
  const [productsFetched, setProductsFetched] = useState(false)
  const [cartVisible, setCartVisible] = useState(false)

  const [discount, setDiscount] = useState(
    () => storage.getItem('discount') || false
  )

  let totalPrice = 0
  let productsCount = 0

  const l = productsInCart.length
  const prices = []
  let count = 0

  for (let i = 0; i < l; i++) {
    const product = productsInCart[i]

    prices.push(getTotalProductPrice(product.price, product.count))
    count += product.count
  }

  storage.setItem(
    'products-in-cart',
    JSON.stringify(productsInCart.map(product => [product.id, product]))
  )

  totalPrice = getTotalPrice(prices)
  productsCount = count

  const TotalPriceComponent = () => (
    <TotalPrice price={totalPrice} discount={discount} amount={20} />
  )

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
            quantity:
              storageStock?.get(idHandler) ?? Math.floor(Math.random() * 20 + 1)
          }

          // initial will be used to manage ordering animations in the
          // CartProduct component, it means the product was added from
          // the localstorage when the page loads. If the user adds/removes
          // a product, initial must be false so we avoid the delay.
          productToAdd.initial = true
          productToAdd.outOfStock = productToAdd.count >= productToAdd.quantity

          dataWithIds.set(productToAdd.id, productToAdd)
          idHandler++
        }

        !storage.getItem('stock-quantitys') &&
          storage.setItem(
            'stock-quantitys',
            JSON.stringify(
              [...dataWithIds.values()].map(product => [
                product.id,
                product.quantity
              ])
            )
          )

        dispatch({ type: 'fetch', products: dataWithIds })
        setProductsFetched(true)
      })
  }, [storageStock.get, storage.setItem, storage.getItem, products.get])

  function toggleTheme() {
    setAppTheme(state => {
      const theme = state.theme === 'light' ? 'dark' : 'light'

      storage.setItem('theme', theme)

      return {
        theme: theme,
        toggleTheme
      }
    })
  }

  const [appTheme, setAppTheme] = useState(() => ({
    theme: storage.getItem('theme') || 'light',
    toggleTheme
  }))

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

  function handleDiscount(value) {
    setDiscount(value)
    storage.setItem('discount', discount ? 'true' : '')
  }

  function handleModalVisibility() {
    setModalVisible(state => !state)
  }

  function newOrder(e) {
    dispatch({ type: 'newOrder' })
    handleModalVisibility()
    handleDiscount(false)
  }

  const layoutData = {
    products: [...products.values()],
    dispatch,

    totalPrice,
    productsInCart,
    productsCount,
    discount,
    TotalPriceComponent,

    confirmOrder: handleModalVisibility,
    handleDiscount,
    setCartVisible,
    newOrder,

    cartVisible,
    modalVisible,
    cartRef,
    productsFetched,

    ...appTheme
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className='app'>
        <Suspense>
          <Layout {...layoutData} />
        </Suspense>
      </div>
    </LazyMotion>
  )
}

function Layout(props) {
  const {
    products,
    dispatch: productsHandler,

    totalPrice,
    productsInCart,
    productsCount,
    discount,
    TotalPriceComponent,

    confirmOrder,
    handleDiscount,
    setCartVisible,
    newOrder,

    cartVisible,
    modalVisible,
    cartRef,
    productsFetched,

    toggleTheme,
    theme
  } = props

  const productsProps = {
    productsFetched,
    TotalPriceComponent,
    products,
    productsHandler
  }

  const cartProps = {
    productsInCart,
    confirmOrder,
    totalPrice,
    productsCount,
    handleDiscount,
    discount,
    setCartVisible,
    TotalPriceComponent,
    productsHandler
  }

  const modalProps = {
    productsInCart,
    newOrder,
    totalPrice,
    TotalPriceComponent
  }

  const userDataProps = {
    productsCount,
    productsFetched,
    TotalPriceComponent,
    cartRef
  }

  if (cartVisible) {
    import('../order/OrderModal.jsx')
  }

  return (
    <>
      <Products {...productsProps} />

      {productsFetched && <Cart {...cartProps} ref={cartRef} />}

      {productsFetched &&
        (device.any() === 'mobile' ? (
          <UserData {...userDataProps}>
            <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
          </UserData>
        ) : (
          <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
        ))}

      {modalVisible && <OrderModal {...modalProps} />}
    </>
  )
}

function getMapFromStorage(mapOnStorage) {
  const data = [...JSON.parse(mapOnStorage || '[]')]
  return !data || data.length === 0 ? new Map() : new Map(data)
}

function TotalPrice({ price, discount, amount }) {
  return (
    <div className='total-price-container'>
      <span className='price'>{transformPrice(price)}</span>
      {discount && (
        <span className='discount-price'>
          {transformPrice(price - (price / 100) * (amount || 10))}
        </span>
      )}
    </div>
  )
}

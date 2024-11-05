import { LazyMotion, useInView } from 'framer-motion'
import {
  Suspense,
  forwardRef,
  lazy,
  memo,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react'
import productsReducer from '../../reducers/productsReducer.js'
import {
  device,
  extractId,
  getTotalPrice,
  getTotalProductPrice,
  invalidUserInteraction,
  transformPrice
} from '../../utils/utils.js'
import Product from '../product/Product.jsx'

const Cart = lazy(() => import('../cart/Cart.jsx'))
const OrderModal = lazy(() => import('../order/OrderModal.jsx'))
const UserData = lazy(() => import('./userdata/UserData.jsx'))

const ToggleThemeButton = lazy(
  () => import('../others/togglethemebutton/ToggleThemeButton.jsx')
)

export default function App() {
  const cartRef = useRef(null)

  const [products, dispatch] = useReducer(productsReducer, new Map())
  const productsArr = [...products.values()]
  const productsInCart = productsArr.filter(product => product?.cart)

  const [modalVisible, setModalVisible] = useState(false)
  const [productsFetched, setProductsFetched] = useState(false)
  const [cartVisible, setCartVisible] = useState(false)

  const storage = localStorage
  const [discount, setDiscount] = useState(storage.getItem('discount') || false)
  const storageStock = getMapFromStorage(storage.getItem('stock-quantitys'))

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data.json`)
      .then(res => res.json())
      .then(data => {
        let idHandler = 0
        const dataWithIds = new Map()
        const l = data.length
        // fetch products... if they are in the
        // storage they must be in the products Map.
        for (let i = 0; i < l; i++) {
          const product = data[i]
          const productsStorage = getMapFromStorage(storage.getItem('products'))

          // if the product isn't in the storage we set default values
          const productToAdd = productsStorage.get(idHandler) || {
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
  }, [storageStock.get, storage.setItem, storage.getItem])

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

  totalPrice = getTotalPrice(prices)
  productsCount = count

  const TotalPriceComponent = () => (
    <TotalPrice price={totalPrice} discount={discount} amount={20} />
  )

  if (productsArr.length > 0) {
    storage.setItem(
      'products',
      JSON.stringify(productsArr.map(product => [product.id, product]))
    )
  }

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
    storage.setItem('discount', value ? 'true' : '')
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
    products: productsArr,
    dispatch,

    totalPrice,
    productsInCart,
    productsCount,
    discount,
    TotalPriceComponent,

    confirmOrder: handleModalVisibility,
    handleDiscount,
    setCartVisible,

    cartVisible,
    cartRef,
    productsFetched,

    ...appTheme
  }

  const modalProps = {
    productsInCart,
    newOrder,
    totalPrice,
    TotalPriceComponent
  }

  const loadFeatures = () => import('./fm-features.js').then(res => res.default)

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className='app' aria-live='polite'>
        <Layout {...layoutData} />

        <Suspense>{modalVisible && <OrderModal {...modalProps} />}</Suspense>
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

    cartVisible,
    cartRef,
    productsFetched,

    toggleTheme,
    theme
  } = props

  const [halfProductsVisible, setHalfProductsVisible] = useState(false)
  const timeout = useRef(null)
  const productsRef = useRef(null)

  useEffect(() => {
    function handleScroll() {
      clearTimeout(timeout.current)

      // debounce the event
      timeout.current = setTimeout(() => {
        setHalfProductsVisible(state => {
          if (state || device.any() !== 'mobile') return true

          if (
            document.scrollingElement.scrollTop >=
            productsRef.current.clientHeight / 2
          )
            return true

          return false
        })
      }, 300)
    }

    if (productsRef.current) {
      handleScroll()

      document.addEventListener('scroll', handleScroll)

      return () => {
        document.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

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

  const userDataProps = {
    productsCount,
    productsFetched,
    TotalPriceComponent,
    cartRef
  }

  if (cartVisible && productsCount > 0) {
    import('../order/OrderModal.jsx')
  }

  return (
    <>
      <Products {...productsProps} ref={productsRef} />

      <Suspense>
        {halfProductsVisible && <Cart {...cartProps} ref={cartRef} />}
      </Suspense>

      <Suspense>
        {productsFetched &&
          (device.any() === 'mobile' ? (
            <UserData {...userDataProps}>
              <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
            </UserData>
          ) : (
            <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
          ))}
      </Suspense>
    </>
  )
}

const Products = forwardRef((props, ref) => {
  const { products, productsHandler, productsFetched } = props

  function handleProducts(e) {
    if (invalidUserInteraction(e)) return

    const button = e.target.dataset.action
      ? e.target
      : e.target.closest('[data-action]')

    if (!button || button.disabled) return

    const userAction = button.dataset.action
    const id = extractId(e)

    if (!userAction || (id !== 0 && !id)) return

    productsHandler({
      id,
      type: userAction
    })
  }

  return (
    <div className='products-section'>
      <h1 className='products-title'>Desserts</h1>
      <div
        ref={ref}
        className='products'
        onPointerUp={handleProducts}
        onKeyDown={handleProducts}>
        {productsFetched &&
          products.map(product => <Product data={product} key={product?.id} />)}
      </div>
    </div>
  )
})

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

function getMapFromStorage(mapOnStorage) {
  const data = [...JSON.parse(mapOnStorage || '[]')]
  return !data || data.length === 0 ? new Map() : new Map(data)
}

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
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
import useDebounce from '../../hooks/useDebounce.jsx'
import productsReducer from '../../reducers/productsReducer.js'
import statesReducer from '../../reducers/statesReducer.js'
import {
  device,
  extractProductId,
  getTotalPrice,
  getTotalProductPrice,
  invalidUserInteraction,
  transformPrice
} from '../../utils/utils.js'
import Product from '../product/Product.jsx'

const Cart = lazy(() => import('../cart/Cart.jsx'))
const OrderModal = lazy(() => import('../order/OrderModal.jsx'))
const UserData = lazy(() => import('./userdata/UserData.jsx'))
const TotalPrice = lazy(() => import('./TotalPrice.jsx'))

const ToggleThemeButton = lazy(
  () => import('../others/togglethemebutton/ToggleThemeButton.jsx')
)

export default function App() {
  const cartRef = useRef(null)

  const [cartSort, setCartSort] = useState(0)

  const [products, dispatchProducts] = useReducer(productsReducer, new Map())
  const productsArr = [...products.values()]

  const productsInCart = productsArr
    .filter(product => product?.cart)
    .sort((a, b) => {
      if (cartSort === 1) return a.totalPrice - b.totalPrice
      if (cartSort === 2) return b.totalPrice - a.totalPrice

      return a.order - b.order
    })

  const [appStates, dispatchStates] = useReducer(
    statesReducer,
    new Map(),
    map => {
      map.set('cartVisible', false)
      map.set('modalVisible', false)
      map.set('productsFetched', false)

      return map
    }
  )

  const storage = localStorage
  const [discount, setDiscount] = useState(storage.getItem('discount') || false)
  const storageStock = getMapFromStorage(storage.getItem('stock-quantitys'))

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data.json`

    fetch(url, {
      priority: 'high',
      mode: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        let idHandler = 0
        const dataConverted = new Map()
        const l = data.length
        const productsStorage = getMapFromStorage(storage.getItem('products'))

        for (let i = 0; i < l; i++) {
          const product = data[i]

          // if the product isn't in the storage we set default values
          const productToAdd = productsStorage.get(idHandler) || {
            ...product,
            id: idHandler,
            cart: false,
            count: 0,
            quantity:
              storageStock.get(idHandler) || Math.floor(Math.random() * 20 + 1)
          }

          // initial will be used to manage ordering animations in the
          // CartProduct component, it means the product was added from
          // the localstorage when the page loads. If the user adds/removes
          // a product, initial must be false so we avoid the delay.
          productToAdd.initial = true
          productToAdd.outOfStock = productToAdd.count >= productToAdd.quantity

          dataConverted.set(productToAdd.id, productToAdd)
          idHandler++
        }
        ;[...storageStock.values()].length <= 0 &&
          storage.setItem(
            'stock-quantitys',
            JSON.stringify(
              [...dataConverted.values()].map(product => [
                product.id,
                product.quantity
              ])
            )
          )

        dispatchProducts({ type: 'fetch', products: dataConverted })
        dispatchStates({ state: 'productsFetched', value: true })
      })
  }, [storageStock.get, storage.setItem, storage.getItem, storageStock.values])

  let totalPrice = 0
  let productsCount = 0

  !(() => {
    const prices = []
    let count = 0

    for (let i = 0; i < productsInCart.length; i++) {
      const product = productsInCart[i]

      prices.push(getTotalProductPrice(product.price, product.count))
      count += product.count
    }

    totalPrice = getTotalPrice(prices)
    productsCount = count
  })()

  const TotalPriceComponent = memo(() => (
    <TotalPrice price={totalPrice} discount={discount} amount={20} />
  ))

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
  !appStates.get('productsFetched') || appStates.get('modalVisible')
    ? scrollingElement.classList.add('no-scroll')
    : scrollingElement.classList.remove('no-scroll')

  const themeClass = `${appTheme.theme}-theme`
  const lastThemeClass =
    scrollingElement.classList.value.match(/[a-z]+\-theme/)?.[0]

  scrollingElement.classList.contains(lastThemeClass)
    ? scrollingElement.classList.replace(
        lastThemeClass,
        themeClass,
        lastThemeClass !== themeClass
      )
    : scrollingElement.classList.add(themeClass)

  function handleDiscount(value) {
    setDiscount(value)
    storage.setItem('discount', value ? 'true' : '')
  }

  function newOrder(e) {
    dispatchProducts({ type: 'newOrder' })
    dispatchStates({ state: 'modalVisible', value: false })
    handleDiscount(false)
  }

  const layoutData = {
    products: productsArr,
    dispatchProducts,
    dispatchStates,

    productsInCart,
    productsCount,
    discount,
    TotalPriceComponent,

    handleDiscount,
    setCartSort,

    cartVisible: appStates.get('cartVisible'),
    cartRef,
    productsFetched: appStates.get('productsFetched'),

    ...appTheme
  }

  const modalProps = {
    productsInCart,
    newOrder,
    TotalPriceComponent
  }

  return (
    <MotionConfig
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
      reducedMotion='user'>
      <LazyMotion features={domAnimation}>
        <div className='app'>
          <Layout {...layoutData} />
          <Suspense>
            {appStates.get('modalVisible') && <OrderModal {...modalProps} />}
          </Suspense>
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}

function Layout(props) {
  const {
    products,
    dispatchProducts: productsHandler,
    dispatchStates,

    productsInCart,
    productsCount,
    discount,
    TotalPriceComponent,

    handleDiscount,
    setCartSort,

    cartVisible,
    cartRef,
    productsFetched,

    toggleTheme,
    theme
  } = props

  const [loadCart, setLoadCart] = useState(false)
  const [halfProductsVisible, setHalfProductsVisible] = useState(false)
  const productsRef = useRef(null)

  const [isDebouncing, handleScroll] = useDebounce(() => {
    setHalfProductsVisible(state => {
      if (
        state ||
        device.any() !== 'mobile' ||
        document.scrollingElement.scrollTop >=
          productsRef.current.clientHeight / 2
      )
        return true

      return false
    })
  }, 300)

  // biome-ignore lint: can't use that function here
  useEffect(() => {
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
    productsHandler,
    loadCart: setLoadCart
  }

  const cartProps = {
    productsInCart,
    productsCount,
    handleDiscount,
    discount,
    dispatchStates,
    TotalPriceComponent,
    productsHandler,
    setCartSort
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
        {loadCart && halfProductsVisible && (
          <Cart {...cartProps} ref={cartRef} />
        )}
      </Suspense>

      <Suspense>
        {productsFetched &&
          (device.any() === 'mobile' ? (
            <UserData {...userDataProps}>
              <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
            </UserData>
          ) : (
            cartVisible && (
              <ToggleThemeButton theme={theme} toggleTheme={toggleTheme} />
            )
          ))}
      </Suspense>
    </>
  )
}

const Products = forwardRef(function Products(props, ref) {
  const { products, productsHandler, productsFetched, loadCart } = props
  const [firstImagesLoaded, setFirstImagesLoaded] = useState(false)

  useEffect(() => {
    setFirstImagesLoaded(() => {
      if (ref.current) {
        const productImages = ref.current.querySelectorAll('.product__image')

        // only wait for the first 3 images
        for (let i = 0; i < 3; i++) {
          const image = productImages[i]

          if (!image?.complete) return false

          if (i === 2 && image?.complete) return true
        }
      }

      return false
    })

    // Fallback in case the first 3 images doesn't load
    const timeout = setTimeout(() => {
      setFirstImagesLoaded(true)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [ref.current])

  useEffect(() => {
    loadCart(firstImagesLoaded)
  }, [firstImagesLoaded, loadCart])

  function handleProducts(e) {
    if (invalidUserInteraction(e)) return

    const button = e.target.dataset.action
      ? e.target
      : e.target.closest('[data-action]')

    if (!button || button.disabled) return

    const userAction = button.dataset.action
    const id = extractProductId(e)

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
        onKeyDown={handleProducts}
        aria-live='polite'>
        {productsFetched &&
          products.map(product => <Product data={product} key={product?.id} />)}
      </div>
    </div>
  )
})

function getMapFromStorage(mapOnStorage) {
  const data = [...JSON.parse(mapOnStorage || '[]')]
  return !data || data.length === 0 ? new Map() : new Map(data)
}

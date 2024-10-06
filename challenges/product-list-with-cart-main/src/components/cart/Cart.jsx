import { motion } from 'framer-motion'
import { forwardRef, useEffect, useState, useRef } from 'react'
import { ThemeContext } from '../../theme-context.jsx'
import utils from '../../utils/utils.js'
import Spinner from '../others/Spinner.jsx'
import CartProduct from './CartProduct.jsx'
import './Cart.css'
import usePointer from '../../hooks/usePointer.jsx'
import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import { TotalPrice } from '../../App.jsx'
import Skeleton from 'react-loading-skeleton'

const Cart = forwardRef((props, ref) => {
  const {
    products,
    removeProduct,
    confirmOrder,
    setVisible,
    productsFetched,
    totalPrice,
    productsCount,
    setDiscount,
    discount,
    theme
  } = props

  const [isProductInCart, setIsProductInCart] = useState(false)
  const [transitionClass, setTransitionClass] = useState('')
  const buttonsClasses = {
    confirm: '.confirm-order'
  }

  const [isClicked, pointerHandlers] = usePointer(buttonsClasses.add)
  const handleContextMenu = utils.preventContextMenu

  useEffect(() => {
    setVisible()
  }, [])

  useEffect(() => {
    setIsProductInCart(products.length > 0)
  }, [products])

  function handleRemoveProduct(e) {
    if (
      utils.invalidUserInteraction(e) ||
      !utils.matches(e.target, '.product-cart__button--remove')
    )
      return

    const id = utils.extractId(e)

    if (id !== 0 && !id) return

    removeProduct({ type: 'cart', id })
    pointerHandlers.pointerUpCancel(e)
  }

  function handlePointerUpCancel(e) {
    if (utils.invalidUserInteraction(e)) return

    confirmOrder()
    pointerHandlers.pointerUpCancel(e)
  }

  const confirmOrderProps = {
    className: 'confirm-order',
    type: 'button',
    onPointerDown: pointerHandlers.pointerDown,
    onPointerUp: handlePointerUpCancel,
    onPointerCancel: handlePointerUpCancel,
    onContextMenu: handleContextMenu,
    style: theme.cart.confirmBtn
  }

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0
    },
    show: {
      opacity: 1,
      scale: 1
    }
  }

  const cartContentProps = {
    productsFetched,
    productsCount,
    variants,
    theme,

    infoProps: {
      totalPrice,
      discount,
      setDiscount,
      confirmOrderProps
    },

    productsProps: {
      handleRemoveProduct,
      products
    }
  }

  return (
    <div className='cart' style={theme.cart} ref={ref}>
      <h2 className='cart__title' style={{ color: theme.cart.title }}>
        Your Cart <span>({productsFetched && productsCount})</span>
      </h2>

      <CartContent {...cartContentProps} />
    </div>
  )
})

export default Cart

function CartContent(props) {
  const {
    productsFetched,
    productsCount,
    infoProps,
    productsProps,
    theme,
    variants
  } = props

  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className='cart-content'>
      {productsFetched ? (
        productsCount > 0 ? (
          <>
            <CartProducts {...productsProps} />
            <CartInfo {...{ ...infoProps, variants, theme }} />
          </>
        ) : (
          <CartNoProduct
            {...{ variants, productsCount, theme, imageLoaded, setImageLoaded }}
          />
        )
      ) : (
        <Spinner {...theme.spinner} {...theme.spinner.variants.cart} />
      )}
    </div>
  )
}

function DiscountInput(props) {
  const { message, validCode, setValid, id, theme, isValid } = props
  const [value, setValue] = useState(message)
  const [showDiscountInput, setShowDiscountInput] = useState(false)

  const [isTyping, setIsTyping] = useState(false)
  const typingDelay = 250
  const typingTimeout = useRef(null)

  const [applyClicked, setApplyClicked] = useState(false)

  function handleOnChange(e) {
    setValue(e.target.value)

    setIsTyping(true)
    clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      setIsTyping(false)
    }, 250)

    setApplyClicked(false)
  }

  function handleTextClick(e) {
    setShowDiscountInput(true)
  }

  function handleApplyClick(e) {
    setApplyClicked(true)

    setValid(() => {
      return value === validCode
    })
  }
  const clickedAndInvalid = applyClicked && !isValid

  const buttonProps = {
    onPointerUp: handleApplyClick,
    ...(clickedAndInvalid && { disabled: true }),
    className: 'discount-input-button'
  }

  return (
    <>
      {!showDiscountInput && (
        <div className='discount-text'>
          Discount code?{' '}
          <span className='discount-text-click' onPointerUp={handleTextClick}>
            click here!
          </span>
        </div>
      )}
      {showDiscountInput && (
        <div className='discount-input-container'>
          <label
            htmlFor={id}
            value='discount code'
            className='discount-input-label'>
            {clickedAndInvalid ? (
              <span className='discount-error'>Invalid Code</span>
            ) : (
              'Discount Code'
            )}
            <input
              style={{
                ...theme.discountInput,
                border: clickedAndInvalid
                  ? '2px solid var(--red-contrast)'
                  : '2px solid transparent'
              }}
              className='discount-input'
              type='text'
              placeholder={message}
              onChange={handleOnChange}
              name={id}
              id={id}
            />
          </label>

          <ButtonWhoAppear props={buttonProps} show={true}>
            Apply
          </ButtonWhoAppear>
        </div>
      )}
    </>
  )
}

function CartInfo(props) {
  const {
    totalPrice,
    discount,
    setDiscount,
    confirmOrderProps,
    theme,
    cartVariants
  } = props

  const discountInputProps = {
    message: 'Get -10% discount!',
    validCode: 'FrontendMentor',
    setValid: setDiscount,
    id: 'discount-code',
    theme,
    isValid: discount
  }

  return (
    <motion.div
      className='cart__info'
      initial='hidden'
      animate='show'
      variants={cartVariants}>
      <div className='cart__info__total'>
        <div>Order Total</div>
        <TotalPrice
          discount={discount}
          price={totalPrice}
          discountStyle={{ color: theme.totalPrice.cart.discount }}
          totalStyle={{ color: theme.totalPrice.cart.price }}
        />
      </div>
      <p
        className='cart__info__carbon-neutral'
        style={theme.cart.carbonNeutral}>
        <img
          src='./assets/images/icon-carbon-neutral.svg'
          alt=''
          aria-hidden='true'
          width='20'
          height='20'
        />
        This is a <b className='carbon-neutral'>carbon-neutral</b> delivery
      </p>

      <ButtonWhoAppear props={confirmOrderProps}>Confirm Order</ButtonWhoAppear>

      {!discount ? (
        <DiscountInput {...discountInputProps} />
      ) : (
        <div className='cart-discount-text'>You have a -10% discount!</div>
      )}
    </motion.div>
  )
}

function CartProducts({ handleRemoveProduct, products }) {
  return (
    <div className='cart__products' onPointerUp={handleRemoveProduct}>
      {products.map(product => (
        <CartProduct data={product} key={product.id} />
      ))}
    </div>
  )
}

function CartNoProduct({
  cartVariants,
  productsCount,
  theme,
  imageLoaded,
  setImageLoaded
}) {
  useEffect(() => {
    if (imageLoaded) return

    const myImg = new Image()
    myImg.src = './assets/images/illustration-empty-cart.svg'
    myImg.onload = () => {
      setTimeout(() => {
        setImageLoaded(true)
      }, 200)
    }
  }, [imageLoaded, setImageLoaded])

  return (
    <motion.div
      className='cart__no-product'
      initial='hidden'
      animate='show'
      variants={cartVariants}
      style={{
        display: productsCount > 0 ? 'none' : 'flex'
      }}>
      {imageLoaded ? (
        <img
          src='./assets/images/illustration-empty-cart.svg'
          alt=''
          aria-hidden='true'
          width='96'
          height='96'
        />
      ) : (
        <Skeleton height={96} width={96} containerClassName='skeleton' />
      )}

      <p style={{ color: theme.cart.noproduct }}>
        Your added items will appear here
      </p>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { forwardRef, useEffect, useRef, useState } from 'react'
import {
  extractId,
  invalidUserInteraction,
  matches
} from '../../utils/utils.js'
import Spinner from '../others/spinner/Spinner.jsx'
import CartProduct from './CartProduct.jsx'
import './Cart.css'
import Skeleton from 'react-loading-skeleton'
import usePointer from '../../hooks/usePointer.jsx'
import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import TotalPrice from '../others/totalprice/TotalPrice.jsx'
import DiscountInput from './discountinput/DiscountInput.jsx'

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

  const cartProductRemoveBtnClass = 'cart-product__button--remove'

  useEffect(() => {
    setVisible()
  }, [])

  useEffect(() => {
    setIsProductInCart(products.length > 0)
  }, [products])

  function handleRemoveProduct(e) {
    if (
      invalidUserInteraction(e) ||
      !matches(e.target, `.${cartProductRemoveBtnClass}`)
    )
      return

    const id = extractId(e)

    if (id !== 0 && !id) return

    removeProduct({ type: 'cart', id })
  }

  function handlePointerUpCancel(e) {
    if (invalidUserInteraction(e)) return

    confirmOrder()
  }

  const confirmOrderProps = {
    className: 'confirm-order',
    onPointerUp: handlePointerUpCancel,
    onPointerCancel: handlePointerUpCancel,
    onKeyDown: handlePointerUpCancel
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
      products,
      buttonClass: cartProductRemoveBtnClass
    }
  }

  return (
    <div
      className='cart'
      ref={ref}
      style={{ minHeight: `${50 * products.length + 400}px` }}>
      <h2 className='cart__title'>
        Your Cart <span>({productsFetched && productsCount})</span>
      </h2>

      <CartContent {...cartContentProps} />
    </div>
  )
})

export default Cart

function CartContent(props) {
  const { productsFetched, productsCount, infoProps, productsProps, variants } =
    props

  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className='cart-content'>
      {productsFetched ? (
        productsCount > 0 ? (
          <>
            <CartProducts {...productsProps} />
            <CartInfo {...{ ...infoProps, variants }} />
          </>
        ) : (
          <CartNoProduct
            {...{ variants, productsCount, imageLoaded, setImageLoaded }}
          />
        )
      ) : (
        <Spinner isFor='cart' />
      )}
    </div>
  )
}

function CartInfo(props) {
  const { totalPrice, discount, setDiscount, confirmOrderProps, cartVariants } =
    props

  const discountInputProps = {
    message: 'Get -20% discount!',
    validCode: 'FrontendMentor',
    setValid: setDiscount,
    id: 'discount-code',
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
        <TotalPrice discount={discount} price={totalPrice} amount={20} />
      </div>
      <p className='cart__info__carbon-neutral'>
        <img
          src='./assets/images/icon-carbon-neutral.svg'
          alt=''
          aria-hidden='true'
          width='20'
          height='20'
        />
        This is a <b className='carbon-neutral'>carbon-neutral</b> delivery
      </p>

      <ButtonWhoAppear
        render='Confirm Order'
        props={confirmOrderProps}
        eventClassName='.confirm-order'
        hoverEvents={false}
        focusEvents={false}
      />

      {!discount ? (
        <DiscountInput {...discountInputProps} />
      ) : (
        <div className='discount-text'>-20% discount applied!</div>
      )}
    </motion.div>
  )
}

function CartProducts({ handleRemoveProduct, products, buttonClass }) {
  return (
    <div className='cart__products' onPointerUp={handleRemoveProduct}>
      {products.map(product => (
        <CartProduct
          data={product}
          buttonClass={buttonClass}
          key={product.id}
        />
      ))}
    </div>
  )
}

function CartNoProduct({
  cartVariants,
  productsCount,
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
      }, 150)
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

      <p>Your added items will appear here</p>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { forwardRef, useEffect } from 'react'
import {
  extractId,
  invalidUserInteraction,
  matches
} from '../../utils/utils.js'
import CartProduct from './CartProduct.jsx'
import './Cart.css'
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
    discount
  } = props

  const cartProductRemoveBtnClass = 'cart-product__button--remove'

  // biome-ignore lint: can't use setVisible as dependency
  useEffect(() => {
    setVisible(productsFetched)
  }, [productsFetched])

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

  const cartContentProps = {
    productsFetched,
    productsCount,

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
  const { productsFetched, productsCount, infoProps, productsProps } = props

  return (
    <div className='cart-content'>
      {productsCount > 0 ? (
        <>
          <CartProducts {...productsProps} />
          <CartInfo {...infoProps} />
        </>
      ) : (
        <CartNoProduct productsCount={productsCount} />
      )}
    </div>
  )
}

function CartInfo(props) {
  const { totalPrice, discount, setDiscount, confirmOrderProps } = props

  const discountInputProps = {
    message: 'Get -20% discount!',
    validCode: 'FrontendMentor',
    setValid: setDiscount,
    id: 'discount-code',
    isValid: discount
  }

  return (
    <div className='cart__info'>
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
        buttonClass='.confirm-order'
      />

      {!discount ? (
        <DiscountInput {...discountInputProps} />
      ) : (
        <div className='discount-text'>-20% discount applied!</div>
      )}
    </div>
  )
}

function CartProducts({ handleRemoveProduct, products, buttonClass }) {
  return (
    <div
      className='cart__products'
      onPointerUp={handleRemoveProduct}
      onKeyDown={handleRemoveProduct}>
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

function CartNoProduct() {
  return (
    <div className='cart__no-product'>
      <img
        className='no-product__image'
        src='./assets/images/illustration-empty-cart.svg'
        alt=''
        aria-hidden='true'
        width='96'
        height='96'
      />

      <p>Your added items will appear here</p>
    </div>
  )
}

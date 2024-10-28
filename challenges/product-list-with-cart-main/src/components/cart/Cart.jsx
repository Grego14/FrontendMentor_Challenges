import { Suspense, forwardRef, lazy, useEffect } from 'react'
import { extractId, invalidUserInteraction, matches } from '/src/utils/utils.js'
import './Cart.css'
import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import TotalPrice from '../others/totalprice/TotalPrice.jsx'

const CartProducts = lazy(() => import('./CartProduct.jsx'))
const DiscountInput = lazy(() => import('./discountinput/DiscountInput.jsx'))

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

  useEffect(() => {
    setVisible(productsFetched)
  }, [productsFetched, setVisible])

  function handleRemoveProduct(e) {
    const id = extractId(e)

    if (
      invalidUserInteraction(e) ||
      !matches(e.target, '[data-action="cart"]') ||
      (id !== 0 && !id)
    )
      return

    removeProduct({ type: 'cart', id })
  }

  function handleConfirmOrder(e) {
    if (invalidUserInteraction(e)) return

    confirmOrder()
  }

  const confirmOrderProps = {
    className: 'confirm-order',
    onPointerUp: handleConfirmOrder,
    onPointerCancel: handleConfirmOrder,
    onKeyDown: handleConfirmOrder
  }

  const cartContentProps = {
    productsCount,

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
    <div
      className='cart'
      ref={ref}
      style={{ minHeight: `${45 * products.length + 350}px` }}>
      <h2 className='cart__title'>
        Your Cart <span>({productsFetched && productsCount})</span>
      </h2>

      <CartContent {...cartContentProps} />
    </div>
  )
})

export default Cart

function CartContent(props) {
  const { productsCount, infoProps, productsProps } = props

  return (
    <div className='cart-content' aria-live='polite' aria-atomic='true'>
      {productsCount > 0 ? (
        <Suspense>
          <CartProducts {...productsProps} />
          <CartInfo {...infoProps} />
        </Suspense>
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
        props={confirmOrderProps}
        buttonClass='.confirm-order'
        text='Confirm Order'
      />

      {!discount ? (
        <DiscountInput {...discountInputProps} />
      ) : (
        <div className='discount-text'>-20% discount applied!</div>
      )}
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

import { Suspense, forwardRef, lazy, useEffect } from 'react'
import {
  device,
  extractProductId,
  invalidUserInteraction,
  matches
} from '/src/utils/utils.js'
import './Cart.css'
import { motion } from 'motion/react'
import AppButton from '../others/appbutton/AppButton.jsx'

const CartProduct = lazy(() => import('./CartProduct.jsx'))
const DiscountInput = lazy(() => import('./discountinput/DiscountInput.jsx'))

const Cart = forwardRef((props, ref) => {
  const {
    productsInCart,
    productsHandler,
    productsCount,
    handleDiscount,
    discount,
    TotalPriceComponent,
    setCartSort,
    dispatchStates
  } = props

  useEffect(() => {
    dispatchStates({ state: 'cartVisible', value: true })
  }, [dispatchStates])

  function handleRemoveProduct(e) {
    const id = extractProductId(e)

    if (
      invalidUserInteraction(e) ||
      !matches(e.target, '[data-action="cart"]') ||
      (id !== 0 && !id)
    )
      return

    productsHandler({ type: 'cart', id })
  }

  function handleConfirmOrder(e) {
    if (invalidUserInteraction(e)) return

    dispatchStates({ state: 'modalVisible', value: true })
  }

  const confirmOrderProps = {
    className: 'confirm-order',
    onPointerUp: handleConfirmOrder,
    onPointerCancel: handleConfirmOrder,
    onKeyDown: handleConfirmOrder
  }

  const cartContentProps = {
    productsCount,
    handleRemoveProduct,
    productsInCart,

    infoProps: {
      TotalPriceComponent,
      discount,
      handleDiscount,
      confirmOrderProps
    }
  }

  const cartVariants = {
    hidden: {
      opacity: 0,
      x: device.any() === 'desktop' ? '250%' : '0%'
    },

    show: {
      opacity: 1,
      x: '0%'
    }
  }

  function handleCartSorting(e) {
    setCartSort(Number(e.target.value))
  }

  return (
    <motion.div
      initial='hidden'
      animate='show'
      variants={cartVariants}
      className='cart'
      ref={ref}
      style={{ minHeight: `${45 * productsInCart.length + 350}px` }}>
      <div className='cart-top-info'>
        <h2 className='cart__title'>
          Your Cart <span>({productsCount})</span>
        </h2>

        {productsCount > 0 && (
          <div className='sort-container pos-relative'>
            <select
              className='sort-container__select'
              name='sort'
              id='sort'
              onChange={handleCartSorting}
              defaultValue='order'
              aria-label='Sort by'>
              <option value='0'>Order</option>
              <option value='1'>Cheaper</option>
              <option value='2'>Expensive</option>
            </select>
          </div>
        )}
      </div>

      <CartContent {...cartContentProps} />
    </motion.div>
  )
})

export default Cart

function CartContent(props) {
  const { productsCount, infoProps, handleRemoveProduct, productsInCart } =
    props

  return (
    <div className='cart-content' aria-live='polite' aria-atomic='true'>
      {productsCount > 0 ? (
        <>
          <div
            className='cart__products'
            onPointerUp={handleRemoveProduct}
            onKeyDown={handleRemoveProduct}>
            {productsInCart.map(product => (
              <CartProduct data={product} key={product.id} />
            ))}
          </div>

          <Suspense>
            <CartInfo {...infoProps} />
          </Suspense>
        </>
      ) : (
        <div className='cart__no-product'>
          <img
            className='no-product__image'
            src='./assets/images/illustration-empty-cart.svg'
            alt=''
            aria-hidden='true'
            width='96'
            height='96'
          />
          <p className='no-product__text'>Your added items will appear here</p>
        </div>
      )}
    </div>
  )
}

function CartInfo(props) {
  const { discount, handleDiscount, confirmOrderProps, TotalPriceComponent } =
    props

  const discountInputProps = {
    message: 'Get -20% discount!',
    validCode: 'FrontendMentor',
    setValid: handleDiscount,
    isValid: discount
  }

  return (
    <div className='cart__info'>
      <div className='cart__info__total'>
        <div>Order Total</div>
        <TotalPriceComponent />
      </div>

      <div className='cart__info__carbon-neutral'>
        <p className='carbon-neutral__text'>
          <img
            src='./assets/images/icon-carbon-neutral.svg'
            alt=''
            aria-hidden='true'
            width='20'
            height='20'
          />
          This is a <b className='carbon-neutral'>carbon-neutral</b> delivery
        </p>
      </div>

      <AppButton props={confirmOrderProps} render='Confirm Order' />
      <DiscountInput {...discountInputProps} />
    </div>
  )
}

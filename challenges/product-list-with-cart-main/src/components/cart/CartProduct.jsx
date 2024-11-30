import './CartProduct.css'
import { memo } from 'react'
import { motion as m } from 'motion/react'
import { transformPrice } from '/src/utils/utils.js'
import LineWhoAppear from '../others/linewhoappear/LineWhoAppear.jsx'

const CartProduct = memo(function CartProduct({ data }) {
  const { name, count, price, id, order, initial, totalPrice } = data

  const productVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
      x: '-150%'
    },

    show(custom) {
      return {
        x: '0%',
        opacity: 1,
        scale: 1,
        transition: {
          delay: custom.initial
            ? 0.2 + custom.order / (custom.order > 5 ? 15 : 10)
            : 0.2
        }
      }
    }
  }

  return (
    <m.div
      initial='hidden'
      animate='show'
      custom={{ initial, order }}
      variants={productVariants}
      className='cart-product pos-relative'
      data-id={id}>
      <CartProductContent
        name={name}
        count={count}
        price={price}
        totalPrice={totalPrice}
      />
      <CartProductRemoveButton />
      <LineWhoAppear />
    </m.div>
  )
})

export default CartProduct

function CartProductContent({ name, count, price, totalPrice }) {
  return (
    <div className='cart-product__content'>
      <h3 className='cart-product__name'>{name}</h3>
      <div className='cart-product__info'>
        <span className='cart-product__count'>{count}x</span>
        <span className='cart-product__price-container'>
          <span className='price-container__sign'>@</span>
          <span className='price-container__price'>
            {transformPrice(price)}
          </span>
        </span>
        <span className='cart-product__total-price'>
          {transformPrice(totalPrice)}
        </span>
      </div>
    </div>
  )
}

function CartProductRemoveButton() {
  return (
    <div className='cart-product__button-container'>
      <button
        className='cart-product__button'
        aria-label='remove product from cart'
        data-action='cart'
        type='button'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='10'
          height='10'
          fill='none'
          viewBox='0 0 10 10'>
          <title>remove product from cart</title>
          <path
            className='cart-product__button__path'
            fill='#CAAFA7'
            d='M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z'
          />
        </svg>
      </button>
    </div>
  )
}

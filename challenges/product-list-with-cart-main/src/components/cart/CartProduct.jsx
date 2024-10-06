import { useState, useEffect, useContext } from 'react'
import './CartProduct.css'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeContext } from '../../theme-context.jsx'
import utils from '../../utils/utils.js'

export default function CartProduct({ data }) {
  const { name, count, price, id, initial } = data
  const [transitionClass, setTransitionClass] = useState('')
  const totalPrice = utils.transformPrice(
    utils.getTotalProductPrice(price, count)
  )
  const { theme } = useContext(ThemeContext)

  const cartProductProps = {
    style: {
      originX: 'left',
      originY: 'top'
    },
    initial: {
      x: '-150%',
      opacity: 0,
      scale: 0
    },
    animate(custom) {
      return {
        x: '0%',
        opacity: 1,
        scale: 1,
        transition: {
          delay: custom.initial
            ? 0.2 + custom.id / (custom.id > 5 ? 15 : 5)
            : 0.2
        }
      }
    },
    exit: {
      x: '150%',
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 1
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        custom={{ initial, id }}
        style={cartProductProps.style}
        initial={cartProductProps.initial}
        animate={cartProductProps.animate}
        exit={cartProductProps.exit}
        className={`product-cart${transitionClass}`}
        id={`product-cart-${id}`}>
        <div className='product-cart__wrapper product-cart__wrapper--content'>
          <h3 className='product-cart__name'>{name}</h3>
          <div className='product-cart__info'>
            <span
              className='product-cart__count'
              style={{ color: theme.products.count }}>
              {count || 1}x
            </span>
            <div
              className='product-cart__price-container'
              style={{ color: theme.products.price.cartProduct }}>
              <span className='product-cart__price-sign'>@</span>
              <span className='product-cart__price'>
                {utils.transformPrice(price)}
              </span>
            </div>
            <span
              className='product-cart__total-price'
              style={{ color: theme.products.totalPrice }}>
              {totalPrice}
            </span>
          </div>
        </div>
        <div className='product-cart__wrapper product-cart__wrapper--button'>
          <button
            className='product-cart__button product-cart__button--remove'
            aria-label='remove product from cart'
            type='button'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='10'
              height='10'
              fill='none'
              viewBox='0 0 10 10'>
              <title>remove product from cart</title>
              <path
                fill='#CAAFA7'
                d='M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z'
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

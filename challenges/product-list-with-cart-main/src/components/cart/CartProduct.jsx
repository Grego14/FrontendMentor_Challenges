import './CartProduct.css'
import { AnimatePresence, motion } from 'framer-motion'
import { getTotalProductPrice, transformPrice } from '/src/utils/utils.js'

export default function CartProduct({ data }) {
  const { name, count, price, id, initial } = data
  const totalPrice = transformPrice(getTotalProductPrice(price, count))

  const cartProductProps = {
    style: {
      originX: 'left',
      originY: 'top'
    },
    hidden: {
      x: '-150%',
      opacity: 0,
      scale: 0
    },
    show(custom) {
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

  const cartProductContentProps = {
    name,
    count,
    price,
    totalPrice
  }

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        custom={{ initial, id }}
        initial='hidden'
        animate='show'
        variants={cartProductProps}
        exit={cartProductProps.exit}
        className='cart-product'
        id={`cart-product-${id}`}>
        <CartProductContent {...cartProductContentProps} />
        <CartProductRemoveButton />
        <motion.div
          className='cart-product__line'
          whileInView={{ width: '100%', opacity: 1 }}
          transition={{
            delay: cartProductProps.show({ initial, id }).transition.delay
          }}
          viewport={{ once: true }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

function CartProductContent({ name, count, price, totalPrice }) {
  return (
    <div className='cart-product__wrapper--content'>
      <h3 className='cart-product__name'>{name}</h3>
      <div className='cart-product__info'>
        <span className='cart-product__count'>{count}x</span>
        <div className='cart-product__price-container'>
          <span className='cart-product__price-sign'>@</span>
          <span className='cart-product__price'>{transformPrice(price)}</span>
        </div>
        <span className='cart-product__total-price'>{totalPrice}</span>
      </div>
    </div>
  )
}

function CartProductRemoveButton() {
  return (
    <div className='cart-product__wrapper--button'>
      <button
        className='cart-product__button cart-product__button--remove'
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
  )
}

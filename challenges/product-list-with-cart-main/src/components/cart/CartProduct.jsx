import './CartProduct.css'
import { m } from 'framer-motion'
import { getTotalProductPrice, transformPrice } from '/src/utils/utils.js'

export default function CartProducts({ handleRemoveProduct, products }) {
  return (
    <div
      className='cart__products'
      onPointerUp={handleRemoveProduct}
      onKeyDown={handleRemoveProduct}>
      {products.map(product => (
        <CartProduct data={product} key={product.id} />
      ))}
    </div>
  )
}

function CartProduct({ data }) {
  const { name, count, price, id, initial } = data
  const totalPrice = transformPrice(getTotalProductPrice(price, count))

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
            ? 0.2 + custom.id / (custom.id > 5 ? 15 : 5)
            : 0.2,
          when: 'beforeChildren'
        }
      }
    }
  }

  const lineVariants = {
    hidden: {
      opacity: 0,
      width: '0%'
    },
    show: {
      opacity: 1,
      width: '100%'
    }
  }

  return (
    <m.div
      initial='hidden'
      animate='show'
      custom={{ initial, id }}
      variants={productVariants}
      className='cart-product'
      id={`cart-product-${id}`}>
      <CartProductContent
        name={name}
        count={count}
        price={price}
        totalPrice={totalPrice}
      />
      <CartProductRemoveButton />
      <m.div className='cart-product__line' variants={lineVariants} />
    </m.div>
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
            fill='#CAAFA7'
            d='M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z'
          />
        </svg>
      </button>
    </div>
  )
}

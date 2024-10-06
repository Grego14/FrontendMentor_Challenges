import { useContext } from 'react'
import { useState, useEffect } from 'react'
import './OrderProduct.css'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeContext } from '../../theme-context.jsx'
import utils from '../../utils/utils.js'

// maybe later add some interactivity
function OrderProductThumbnail({ image, name }) {
  if (image.thumbnail) {
    return (
      <img
        className='order-product__thumbnail'
        src={image.thumbnail}
        alt={`${name}`}
        width='50'
        height='50'
        aria-hidden='true'
      />
    )
  }

  return <div>Invalid image object</div>
}

export default function OrderProduct({ data }) {
  const { name, count, price, image, id } = data
  const totalPrice = utils.getTotalProductPrice(price, count)

  const { theme } = useContext(ThemeContext)

  return (
    <AnimatePresence
      key={id}
      initial={{
        x: -100,
        opacity: 0
      }}
      animate={{
        x: 0,
        opacity: 1
      }}
      exit={{
        x: -100,
        backgroundColor: 'black',
        opacity: 0
      }}>
      <motion.div>
        <div className='order-product'>
          <div className='order-product__thumbnail-container'>
            <OrderProductThumbnail image={image} name={name} />
          </div>

          <div className='order-product__content'>
            <div className='order-product__info'>
              <h3 className='order-product__name'>{name}</h3>
              <div
                className='order-product__count'
                style={{ color: theme.products.count }}>
                {count}x
              </div>
              <div
                className='order-product__price-container'
                style={{ color: theme.products.price.cartProduct }}>
                <span className='order-product__sign'>@</span>
                <span className='order-product__price'>
                  {utils.transformPrice(price)}
                </span>
              </div>
            </div>
            <div
              className='order-product__total-price'
              style={{ color: theme.products.totalPrice }}>
              {utils.transformPrice(totalPrice)}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

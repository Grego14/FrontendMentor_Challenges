import './OrderProduct.css'
import { m } from 'framer-motion'
import { getTotalProductPrice, transformPrice } from '../../utils/utils.js'

function OrderProductThumbnail({ image, name }) {
  return image.thumbnail ? (
    <img
      className='order-product__thumbnail'
      src={image.thumbnail}
      alt=''
      width='50'
      height='50'
      aria-hidden='true'
    />
  ) : (
    <div>Invalid image object</div>
  )
}

export default function OrderProduct({ data }) {
  const { name, count, price, image, id } = data

  const oPvariants = {
    hidden: {
      x: -100,
      opacity: 0,
      scale: 0.5
    },
    show: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: {
      x: -100,
      opacity: 0
    }
  }

  return (
    <m.div
      className='order-product pos-relative'
      key={id}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true }}
      exit='exit'
      variants={oPvariants}>
      <div className='order-product__thumbnail-container'>
        <OrderProductThumbnail image={image} name={name} />
      </div>

      <OrderProductContent name={name} count={count} price={price} />
    </m.div>
  )
}

function OrderProductContent({ name, count, price }) {
  return (
    <div className='order-product__content'>
      <div className='order-product__info'>
        <h3 className='order-product__name'>{name}</h3>
        <div className='order-product__count'>{count}x</div>
        <div className='order-product__price-container'>
          <span className='order-product__sign'>@</span>
          <span className='order-product__price'>{transformPrice(price)}</span>
        </div>
      </div>
      <div className='order-product__total-price'>
        {transformPrice(getTotalProductPrice(price, count))}
      </div>
    </div>
  )
}

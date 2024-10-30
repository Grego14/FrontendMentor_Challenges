import './OrderProduct.css'
import { m } from 'framer-motion'
import { transformPrice } from '../../utils/utils.js'
import LineWhoAppear from '../others/linewhoappear/LineWhoAppear.jsx'

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
  const { name, count, price, image, id, totalPrice } = data

  const oPvariants = {
    hidden: {
      x: -100,
      opacity: 0,
      scale: 0.5
    },
    show: {
      x: 0,
      opacity: 1,
      scale: 1,

      transition: {
        when: 'beforeChildren'
      }
    }
  }

  const productContentProps = {
    name,
    count,
    price,
    totalPrice
  }

  return (
    <m.div
      className='order-product pos-relative'
      initial='hidden'
      whileInView='show'
      viewport={{ once: true }}
      variants={oPvariants}>
      <div className='order-product__thumbnail-container'>
        <OrderProductThumbnail image={image} name={name} />
      </div>

      <OrderProductContent {...productContentProps} />
      <LineWhoAppear />
    </m.div>
  )
}

function OrderProductContent(props) {
  const { name, count, price, totalPrice } = props

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
        {transformPrice(totalPrice)}
      </div>
    </div>
  )
}

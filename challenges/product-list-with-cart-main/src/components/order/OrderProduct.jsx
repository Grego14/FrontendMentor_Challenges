import './OrderProduct.css'
import { AnimatePresence, motion } from 'framer-motion'
import { getTotalProductPrice, transformPrice } from '../../utils/utils.js'

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
  const totalPrice = getTotalProductPrice(price, count)

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
      <div className='order-product'>
        <div className='order-product__thumbnail-container'>
          <OrderProductThumbnail image={image} name={name} />
        </div>

        <OrderProductContent
          name={name}
          count={count}
          price={price}
          totalPrice={totalPrice}
        />

        <motion.div
          className='order-product__line'
          whileInView={{ width: '100%', opacity: 1 }}
          viewport={{ once: true }}
        />
      </div>
    </AnimatePresence>
  )
}

function OrderProductContent({ name, count, price, totalPrice }) {
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

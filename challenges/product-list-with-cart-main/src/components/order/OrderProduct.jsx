import './OrderProduct.css'
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
      draggable='false'
    />
  ) : (
    <div>Invalid image object</div>
  )
}

export default function OrderProduct({ data }) {
  const { name, count, price, image, totalPrice } = data

  return (
    <div className='order-product pos-relative'>
      <div className='order-product__thumbnail-container'>
        <OrderProductThumbnail image={image} name={name} />
      </div>

      <div className='order-product__content'>
        <div className='order-product__info'>
          <h3 className='order-product__name'>{name}</h3>
          <div className='order-product__count'>{count}x</div>
          <div className='order-product__price-container'>
            <span className='order-product__sign'>@</span>
            <span className='order-product__price'>
              {transformPrice(price)}
            </span>
          </div>
        </div>
        <div className='order-product__total-price'>
          {transformPrice(totalPrice)}
        </div>
      </div>

      <LineWhoAppear />
    </div>
  )
}

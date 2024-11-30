import { transformPrice } from '../../utils/utils.js'

export default function TotalPrice({ price, discount, amount }) {
  return (
    <div className='total-price-container'>
      <span className='price'>{transformPrice(price)}</span>
      {discount && (
        <span className='discount-price'>
          {transformPrice(price - (price / 100) * (amount || 10))}
        </span>
      )}
    </div>
  )
}

import './TotalPrice.css'
import utils from '../../../utils/utils.js'

export default function TotalPrice({
  price,
  discount,
  totalClassName,
  discountClassName,
  totalStyle,
  discountStyle,
  amount,
  isFor
}) {
  return (
    <div className={`total-price-container${isFor ?? ''}`}>
      <span
        className={`price${totalClassName ? totalClassName : ''}`}
        style={totalStyle}>
        {utils.transformPrice(price)}
      </span>
      {discount && (
        <span
          className={`discount-price${discountClassName ? discountClassName : ''}`}
          style={discountStyle}>
          {utils.transformPrice(price - price / (amount || 10))}
        </span>
      )}
    </div>
  )
}

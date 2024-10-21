import './UserOrder.css'
import {motion} from 'framer-motion'
import TotalPrice from '../../others/totalprice/TotalPrice.jsx'

export default function UserOrder({ visible, productsCount, totalPrice, discount }) {
  const userOrderVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: '-150%'
    },
    show: {
      opacity: 1,
      scale: 1
    }
  }

  return (
    <motion.div
      initial='show'
      animate={'show'}
      variants={userOrderVariants}
      role='status'
      aria-live='polite'
      aria-atomic='true'
      className='user-order'>
      <div>
        Products:{' '}
        <span className='user-order__products-count'>{productsCount}</span>
      </div>
      <div>
        Total Price:{' '}
        <TotalPrice
          price={totalPrice}
          discount={discount}
          amount={20}
          totalClassName=' user-order__total-price'
        />
      </div>
    </motion.div>
  )
}

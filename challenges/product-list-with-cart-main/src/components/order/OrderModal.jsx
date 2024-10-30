import OrderProduct from './OrderProduct.jsx'
import './OrderModal.css'
import { getTotalPrice, getTotalProductPrice } from '../../utils/utils.js'
import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import TotalPrice from '../others/totalprice/TotalPrice.jsx'

export default function OrderModal({ products, visible, newOrder, discount }) {
  const totalPrice = getTotalPrice(
    products.map(product => getTotalProductPrice(product.price, product.count))
  )

  const newOrderBtnProps = {
    className: 'order-modal__button',
    onPointerUp: newOrder,
    onKeyDown: newOrder
  }

  return (
    <div className='modal-background'>
      <div className={`order-modal ${visible ? 'order-modal--show' : ''}`}>
        <img
          className='order-modal__icon'
          src='./assets/images/icon-order-confirmed.svg'
          alt=''
          aria-hidden='true'
          width='50'
          height='50'
        />

        <h2 className='order-modal__title'>Order Confirmed</h2>
        <p className='order-modal__text'>We hope you enjoy your food!</p>

        <div className='order-modal__info'>
          <div className='order-modal__products'>
            {visible &&
              products.map(product => (
                <OrderProduct data={product} key={product.id} />
              ))}
          </div>
          <div className='order-modal__total'>
            <div className='total__text'>Order Total</div>
            <TotalPrice price={totalPrice} discount={discount} amount={20} />
          </div>
        </div>

        <ButtonWhoAppear text='Start New Order' props={newOrderBtnProps} />
      </div>
    </div>
  )
}

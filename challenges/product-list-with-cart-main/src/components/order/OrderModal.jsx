import './OrderModal.css'
import { invalidUserInteraction } from '../../utils/utils.js'
import AppButton from '../others/appbutton/AppButton.jsx'
import { lazy } from 'react'

const OrderProduct = lazy(() => import('./OrderProduct.jsx'))

export default function OrderModal({
  productsInCart,
  newOrder,
  TotalPriceComponent
}) {
  function handleNewOrder(e) {
    if (invalidUserInteraction(e)) return
    newOrder()
  }

  const newOrderBtnProps = {
    className: 'order-modal__button',
    onPointerUp: handleNewOrder,
    onKeyDown: handleNewOrder
  }

  function handleOverlayClick(e) {
    if (!e.target.classList.contains('modal-overlay')) return

    newOrder()
  }

  return (
    <div className='modal-overlay' onPointerUp={handleOverlayClick}>
      <div className='order-modal'>
        <img
          className='order-modal__icon'
          src='./assets/images/icon-order-confirmed.svg'
          alt=''
          aria-hidden='true'
          width='50'
          height='50'
          draggable='false'
        />

        <h2 className='order-modal__title'>Order Confirmed</h2>
        <p className='order-modal__text'>We hope you enjoy your food!</p>

        <div className='order-modal__info'>
          <div className='order-modal__products' aria-live='polite'>
            {productsInCart.map(product => (
              <OrderProduct data={product} key={product.id} />
            ))}
          </div>
          <div className='order-modal__total'>
            <div className='total__text'>Order Total</div>
            <TotalPriceComponent />
          </div>
        </div>

        <AppButton props={newOrderBtnProps} render='Start New Order' />
      </div>
    </div>
  )
}

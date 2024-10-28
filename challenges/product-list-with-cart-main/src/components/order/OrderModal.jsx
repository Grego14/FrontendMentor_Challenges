import OrderProduct from './OrderProduct.jsx'
import './OrderModal.css'
import { AnimatePresence, m } from 'framer-motion'
import { useState } from 'react'
import { getTotalPrice, getTotalProductPrice } from '../../utils/utils.js'
import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import TotalPrice from '../others/totalprice/TotalPrice.jsx'

export default function OrderModal({ products, visible, newOrder, discount }) {
  const productsCopy = products.slice()

  const totalPrice = getTotalPrice(
    products.map(product => getTotalProductPrice(product.price, product.count))
  )

  const modalVariants = {
    show: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: 0.3
      }
    }
  }

  const newOrderBtnProps = {
    className: 'order-modal__button',
    onPointerUp: newOrder,
    onKeyDown: newOrder
  }

  return (
    <div className='modal-background'>
      <m.div
        style={{
          opacity: 0.5,
          y: '5%'
        }}
        className='order-modal'
        key='modal'
        animate='show'
        variants={modalVariants}>
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
            <AnimatePresence>
              {visible &&
                products.map(product => (
                  <OrderProduct data={product} key={product.id} />
                ))}
            </AnimatePresence>
          </div>
          <div className='order-modal__total'>
            <div className='total__text'>Order Total</div>
            <TotalPrice price={totalPrice} discount={discount} amount={20} />
          </div>
        </div>

        <ButtonWhoAppear text='Start New Order' props={newOrderBtnProps} />
      </m.div>
    </div>
  )
}

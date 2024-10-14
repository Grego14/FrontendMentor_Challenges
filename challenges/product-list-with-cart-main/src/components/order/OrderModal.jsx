import { useContext, useEffect, useState } from 'react'
import OrderProduct from './OrderProduct.jsx'
import './OrderModal.css'
import { motion } from 'framer-motion'
import usePointer from '../../hooks/usePointer.jsx'
import { getTotalPrice, getTotalProductPrice } from '../../utils/utils.js'
import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import TotalPrice from '../others/totalprice/TotalPrice.jsx'

export default function OrderModal({ products, visible, newOrder, discount }) {
  const [isClicked, handlers] = usePointer('button')

  const totalPrice = getTotalPrice(
    products.map(product => getTotalProductPrice(product.price, product.count))
  )

  const orderProducts = products.map(product => (
    <OrderProduct data={product} key={product.id} />
  ))

  const modalProps = {
    initial: {
      opacity: 0,
      scale: 0.5
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0
    }
  }

  const newOrderBtnProps = {
    className: 'order-modal__button',
    onPointerUp: newOrder,
    onKeyDown: newOrder
  }

  return (
    <motion.div
      className='modal-background'
      style={{ visibility: visible ? 'visible' : 'hidden' }}>
      <motion.div className='order-modal' {...modalProps}>
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
          <div className='order-modal__products'>{orderProducts}</div>
          <div className='order-modal__total'>
            <div className='total__text'>Order Total</div>
            <TotalPrice price={totalPrice} discount={discount} amount={20} />
          </div>
        </div>

        <ButtonWhoAppear render='Start New Order' props={newOrderBtnProps} />
      </motion.div>
    </motion.div>
  )
}

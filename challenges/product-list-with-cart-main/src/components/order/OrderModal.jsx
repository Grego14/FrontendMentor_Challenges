import { useState, useEffect, useContext } from 'react'
import OrderProduct from './OrderProduct.jsx'
import './OrderModal.css'
import { motion } from 'framer-motion'
import { ThemeContext } from '../../theme-context.jsx'
//import usePointer from '../../hooks/usePointer.jsx'
import utils from '../../utils/utils.js'
import { TotalPrice } from '../../App.jsx'

export default function OrderModal({ products, visible, newOrder, discount }) {
  const { theme } = useContext(ThemeContext)
  //const [isOnPointer, handlers] = usePointer('button')

  const preventContextMenu = utils.preventContextMenu

  const totalPrice = utils.getTotalPrice(
    products.map(product =>
      utils.getTotalProductPrice(product.price, product.count)
    )
  )

  const orderProducts = products.map(product => (
    <OrderProduct data={product} key={product.id} />
  ))

  const modalProps = {
    style: {
      ...theme.modal
    },
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
        <p className='order-modal__text' style={{ color: theme.modal.text }}>
          We hope you enjoy your food!
        </p>

        <div className='order-modal__info' style={{ ...theme.modal.info }}>
          <div className='order-modal__products'>{orderProducts}</div>
          <div className='order-modal__total'>
            <div className='total__text'>Order Total </div>
            <TotalPrice
              price={totalPrice}
              discount={discount}
              totalStyle={{ color: theme.totalPrice.modal.price }}
              discountStyle={{ color: theme.totalPrice.modal.discount }}
            />
          </div>
        </div>

        <motion.button
          className='order-modal__button'
          type='button'
          onPointerUp={newOrder}
          onKeyDown={newOrder}
          onContextMenu={preventContextMenu}
          style={{ ...theme.modal.button }}>
          Start New Order
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

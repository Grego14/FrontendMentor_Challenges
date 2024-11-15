import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import { useId } from 'react'
import { m } from 'framer-motion'

export function QuantityButtons(props) {
  const { imageLoaded, onCart, count, outOfStock } = props
  const visible = imageLoaded && onCart

  const quantityBtnProps = {
    className: 'product__button product__button__quantity',
    tabIndex: visible ? '0' : '-1',
    visible,
    outOfStock
  }

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0
    },

    show: {
      opacity: 1,
      scale: [1, 1.15, 1],
      transition: {
        duration: 0.3,
        delay: 0.2
      }
    }
  }

  return (
    <m.div
      initial='hidden'
      whileInView={visible ? 'show' : ''}
      viewport={{ once: true }}
      variants={variants}
      aria-hidden={visible}
      className='product__buttons__quantity pos-absolute'>
      <QuantityButton props={quantityBtnProps} type='decrement' />

      <div
        className='product-quantity'
        aria-label={`product count is ${count}`}>
        {count}
      </div>

      <QuantityButton props={quantityBtnProps} type='increment' />
    </m.div>
  )
}

function QuantityButton({ props, type }) {
  const { visible, tabIndex, outOfStock, ...buttonProps } = props

  const _props = {
    ...buttonProps,
    'aria-label': `${type} product count`,
    'data-action': type,

    // prevent focusing on the increment button when the product is out of stock
    tabIndex: type !== 'increment' || !outOfStock ? tabIndex : '-1'
  }

  const decrementIcon = (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='10'
      height='10'
      fill='none'
      viewBox='0 0 10 2'>
      <title>Decrement product count</title>
      <path className='quantity-path' fill='#fff' d='M0 .375h10v1.25H0V.375Z' />
    </svg>
  )

  const incrementIcon = (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='10'
      height='10'
      fill='none'
      viewBox='0 0 10 10'>
      <title>Increment product count</title>
      <path
        className='quantity-path'
        fill='#fff'
        d='M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z'
      />
    </svg>
  )

  return (
    <ButtonWhoAppear
      props={_props}
      isVisible={visible}
      render={type === 'increment' ? incrementIcon : decrementIcon}
    />
  )
}

export function AddToCartButton(props) {
  const visible = props.imageLoaded && !props.onCart
  const id = useId()

  const addToCartProps = {
    className: 'product__button product__button__add pos-absolute',
    tabIndex: visible ? '0' : '-1',
    'data-action': 'cart',
    'data-no-offset': '',
    'aria-hidden': !visible
  }

  return (
    <ButtonWhoAppear
      props={addToCartProps}
      isVisible={visible}
      render={() => {
        return (
          <>
            <svg
              className='button__add__svg'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              width='21'
              height='20'
              fill='none'
              viewBox='0 0 21 20'>
              <title>add to cart</title>
              <g
                className='button__add__fill'
                fill='#C73B0F'
                clipPath={`url(#${id})`}>
                <path d='M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z' />
                <path d='M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z' />
              </g>
              <defs>
                <clipPath id={id}>
                  <path fill='#fff' d='M.333 0h20v20h-20z' />
                </clipPath>
              </defs>
            </svg>
            <span className='button--add__text'>Add to Cart</span>
          </>
        )
      }}
    />
  )
}

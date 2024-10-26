import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'

export function QuantityButton(props) {
  const onCart = props.onCart

  const quantityProps = {
    className: 'product__button product__button--quantity',
    tabIndex: onCart ? '0' : '-1',
    'aria-label': `${props.buttonType} product count`,
    'data-action': props.buttonType,
    'aria-hidden': !onCart ? 'true' : 'false'
  }

  const renderIcon = () => <QuantityIcon type={props.buttonType} />

  return (
    <ButtonWhoAppear
      props={quantityProps}
      isVisible={props.imageLoaded && onCart}
      buttonClass='.product__button--quantity'
      bounce={false}>
      {renderIcon()}
    </ButtonWhoAppear>
  )
}

function QuantityIcon({ type }) {
  const title = `${type} product count`

  const decrementIcon = (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='10'
      height='10'
      fill='none'
      viewBox='0 0 10 2'>
      <title>{title}</title>
      <path fill='#fff' d='M0 .375h10v1.25H0V.375Z' />
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
      <title>{title}</title>
      <path
        fill='#fff'
        d='M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z'
      />
    </svg>
  )

  return type === 'increment' ? incrementIcon : decrementIcon
}

export function AddToCartButton(props) {
  const onCart = props.onCart

  const addToCartProps = {
    className: `product__button product__button--add pos-absolute${props.show ? ' product--show' : ''}`,
    tabIndex: onCart ? '-1' : '0',
    'aria-hidden': onCart ? 'true' : 'false',
    'data-action': 'cart'
  }

  const addToCartIcon = (
    <svg
      aria-hidden='true'
      xmlns='http://www.w3.org/2000/svg'
      width='21'
      height='20'
      fill='none'
      viewBox='0 0 21 20'>
      <title>add to cart</title>
      <g fill='#C73B0F' clipPath='url(#a)'>
        <path d='M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z' />
        <path d='M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z' />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M.333 0h20v20h-20z' />
        </clipPath>
      </defs>
    </svg>
  )

  return (
    <ButtonWhoAppear
      props={addToCartProps}
      isVisible={props.imageLoaded && !onCart}
      buttonClass='.product__button--add'
      bounce={false}>
      {addToCartIcon}
      <span className='button--add__text'>Add to Cart</span>
    </ButtonWhoAppear>
  )
}

import useHover from '../../hooks/useHover.jsx'
import usePointer from '../../hooks/usePointer.jsx'
import useFocus from '../../hooks/useFocus.jsx'
import utils from '../../utils/utils.js'
import ButtonWhoAppear from '../others/ButtonWhoAppear.jsx'
import { useEffect } from 'react'

export function QuantityButton(props) {
  const [isOnHover, hoverHandler] = useHover('.product__button--quantity')
  const [isClicked, clickHandler] = usePointer(
    `[data-is='${props.buttonType}']`
  )
  const theme = props.theme
  const onCart = props.onCart

  const icon = (() => {
    const title = `${props.buttonType} product count`
    const fillStyles = isOnHover
      ? theme.products.quantityButtons.svg.hover.fill
      : theme.products.quantityButtons.svg.fill

    const decrementIcon = (
      <svg
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        width='10'
        height='10'
        fill='none'
        viewBox='0 0 10 2'>
        <title>{title}</title>
        <path fill={fillStyles} d='M0 .375h10v1.25H0V.375Z' />
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
          fill={fillStyles}
          d='M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z'
        />
      </svg>
    )

    return props.buttonType === 'increment' ? incrementIcon : decrementIcon
  })()

  const quantityProps = {
    className: 'product__button product__button--quantity',
    tabIndex: onCart ? '0' : '-1',
    'aria-label': `${props.buttonType} product count`,
    'data-is': props.buttonType,
    onPointerEnter: hoverHandler,
    onPointerLeave: hoverHandler,
    onPointerUp: clickHandler.pointerUpCancel,
    onPointerCancel: clickHandler.pointerUpCancel,
    onPointerDown: clickHandler.pointerDown,
    style: {
      ...(isOnHover
        ? theme.products.quantityButtons.hover
        : theme.products.quantityButtons),
      ...(isClicked
        ? theme.products.quantityButtons.clicked
        : theme.products.quantityButtons),
      pointerEvents: props.show ? 'auto' : 'none'
    },
    'data-hovered': isOnHover ? 'hover' : '',
    'data-clicked': isClicked ? 'clicked' : ''
  }

  return (
    <ButtonWhoAppear props={quantityProps} isVisible={onCart} show={props.show}>
      {icon}
    </ButtonWhoAppear>
  )
}

export function AddToCartButton(props) {
  const [isOnHover, hoverHandler] = useHover('.product__button--add')
  const [isClicked, clickHandler] = usePointer(
    `[data-is='${props.buttonType}']`
  )
  const [isFocused, focusHandlers] = useFocus(false)
  const onCart = props.onCart

  const addToCartProps = {
    className: 'product__button product__button--add pos-absolute',
    tabIndex: onCart ? '-1' : '0',
    style: {
      ...(isOnHover
        ? props.theme.products.addToCartButton.hover
        : props.theme.products.addToCartButton),
      ...(isFocused
        ? props.theme.products.addToCartButton.focus
        : props.theme.products.addToCartButton),
      pointerEvents: props.show ? 'auto' : 'none'
    },
    onPointerEnter: hoverHandler,
    onPointerLeave: hoverHandler,
    onPointerUp: clickHandler.pointerUpCancel,
    onPointerCancel: clickHandler.pointerUpCancel,
    onPointerDown: clickHandler.pointerDown,
    onContextMenu: utils.preventContextMenu,
    onFocus: focusHandlers.focus,
    onBlur: focusHandlers.blur,
    'aria-hidden': onCart ? 'true' : 'false'
  }

  return (
    <ButtonWhoAppear
      props={addToCartProps}
      isVisible={!onCart}
      show={props.show}>
      <svg
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        width='21'
        height='20'
        fill='none'
        viewBox='0 0 21 20'>
        <title>add to cart</title>
        <g fill={props.theme.products.addToCartButton.svg} clipPath='url(#a)'>
          <path d='M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z' />
          <path d='M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z' />
        </g>
        <defs>
          <clipPath id='a'>
            <path fill='#fff' d='M.333 0h20v20h-20z' />
          </clipPath>
        </defs>
      </svg>
      <span className='button--add__text'>Add to Cart</span>
    </ButtonWhoAppear>
  )
}

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import useFocus from '../../hooks/useFocus.jsx'
import useHover from '../../hooks/useHover.jsx'
import usePointer from '../../hooks/usePointer.jsx'
import { preventContextMenu } from '../../utils/utils.js'

export default function ButtonWhoAppear({
  props,
  isVisible = true,
  render,
  show = true,
  eventClassName,
  pointerEvents = true,
  hoverEvents = true,
  focusEvents = true,
  bounce = true
}) {
  const [isOnHover, hoverHandler] = useHover(eventClassName)
  const [isOnFocus, focusHandlers] = useFocus()
  const [isClicked, pointerHandlers] = usePointer(eventClassName)

  if (typeof render !== 'function' && typeof render !== 'string')
    throw Error('ButtonWhoAppear: renders must be a function or a string!')

  function handlePointerDown(e) {
    if (props.onPointerDown) props?.onPointerDown?.(e)

    pointerHandlers.pointerDown(e)
  }

  function handlePointerUpCancel(e) {
    if (props.onPointerUp) props?.onPointerUp?.(e)

    pointerHandlers.pointerUpCancel(e)
  }

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5
    },
    show: {
      opacity: 1,
      scale: bounce ? [1, 0.95, 1] : 1,

      transition: {
        delay: 0.1,
        duration: 0.4,
        ease: 'easeInOut'
      }
    }
  }

  const events = () => {
    const myEvents = {}

    if (pointerEvents) {
      myEvents.onPointerDown = handlePointerDown
      myEvents.onPointerUp = handlePointerUpCancel
      myEvents.onPointerCancel = handlePointerUpCancel
    }

    if (hoverEvents) {
      myEvents.onPointerEnter = hoverHandler
      myEvents.onPointerLeave = hoverHandler
    }

    if (focusEvents) {
      myEvents.onFocus = focusHandlers.focus
      myEvents.onBlur = focusHandlers.blur
    }

    return myEvents
  }

  return (
    <motion.button
      {...props}
      initial='hidden'
      whileInView={isVisible ? 'show' : 'hidden'}
      viewport={{ once: true }}
      variants={buttonVariants}
      type='button'
      {...(!show ? { disabled: true } : '')}
      {...events()}
      onContextMenu={preventContextMenu}>
      {typeof render !== 'string'
        ? render({ isOnHover, isOnFocus, isClicked })
        : render}
    </motion.button>
  )
}

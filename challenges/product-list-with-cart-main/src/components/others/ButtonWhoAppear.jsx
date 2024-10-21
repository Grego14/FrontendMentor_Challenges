import { motion } from 'framer-motion'
import usePointer from '../../hooks/usePointer.jsx'
import { preventContextMenu } from '../../utils/utils.js'

export default function ButtonWhoAppear({
  props,
  isVisible = true,
  render,
  show = true,
  buttonClass,
  bounce = true
}) {
  const [isClicked, pointerHandlers] = usePointer(buttonClass)

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

  return (
    <motion.button
      {...props}
      initial='hidden'
      whileInView={isVisible ? 'show' : 'hidden'}
      viewport={{ once: true }}
      variants={buttonVariants}
      type='button'
      disabled={!show}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUpCancel}
      onPointerCancel={handlePointerUpCancel}
      onContextMenu={preventContextMenu}>
      {typeof render !== 'string' ? render({ isClicked }) : render}
    </motion.button>
  )
}

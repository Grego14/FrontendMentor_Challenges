import { m } from 'framer-motion'
import { preventContextMenu } from '../../utils/utils.js'

export default function ButtonWhoAppear({
  props,
  isVisible = true,
  buttonClass,
  bounce = true,
  children,
  text
}) {
  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5
    },
    show: {
      opacity: 1,
      scale: bounce ? [1, 0.95, 1] : 1,

      transition: {
        delay: 0.3,
        duration: 0.4,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <m.button
      {...props}
      initial='hidden'
      whileInView={isVisible ? 'show' : 'hidden'}
      viewport={{ once: true }}
      variants={buttonVariants}
      type='button'
      disabled={!isVisible}
      onContextMenu={preventContextMenu}>
      {children || text}
    </m.button>
  )
}

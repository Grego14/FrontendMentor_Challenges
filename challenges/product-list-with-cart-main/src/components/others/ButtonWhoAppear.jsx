import { m } from 'framer-motion'
import { memo } from 'react'
import { preventContextMenu } from '../../utils/utils.js'

export default memo(function ButtonWhoAppear({
  props,
  isVisible = true,
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
      scale: 1,

      transition: {
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
      disabled={props?.disabled ? props?.disabled : !isVisible}
      onContextMenu={preventContextMenu}>
      {children || text}
    </m.button>
  )
})

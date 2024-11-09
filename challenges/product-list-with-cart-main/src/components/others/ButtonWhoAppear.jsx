import { m } from 'framer-motion'
import { memo } from 'react'
import { preventContextMenu } from '../../utils/utils.js'

export default memo(function ButtonWhoAppear({
  props,
  isVisible = true,
  children,
  text
}) {
  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.5
    },

    show: {
      opacity: 1,
      scale: [1, 1.15, 1],
      transition: {
        duration: 0.3,
        delay: 0.2,
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
      variants={props.variants || variants}
      type='button'
      disabled={props?.disabled ? props?.disabled : !isVisible}
      onContextMenu={preventContextMenu}>
      {children || text}
    </m.button>
  )
})

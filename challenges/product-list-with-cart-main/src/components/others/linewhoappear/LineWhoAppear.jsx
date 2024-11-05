import { m } from 'framer-motion'
import { memo } from 'react'
import './LineWhoAppear.css'

export default memo(function LineWhoAppear() {
  const lineVariants = {
    hidden: {
      opacity: 0,
      width: '0%'
    },
    show: {
      opacity: 1,
      width: '100%'
    }
  }

  return (
    <m.div
      className='line-who-appear'
      initial='hidden'
      whileInView='show'
      variants={lineVariants}
    />
  )
})

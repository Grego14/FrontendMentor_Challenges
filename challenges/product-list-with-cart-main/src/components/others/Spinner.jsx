import { useState } from 'react'
import { motion } from 'framer-motion'
import './Spinner.css'

export default function Spinner({
  spinnerColor,
  bgColor,
  containerColor,
  height
}) {
  const rotateAnimation = {
    initial: {
      rotate: 0
    },
    animate: {
      rotate: 360
    },
    transition: {
      delay: 0.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
      duration: 1
    }
  }

  return (
    <motion.div className='spinner-container' style={{ height }}>
      <motion.div
        className='spinner-child'
        style={{ backgroundColor: bgColor }}
        {...rotateAnimation}>
        <motion.div
          className='spinner-rotate-line'
          style={{
            backgroundColor: spinnerColor
          }}
        />
        <motion.div
          className='spinner-rotate-circle'
          style={{
            backgroundColor: containerColor
          }}
        />
      </motion.div>
    </motion.div>
  )
}

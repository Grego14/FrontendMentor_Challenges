import { motion } from 'framer-motion'
import './Spinner.css'

export default function Spinner({ isFor }) {
  const rotateAnimation = {
    initial: {
      rotate: 0
    },
    animate: {
      rotate: 360
    },
    transition: {
      delay: 0.3,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
      duration: 1
    }
  }

  return (
    <div className={`spinner-container${isFor ? ` spinner-${isFor}` : ''}`}>
      <motion.div className='spinner-child' {...rotateAnimation}>
        <div className='spinner-rotate-line' />
        <div className='spinner-rotate-circle' />
      </motion.div>
    </div>
  )
}

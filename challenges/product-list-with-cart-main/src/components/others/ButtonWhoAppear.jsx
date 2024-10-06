import { motion } from 'framer-motion'

export default function ButtonWhoAppear({
  props,
  isVisible = true,
  children,
  show
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
        delay: 0.1,
        duration: 0.2,
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
      {...(!show ? { disabled: true } : '')}>
      {children}
    </motion.button>
  )
}

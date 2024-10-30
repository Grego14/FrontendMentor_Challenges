import { m } from 'framer-motion'
import './LineWhoAppear.css'

export default function LineWhoAppear() {
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

  return <m.div className='line-who-appear' variants={lineVariants} />
}

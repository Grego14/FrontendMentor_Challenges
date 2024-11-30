import './UserData.css'
import { m } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { device } from '/src/utils/utils.js'

export default function UserData(props) {
  const { productsCount, productsFetched, TotalPriceComponent, cartRef } = props

  const userDataRef = useRef(null)
  const [isMoving, setIsMoving] = useState(false)
  const [showUserOrder, setShowUserOrder] = useState(false)

  const options = {
    root: null,
    rootMargin: '0px',
    // threshold[0] = when to move the userData to its initial position
    // threshold[1] = when to move the userData to the top of the screen
    // so it doesn't overlaps the confirm button in mobile devices...
    threshold: [0.2, 0.4]
  }

  // useInView hook from motion can't be used here as it stop working
  // when the Cart component is downloaded and the cartRef is updated so we
  // use an IntersectionObserver
  const observer = new IntersectionObserver(callback, options)

  function callback(entries, observer) {
    for (const entrie of entries) {
      const ths = observer.thresholds
      const ratio = entrie.intersectionRatio

      if (ratio <= 0 || !entrie.isIntersecting) return

      if (ratio >= ths[0] && ratio < ths[1]) {
        userDataRef.current.style.bottom = '0'
        userDataRef.current.style.top = 'unset'
      }

      if (ratio >= ths[1] && ratio > ths[0]) {
        userDataRef.current.style.bottom = 'unset'
        userDataRef.current.style.top = '0'
      }

      setIsMoving(true)
    }
  }

  useEffect(() => {
    if (device.any() === 'mobile' && cartRef.current) {
      observer.observe(cartRef.current)
    }

    return () => {
      observer.disconnect(cartRef.current)
    }
  }, [cartRef.current, observer.observe, observer.disconnect])

  const userDataVariants = {
    hidden: {
      opacity: 0,
      y: '150%'
    },
    show: {
      opacity: 1,
      y: '0%',
      transitionEnd() {
        setShowUserOrder(true)
      }
    },
    move: {
      opacity: [0, 1],

      transitionEnd() {
        setTimeout(() => {
          setIsMoving(false)
        }, 50)
      },

      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <m.div
      className='user-data'
      ref={userDataRef}
      initial='hidden'
      animate={['show', isMoving ? 'move' : '']}
      variants={userDataVariants}>
      <div
        className={`user-data__container${productsFetched ? ' user-data__container--show' : ''}`}>
        <div
          role='status'
          aria-live='polite'
          aria-atomic='true'
          className={`user-order${showUserOrder ? ' user-order--show' : ''}`}>
          <div>
            Products:{' '}
            <span className='user-order__products-count'>{productsCount}</span>
          </div>
          <div>
            Total Price: <TotalPriceComponent />
          </div>
        </div>

        {props.children}
      </div>
    </m.div>
  )
}

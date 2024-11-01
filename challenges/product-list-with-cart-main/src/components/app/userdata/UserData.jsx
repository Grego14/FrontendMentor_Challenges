import './UserData.css'
import { m } from 'framer-motion'
import { lazy, useEffect, useRef, useState } from 'react'
import { device } from '/src/utils/utils.js'

export default function UserData(props) {
  const { productsCount, productsFetched, TotalPriceComponent, cartRef } = props

  const userDataRef = useRef(null)
  const userDevice = device.any()
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

  const observer = new IntersectionObserver(callback, options)

  function callback(entries, observer) {
    for (const entrie of entries) {
      const ths = observer.thresholds
      const ratio = entrie.intersectionRatio

      if (ratio <= 0 || !entrie.isIntersecting) return false

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
    if (userDevice === 'mobile' && cartRef.current) {
      observer.observe(cartRef.current)
    }

    return () => {
      observer.disconnect(cartRef.current)
    }
  }, [cartRef.current, observer.observe, observer.disconnect, userDevice])

  const userOrderProps = {
    productsCount,
    TotalPriceComponent,
    visible: showUserOrder
  }

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
        {productsFetched && (
          <>
            <UserOrder {...userOrderProps} />
            {props.children}
          </>
        )}
      </div>
    </m.div>
  )
}

function UserOrder({ visible, productsCount, TotalPriceComponent }) {
  return (
    <div
      role='status'
      aria-live='polite'
      aria-atomic='true'
      className={`user-order${visible ? ' user-order--show' : ''}`}>
      <div>
        Products:{' '}
        <span className='user-order__products-count'>{productsCount}</span>
      </div>
      <div>
        Total Price: <TotalPriceComponent />
      </div>
    </div>
  )
}

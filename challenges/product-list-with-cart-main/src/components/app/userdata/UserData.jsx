import './UserData.css'
import { m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { device } from '/src/utils/utils.js'
import ToggleThemeButton from '../../others/togglethemebutton/ToggleThemeButton.jsx'
import UserOrder from '../userorder/UserOrder.jsx'

export default function UserData(props) {
  const theme = props.theme
  const userDataRef = useRef(null)
  const userDevice = device.any()
  const [isMoving, setIsMoving] = useState(false)

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
    if (userDevice === 'mobile') {
      observer.observe(props.cartRef.current)
    }

    return () => {
      if (userDevice === 'mobile') {
        observer.disconnect(props.cartRef.current)
      }
    }
  }, [props.cartRef.current, observer.observe, observer.disconnect, userDevice])

  const userOrderProps = {
    totalPrice: props.totalPrice,
    productsCount: props.productsCount,
    visible: props.productsFetched,
    discount: props.discount
  }

  const userDataContainerVariants = {
    hidden: {
      opacity: 0,
      scale: 0
    },
    show: {
      opacity: 1,
      scale: 1
    }
  }

  const userDataVariants = {
    hidden: {
      opacity: 0,
      y: '150%'
    },
    show: {
      opacity: 1,
      y: '0%'
    },
    move: {
      opacity: [0, 1],
      transition: {
        duration: 0.3
      },
      transitionEnd(e) {
        setTimeout(() => {
          setIsMoving(false)
        }, 50)
      }
    }
  }

  return (
    <m.section
      className='user-data'
      ref={userDataRef}
      initial='hidden'
      animate={['show', isMoving ? 'move' : '']}
      variants={userDataVariants}
      transition={{
        delay: 0.2,
        duration: 0.5,
        ease: 'easeInOut'
      }}>
      <m.div
        className='user-data__container'
        initial='hidden'
        animate='show'
        transition={{
          duration: 0.3
        }}
        variants={userDataContainerVariants}>
        {props.productsFetched && <UserOrder {...userOrderProps} />}

        <ToggleThemeButton
          theme={props.theme}
          toggleTheme={props.toggleTheme}
        />
      </m.div>
    </m.section>
  )
}

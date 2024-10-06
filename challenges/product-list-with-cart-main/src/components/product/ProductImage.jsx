import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import utils from '../../utils/utils.js'

export default function ProductImage({
  images,
  theme,
  onCart,
  handleClick,
  setImageLoaded,
  show
}) {
  const imageRef = useRef(null)
  const [loadImage, setLoadImage] = useState(false)

  // can't use the lazy attribute because the image is only visible when the
  // show parameter is true, and that parameter is updated using setImageLoaded.
  //function handleScroll(e) {
  //const rect = imageRef?.current.getBoundingClientRect()

  //setLoadImage(lastState => {
  //// prevent re-renders as we only want the loadImage to be updated one time
  //if (lastState) {
  //document.removeEventListener('scroll', handleScroll)
  //return lastState
  //}

  //if (imageRef.current && rect) {
  //return (
  //rect.top >= 0 &&
  //rect.left >= 0 &&
  //rect.bottom <=
  //(window.innerHeight || document.documentElement.clientHeight) &&
  //rect.right <=
  //(window.innerWidth || document.documentElement.clientWidth)
  //)
  //}

  //return false
  //})
  //}

  function handleImageLoad(e) {
    setTimeout(() => {
      setImageLoaded()
    }, 500)
  }

  function handleImageError(e) {
    throw Error(e)
  }

  if (images !== null && typeof images === 'object') {
    const imageVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1 }
    }

    const noImage = (
      <div className='no-image'>
        No images object provided, it is an invalid one or can't fetch the
        image.
      </div>
    )

    return (
      <motion.div className='product__image-wrapper'>
        <picture>
          <source srcSet={images.mobile} media='(max-width: 640px)' />
          <source
            srcSet={images.tablet}
            media='(min-width: 641px) and (max-width: 1024px)'
          />
          <source srcSet={images.desktop} media='(min-width: 1025px)' />
          <motion.img
            initial='hidden'
            animate={show && 'show'}
            variants={imageVariants}
            onPointerUp={handleClick}
            className='product__image'
            style={{
              borderColor: onCart
                ? theme.products.image.borderColor
                : theme.app.backgroundColor,
              ...(!show && { zIndex: '-1', position: 'absolute' })
            }}
            loading='lazy'
            width='280'
            height='200'
            src={images.mobile}
            alt=''
            aria-hidden='true'
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
        {!show && (
          <Skeleton width={280} height={200} containerClassName='skeleton' />
        )}
      </motion.div>
    )
  }
}

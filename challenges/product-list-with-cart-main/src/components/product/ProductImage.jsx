import { motion } from 'framer-motion'
import Skeleton from 'react-loading-skeleton'
import { device } from '../../utils/utils.js'

export default function ProductImage({
  images,
  theme,
  onCart,
  handleClick,
  setImageLoaded,
  show
}) {
  function handleImageLoad(e) {
    setImageLoaded()
  }

  function handleImageError(e) {
    throw Error(e)
  }

  if (images !== null && typeof images === 'object') {
    const imageVariants = {
      hidden: { opacity: 0, scale: 0.5 },
      show: { opacity: 1, scale: 1 }
    }

    const noImage = (
      <div className='no-image'>
        No images object provided, it is an invalid one or can't fetch the
        image.
      </div>
    )
    const skeletonHeight = (() => {
      const myDevice = device.any()

      if (myDevice === 'mobile') return 200

      return 260
    })()

    return (
      <>
        <picture>
          <source srcSet={images.mobile} media='(max-width: 640px)' />
          <source srcSet={images.tablet} media='(min-width: 641px)' />
          <source srcSet={images.desktop} media='(min-width: 1025px)' />
          <motion.img
            initial='hidden'
            animate={show && 'show'}
            variants={imageVariants}
            onPointerUp={handleClick}
            className={`product__image${show ? ' product__image--loaded' : ''}`}
            loading='lazy'
            width='280'
            height='220'
            src={images.mobile}
            alt=''
            aria-hidden='true'
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </picture>
        {!show && (
          <Skeleton
            width={280}
            height={skeletonHeight}
            containerClassName='skeleton'
          />
        )}
      </>
    )
  }
}

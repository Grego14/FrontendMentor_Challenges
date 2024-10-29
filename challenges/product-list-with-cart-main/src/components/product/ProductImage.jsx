import { m } from 'framer-motion'

export default function ProductImage({ images, onCart, setImageLoaded, show }) {
  function handleImageError(e) {
    throw Error(e)
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.3
      }
    }
  }

  const noImage = (
    <div className='no-image'>
      No images object provided, it is an invalid one or can't fetch the image.
    </div>
  )

  return (
    <picture>
      <source srcSet={images.mobile} media='(max-width: 640px)' />
      <source srcSet={images.tablet} media='(min-width: 641px)' />
      <source srcSet={images.desktop} media='(min-width: 1025px)' />
      <m.img
        initial='hidden'
        animate={show && 'show'}
        variants={imageVariants}
        className={`product__image${show ? ' product__image--loaded' : ''}`}
        loading='lazy'
        width='280'
        height='220'
        src={images.mobile}
        alt=''
        aria-hidden='true'
        onLoad={setImageLoaded}
        onError={handleImageError}
      />
    </picture>
  )
}

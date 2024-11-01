function ProductImage({ images, setImageLoaded, show, priority = 'low' }) {
  function handleImageError(e) {
    throw Error(e)
  }

  return (
    <picture>
      <source srcSet={images.mobile} media='(max-width: 640px)' />
      <source srcSet={images.tablet} media='(min-width: 641px)' />
      <source srcSet={images.desktop} media='(min-width: 1025px)' />
      <img
        className={`product__image${show ? ' product__image--loaded' : ''}`}
        fetchpriority={priority}
        width='280'
        height='220'
        src={images.mobile}
        alt=''
        aria-hidden='true'
        onLoad={setImageLoaded}
        onError={handleImageError}
        draggable='false'
      />
    </picture>
  )
}

export default ProductImage

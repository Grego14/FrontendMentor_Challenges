import { useState } from 'react'
import './Product.css'
import { m } from 'framer-motion'
import { transformPrice } from '../../utils/utils.js'
import * as ProductButtons from './ProductButtons.jsx'

export default function Product({ data }) {
  const {
    name,
    price,
    image,
    category,
    id,
    count,
    outOfStock,
    cart: onCart
  } = data
  const [imageLoaded, setImageLoaded] = useState(false)

  const buttonProps = {
    onCart,
    imageLoaded,
    count
  }

  function imageLoad() {
    setImageLoaded(true)
  }

  const productImageProps = {
    images: image,
    setImageLoaded: imageLoad,
    show: imageLoaded,
    important: id === 0 || id === 1 || id === 2
  }

  const productVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,

      transition: {
        ease: 'easeInOut'
      }
    }
  }

  return (
    <m.div
      variants={productVariants}
      initial='hidden'
      whileInView='show'
      viewport={{ once: true }}
      className={`product${onCart ? ' product--added' : ''}${outOfStock ? ' product--out' : ''}`}
      data-id={id}>
      <div className='product__info'>
        <div className='product__category'>{category}</div>
        <h2 className='product__name'>{name}</h2>

        <div className='product__price'>{transformPrice(price)}</div>
      </div>

      <div className='product__wrapper pos-relative'>
        <div
          className={`out-of-stock${
            outOfStock && imageLoaded ? ' out-of-stock--show' : ''
          }`}>
          Out of stock
        </div>

        {!imageLoaded && <div className='skeleton-product-image' />}

        <ProductImage {...productImageProps} />

        <div className='product__buttons pos-relative'>
          <ProductButtons.AddToCartButton {...buttonProps} />
          <ProductButtons.QuantityButtons {...buttonProps} />
        </div>
      </div>
    </m.div>
  )
}

function ProductImage({ images, setImageLoaded, show, important }) {
  return (
    <picture>
      <source srcSet={images.mobile} media='(max-width: 480px)' />
      <source
        srcSet={images.tablet}
        media='(min-width: 481px) and (max-width: 1023)'
      />
      <source srcSet={images.desktop} media='(min-width: 1024px)' />
      <img
        className={`product__image${show ? ' product__image--loaded' : ''}`}
        fetchpriority={important ? 'high' : 'low'}
        loading={important ? 'eager' : 'lazy'}
        width='280'
        height='260'
        src={images.mobile}
        alt=''
        aria-hidden='true'
        onLoad={setImageLoaded}
        draggable='false'
      />
    </picture>
  )
}

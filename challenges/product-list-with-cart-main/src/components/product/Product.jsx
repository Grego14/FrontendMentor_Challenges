import { useState } from 'react'
import './Product.css'
import { m } from 'framer-motion'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
  extractId,
  invalidUserInteraction,
  matches,
  preventContextMenu,
  transformPrice
} from '../../utils/utils.js'
import * as ProductButton from './ProductButtons.jsx'
import ProductImage from './ProductImage.jsx'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Products({
  products,
  productsHandler,
  productsFetched,
  cartVisible
}) {
  function handleProducts(e) {
    if (invalidUserInteraction(e)) return

    const button = e.target.dataset.action
      ? e.target
      : e.target.closest('[data-action]')

    if (!button || button.disabled) return

    const userAction = button.dataset.action
    const id = extractId(e)

    if (!userAction || (id !== 0 && !id)) return

    productsHandler({
      id,
      type: userAction
    })
  }

  return (
    <>
      <h1 className='products-title'>Desserts</h1>
      <div
        className='products'
        onPointerUp={handleProducts}
        onKeyDown={handleProducts}>
        {productsFetched &&
          Object.values(products).map(product => (
            <Product data={product} onCart={product.cart} key={product.id} />
          ))}
      </div>
    </>
  )
}

export function Product({ data, onCart }) {
  const { name, price, image, category, id, count, outOfStock } = data
  const [imageLoaded, setImageLoaded] = useState(false)

  const buttonProps = {
    onCart,
    imageLoaded
  }

  function imageLoad() {
    setImageLoaded(true)
  }

  const productImageProps = {
    images: image,
    onCart,
    setImageLoaded: imageLoad,
    show: imageLoaded
  }

  const productInfoProps = {
    name,
    category,
    price,
    outOfStock,
    show: imageLoaded
  }

  const productButtonsQuantityVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: {
      opacity: 1,
      scale: 1,

      transition: {
        delay: 0.2,
        ease: 'easeInOut'
      }
    }
  }

  const productVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,

      transition: {
        delay: 0.2,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <SkeletonTheme baseColor='var(--rose-50)' highlightColor='#eee'>
      <m.div
        variants={productVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true }}
        className={`product${onCart ? ' product--added' : ''}${outOfStock ? ' product--out' : ''}`}
        id={`product-${id}`}>
        <ProductInfo {...productInfoProps} />

        <div className='product__wrapper pos-relative'>
          {outOfStock && imageLoaded && (
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className='out-of-stock'>
              Out of stock
            </m.div>
          )}

          <ProductImage {...productImageProps} />

          <div className='product__buttons pos-relative'>
            <ProductButton.AddToCartButton {...buttonProps} />

            <m.div
              className='product__buttons__quantity pos-absolute'
              variants={productButtonsQuantityVariants}
              initial='hidden'
              animate={imageLoaded && onCart ? 'show' : 'hidden'}
              aria-hidden={onCart ? 'false' : 'true'}
              onContextMenu={preventContextMenu}>
              <ProductButton.QuantityButton
                buttonType='decrement'
                {...buttonProps}
              />

              <div
                className='product-quantity'
                aria-label={`product count is ${count}`}
                aria-live='polite'>
                {count}
              </div>

              <ProductButton.QuantityButton
                buttonType='increment'
                {...buttonProps}
              />
            </m.div>
          </div>
        </div>
      </m.div>
    </SkeletonTheme>
  )
}

function ProductInfo(props) {
  const { category, name, price, show } = props

  return (
    <div className='product__info'>
      <div className='product__category'>
        {(show && category) || (
          <Skeleton width='45%' containerClassName='skeleton' />
        )}
      </div>
      <h2 className='product__name'>
        {(show && name) || (
          <Skeleton width='80%' containerClassName='skeleton' />
        )}
      </h2>

      <div className='product__price'>
        {(show && transformPrice(price)) || (
          <Skeleton width='35%' containerClassName='skeleton' />
        )}
      </div>
    </div>
  )
}

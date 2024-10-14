import { useContext, useEffect, useState } from 'react'
import './Product.css'
import { motion } from 'framer-motion'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { ThemeContext } from '../../theme-context.jsx'
import {
  extractId,
  matches,
  preventContextMenu,
  transformPrice,
  invalidUserInteraction
} from '../../utils/utils.js'
import Section from '../others/Section.jsx'
import Spinner from '../others/spinner/Spinner.jsx'
import * as ProductButton from './ProductButtons.jsx'
import ProductImage from './ProductImage.jsx'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Products({
  products,
  productsHandler,
  productsFetched,
  cartVisible
}) {
  let keyHandler = 1
  const outputElements = []

  function getUserAction(e) {
    const buttonsClasses = {
      cart: '.product__button--add',
      increment: '[data-is="increment"]',
      decrement: '[data-is="decrement"]'
    }

    for (const [key, className] of Object.entries(buttonsClasses)) {
      if (matches(e.target, className)) return key
    }
  }

  function handleProducts(e) {
    if (invalidUserInteraction(e)) return

    const userAction = getUserAction(e)
    const id = extractId(e)

    if (!userAction) return
    if (id !== 0 && !id) return

    productsHandler({
      id,
      type:
        userAction !== 'decrement' && userAction !== 'increment'
          ? 'cart'
          : 'quantity',
      // quantity it's only used when userAction is not 'cart'
      quantity: userAction
    })
  }

  for (const product of Object.values(products)) {
    outputElements.push(
      <Product data={product} onCart={product?.cart} key={keyHandler} />
    )

    keyHandler++
  }

  return (
    <Section isFor='products'>
      <h1 className='products-title'>Desserts</h1>
      {cartVisible ? (
        <motion.div
          className='products'
          layout
          onPointerUp={handleProducts}
          onKeyDown={handleProducts}>
          {productsFetched && outputElements}
        </motion.div>
      ) : (
        <Spinner isFor='products' />
      )}
    </Section>
  )
}

export function Product({ data, onCart }) {
  const { name, price, image, category, id, count, outOfStock } = data
  const [imageLoaded, setImageLoaded] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(state => {
      return imageLoaded
    })
  }, [imageLoaded])

  const buttonProps = {
    onCart,
    show
  }

  function imageLoad() {
    setTimeout(() => {
      setImageLoaded(true)
    }, 300)
  }

  function handleImageClick(e) {
    // create a component to see the image in a good resolution...
    console.log(e)
  }

  const productImageProps = {
    images: image,
    onCart,
    setImageLoaded: imageLoad,
    handleClick: handleImageClick,
    show
  }

  const productInfoProps = {
    name,
    category,
    price,
    outOfStock,
    show
  }

  const productButtonsQuantityVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    show: {
      opacity: 1,
      scale: 1,

      // same as ButtonWhoAppear component
      transition: {
        delay: 0.1,
        duration: 0.2,
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
      <motion.div
        variants={productVariants}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true }}
        className={`product${onCart ? ' product--added' : ''}${outOfStock ? ' product--out' : ''}`}
        id={`product-${id}`}>
        <ProductInfo {...productInfoProps} />

        <motion.div className='product__wrapper pos-relative'>
          {outOfStock && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className='out-of-stock'>
              Out of stock
            </motion.div>
          )}

          <ProductImage {...productImageProps} />

          <div className='product__buttons pos-relative'>
            <ProductButton.AddToCartButton {...buttonProps} />

            <motion.div
              className='product__buttons__quantity pos-absolute'
              variants={productButtonsQuantityVariants}
              initial='hidden'
              animate={show ? 'show' : 'hidden'}
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
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </SkeletonTheme>
  )
}

function ProductInfo(props) {
  const { category, name, price, show } = props

  return (
    <div className='product__info'>
      <div
        className='product__category'
        style={{
          maxWidth: show ? '100%' : '45%'
        }}>
        {(show && category) || <Skeleton />}
      </div>
      <h2
        className='product__name'
        // maxWidth here as need it to turn into 'auto' when the skeleton is removed
        // so we avoid text wraps on long product names...
        style={{ maxWidth: show ? '100%' : '80%' }}>
        {(show && name) || <Skeleton />}
      </h2>

      <div
        className='product__price'
        style={{
          maxWidth: show ? '100%' : '45%'
        }}>
        {(show && transformPrice(price)) || <Skeleton />}
      </div>
    </div>
  )
}

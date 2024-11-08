import { getTotalProductPrice } from '../utils/utils.js'

export default function productsReducer(state, action) {
  const types = {
    cart: handleProductInCart,
    decrement: handleProductQuantity,
    increment: handleProductQuantity,
    fetch: handleFetch,
    newOrder: handleNewOrder
  }

  const id = action.id
  const element = state.get(id)

  // fetch and newOrder types doesn't have element and id
  if (!element && action.type !== 'fetch' && action.type !== 'newOrder')
    return state

  function handleProductInCart() {
    const map = new Map(state)
    const _element = { ...element, cart: !element.cart }
    const lastOrder = (() => {
      const orderProducts = [...state.values()]
        .filter(product => product.order)
        .sort((a, b) => a.order - b.order)

      return orderProducts[orderProducts.length - 1]?.order
    })()

    // if elementProps.cart is false it means the product
    // is being removed so count should be reset to 0.
    const count = _element.cart ? _element.count + 1 : 0
    const outOfStock = count >= _element.quantity
    const order = lastOrder ? lastOrder + 1 : 1

    map.set(id, {
      ..._element,
      count: count,
      // initial should be false otherwise the initial animation will
      // be fired once added again.
      initial: false,
      outOfStock,
      totalPrice: _element.price,
      order
    })

    return map
  }

  function handleProductQuantity() {
    const map = new Map(state)

    // increment | decrement
    const userAction = action.type

    const _element = { ...element }

    let count = element.count
    let outOfStock = count >= element.quantity
    let cart = element.cart

    // prevents unnecessary rendering
    if (outOfStock && userAction !== 'decrement') return

    userAction === 'increment' ? count++ : count--
    outOfStock = count >= element.quantity

    // compare to 0 because above we are decrementing no matter what
    // and if it was 1 now is 0
    if (userAction === 'decrement' && count === 0) {
      cart = false
      outOfStock = false
      _element.order = null
    }

    map.set(id, {
      ..._element,
      cart,
      outOfStock,
      count,
      totalPrice: getTotalProductPrice(_element.price, count)
    })
    return map
  }

  function handleFetch() {
    return new Map(action.products)
  }

  function handleNewOrder() {
    const map = new Map()

    for (const product of [...state.values()]) {
      map.set(product.id, {
        ...product,
        cart: false,
        count: 0,
        outOfStock: false
      })
    }

    return map
  }

  return types[action.type]?.() || state
}

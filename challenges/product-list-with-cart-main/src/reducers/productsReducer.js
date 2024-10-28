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
    const elementProps = { ...element, cart: !element.cart }

    // if elementProps.cart is false it means the product
    // is being removed so count should be reset to 0.
    const count = elementProps.cart ? elementProps.count + 1 : 0
    const outOfStock = count >= elementProps.quantity

    map.set(id, {
      ...elementProps,
      count: count,
      // initial should be false otherwise the initial animation will
      // be fired once added again.
      initial: false,
      outOfStock
    })

    return map
  }

  function handleProductQuantity() {
    const map = new Map(state)

    const userAction = action.type
    let count = element.count
    let outOfStock = count >= element.quantity

    // prevents unnecessary rendering
    if (outOfStock && userAction !== 'decrement') return

    userAction === 'increment' ? count++ : count--
    outOfStock = count >= element.quantity

    // compare to 0 because above we are decrementing no matter what
    // and if it was 1 now is 0
    if (userAction === 'decrement' && count === 0) {
      element.cart = false
      outOfStock = false
    }

    const elementProps = { ...element, count, outOfStock }

    map.set(id, elementProps)
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

  return types[action.type]() || state
}

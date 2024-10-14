export default function productsReducer(state, action) {
  switch (action.type) {
    case 'cart': {
      const map = new Map(state)
      const id = action.id
      const element = state.get(id)

      if (!element) return state

      const elementProps = { ...element, cart: !element.cart }

      map.set(id, {
        ...elementProps,

        // if elementProps.cart is false it means the product is being removed
        // so count should be reset to 1 and initial should be false otherwise
        // the initial animation will be fired once added again.
        count: elementProps.cart ? elementProps.count : 1,
        initial: false
      })
      return map
    }

    case 'quantity': {
      const id = action.id
      const element = state.get(id)
      const map = new Map(state)
      const quantity = action.quantity

      if (!element) return state

      let count = element.count

      let outOfStock = count >= element.quantity

      // prevents unnecessary rendering
      if (outOfStock && quantity !== 'decrement') return state

      quantity === 'increment' ? count++ : count--
      outOfStock = count >= element.quantity

      // compare to 0 because above we are decrementing no matter what
      // and if it was 1 now is 0
      if (quantity === 'decrement' && count === 0) {
        element.cart = false
        count = 1
        outOfStock = false
      }

      const elementProps = { ...element, count, outOfStock }

      map.set(id, elementProps)
      return map
    }

    case 'fetch':
      return new Map(action.products)

    case 'newOrder': {
      const map = new Map()

      for (const product of [...state.values()]) {
        map.set(product.id, { ...product, cart: false, count: 1 })
      }

      return map
    }

    default:
      return state
  }
}

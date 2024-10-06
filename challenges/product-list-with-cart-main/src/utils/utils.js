const dom = document

const utils = {
  transformPrice(price) {
    return `$${Number(price).toFixed(2)}`
  },

  getTotalPrice(prices) {
    let total = 0

    for (const price of prices) {
      total += price
    }

    return total
  },

  getTotalProductPrice(price, count) {
    let total = 0
    let i = 0

    while (i < count) {
      total += price
      i++
    }

    return total
  },

  // useful when using icon buttons... etc
  matches(element, className) {
    return element.matches(className) || element.matches(`${className} *`)
  },

  isEnterKey(e) {
    return e.type === 'keydown' && e.key === 'Enter'
  },

  invalidUserInteraction(e) {
    if (e.type === 'pointerup' && e.button !== 0) return true
    if (e.type === 'keydown' && !this.isEnterKey(e)) return true

    return false
  },

  extractId(event) {
    return typeof event === 'number'
      ? event
      : Number(event?.target?.closest('*[id]')?.id?.match(/[0-9]+/)?.[0])
  },

  preventContextMenu(e) {
    e.preventDefault()
  },

  device: {
    mobile: matchMedia('(max-width: 480px)'),

    tablet: matchMedia('(min-width: 481px) and (max-width: 1023px)'),

    desktop: matchMedia('(min-width: 1024px)'),

    any() {
      for (const [key, md] of Object.entries(this)) {
        if (key === 'any') continue

        if (md.matches) return key
      }
      return null
    }
  }
}

export default utils

const dom = document

export function transformPrice(price) {
  return `$${Number(price).toFixed(2)}`
}

export function getTotalPrice(prices) {
  let total = 0

  for (const price of prices) {
    total += price
  }

  return total
}

export function getTotalProductPrice(price, count) {
  let total = 0
  let i = 0

  while (i < count) {
    total += price
    i++
  }

  return total
}

// useful when using button with icons... etc
export function matches(element, className) {
  return element.matches(className) || element.matches(`${className} *`)
}

export function isEnterKey(e) {
  return e.type === 'keydown' && e.key === 'Enter'
}

export function invalidUserInteraction(e) {
  if (e.type === 'pointerup' && e.button !== 0) return true
  if (e.type === 'keydown' && !isEnterKey(e)) return true

  return false
}

export function extractId(event) {
  return typeof event === 'number'
    ? event
    : Number(event?.target?.closest('*[id]')?.id?.match(/[0-9]+/)?.[0])
}

export function preventContextMenu(e) {
  e.preventDefault()
}

const device = {
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

const utils = {
  transformPrice,
  getTotalPrice,
  getTotalProductPrice,
  matches,
  isEnterKey,
  invalidUserInteraction,
  extractId,
  preventContextMenu,
  device
}

export default utils
export { device }

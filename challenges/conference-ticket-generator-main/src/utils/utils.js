export const BASE_URL = import.meta.env.BASE_URL

export function preventDefault(e) {
  e.preventDefault()
}

export function howManyChars(str, char) {
  const strSplitted = str.split('')
  let chars = 0
  let lastIndex = strSplitted.indexOf(char)

  while (lastIndex !== -1) {
    lastIndex = strSplitted.indexOf(char, lastIndex + 1)
    chars++
  }

  return chars
}

export function setErrorAttribute(target) {
  target?.setAttribute('data-error', '')
}

export function removeErrorAttribute(target) {
  target?.removeAttribute('data-error')
}

export function getClosest(target, selector) {
  return target ? target.closest(selector) : null
}

export function substring(str, length) {
  return str.length >= length ? `${str.substring(0, length)}...` : str
}

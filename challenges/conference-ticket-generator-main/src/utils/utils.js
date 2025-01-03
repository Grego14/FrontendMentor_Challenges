const utils = {
  preventDefault,
  howManyChars
}

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

export default utils

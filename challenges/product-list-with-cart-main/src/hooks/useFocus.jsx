import { useState } from 'react'

// as focus doesn't bubble theres no need to pass a target
export default function useFocus(initialValue = false) {
  const [onFocus, setOnFocus] = useState(initialValue)

  function focus(e) {
    setOnFocus(true)
  }

  function blur(e) {
    setOnFocus(false)
  }

  return [onFocus, { focus, blur }]
}

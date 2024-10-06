import { useState } from 'react'

export default function useFocus(initialValue) {
  const [onFocus, setOnFocus] = useState(initialValue)

  function focus(e) {
    setOnFocus(true)
  }

  function blur(e) {
    setOnFocus(false)
  }

  return [onFocus, { focus, blur }]
}

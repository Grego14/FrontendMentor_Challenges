import { useRef, useState } from 'react'

export default function useDebounce(fn, delay) {
  const [debouncing, setDebouncing] = useState(true)
  const timeout = useRef(null)

  function debounce(props) {
    clearTimeout(timeout.current)
    setDebouncing(true)

    timeout.current = setTimeout(() => {
      setDebouncing(false)
      fn(props)
    }, delay)
  }

  return [debouncing, debounce]
}

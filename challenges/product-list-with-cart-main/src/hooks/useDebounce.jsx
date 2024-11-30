import { useRef, useState, useCallback } from 'react'

export default function useDebounce(fn, delay) {
  const [debouncing, setDebouncing] = useState(true)
  const timeout = useRef(null)

  const debounce = useCallback(
    props => {
      clearTimeout(timeout.current)
      setDebouncing(true)

      timeout.current = setTimeout(() => {
        setDebouncing(false)
        fn(props)
      }, delay)
    },
    [fn, delay]
  )

  return [debouncing, debounce]
}

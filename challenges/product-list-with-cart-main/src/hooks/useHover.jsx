import { useState } from 'react'
import utils from '../utils/utils.js'

export default function useHover(targetClass) {
  const [isOnHover, setIsOnHover] = useState(false)

  // must be added in the element who we want to apply the hover via
  // onPointerEnter and onPointerLeave events.
  function handleHover(e) {
    if (e.type !== 'pointerenter' && e.type !== 'pointerleave') return

    setIsOnHover(() => {
      const target = e.target.matches(targetClass)
        ? e.target
        : e.target.closest(targetClass)

      if (!target) return false

      if (target && e.type !== 'pointerleave') {
        return true
      }

      return false
    })
  }

  return [isOnHover, handleHover]
}

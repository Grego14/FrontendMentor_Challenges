import { useState } from 'react'
import utils from '../utils/utils.js'

export default function usePointer(targetClass, classToAdd = 'clicked') {
  const [isOnPointer, setIsOnPointer] = useState(false)

  if (!targetClass && document.querySelector(targetClass))
    throw Error(
      'usePointer: targetClass must be a valid CSS Selector or HTML Tag'
    )

  const target = e =>
    e?.target?.matches(targetClass) ? e.target : e.target.closest(targetClass)

  if (!target) throw Error("usePointer: target can't be found.")

  return [
    isOnPointer,
    {
      pointerDown(e) {
        if (utils.invalidUserInteraction(e)) return

        const t = target(e)
        if (!t) return

        t.classList.add(classToAdd)
        setIsOnPointer(true)
        t.setPointerCapture(e.pointerId)
      },
      pointerUpCancel(e) {
        if (utils.invalidUserInteraction(e)) return

        const t = target(e)
        if (!t) return

        t.classList.remove(classToAdd)
        setIsOnPointer(false)
        t.releasePointerCapture(e.pointerId)
      }
    }
  ]
}

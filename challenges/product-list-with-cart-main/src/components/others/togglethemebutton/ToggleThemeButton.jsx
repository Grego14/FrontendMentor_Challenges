import './ToggleThemeButton.css'
import { useState } from 'react'
import iconDark from '/assets/images/icon-dark.svg'
import iconLight from '/assets/images/icon-light.svg'
import ButtonWhoAppear from '../ButtonWhoAppear.jsx'

export default function ToggleThemeButton({ theme, toggleTheme }) {
  let timeout

  function handleToggleTheme(e) {
    const target = e.target.matches('.toggle-theme')
      ? e.target
      : e.target.closest('.toggle-theme')

    target.disabled = true
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      target.removeAttribute('disabled')
      toggleTheme()
    }, 200)
  }

  const toggleThemeProps = {
    className: 'toggle-theme',
    onPointerUp: handleToggleTheme,
    onKeyDown: handleToggleTheme,
    'aria-label': `change theme to ${theme === 'light' ? 'dark' : 'light'} mode`
  }

  return (
    <ButtonWhoAppear props={toggleThemeProps}>
      <img
        src={theme === 'light' ? iconLight : iconDark}
        alt=''
        aria-hidden='true'
        width={30}
        height={30}
      />
    </ButtonWhoAppear>
  )
}

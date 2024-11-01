import './ToggleThemeButton.css'
import { invalidUserInteraction } from '/src/utils/utils.js'
import ButtonWhoAppear from '../ButtonWhoAppear.jsx'

export default function ToggleThemeButton({ theme, toggleTheme }) {
  let timeout

  function handleToggleTheme(e) {
    if (invalidUserInteraction(e)) return

    const target = e.target.matches('.toggle-theme')
      ? e.target
      : e.target.closest('.toggle-theme')

    target.disabled = true
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      target.removeAttribute('disabled')
      toggleTheme(e)
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
        src={
          theme === 'light'
            ? '/assets/images/icon-light.svg'
            : '/assets/images/icon-dark.svg'
        }
        alt=''
        aria-hidden='true'
        width={30}
        height={30}
        draggable='false'
      />
    </ButtonWhoAppear>
  )
}

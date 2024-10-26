import './ToggleThemeButton.css'
import iconDark from '/assets/images/icon-dark.svg'
import iconLight from '/assets/images/icon-light.svg'
import ButtonWhoAppear from '../ButtonWhoAppear.jsx'

export default function ToggleThemeButton({ theme, toggleTheme }) {
  const toggleThemeProps = {
    className: 'toggle-theme',
    onPointerUp: toggleTheme,
    onKeyDown: toggleTheme,
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

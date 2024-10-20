import './ToggleThemeButton.css'
import { useContext } from 'react'
import iconDark from '/assets/images/icon-dark.svg'
import iconLight from '/assets/images/icon-light.svg'
import { ThemeContext } from '/src/theme-context.jsx'
import ButtonWhoAppear from '../ButtonWhoAppear.jsx'

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useContext(ThemeContext)

  const toggleThemeProps = {
    className: 'toggle-theme',
    onPointerUp: toggleTheme,
    'aria-label': `change theme to ${theme} mode`
  }

  return (
    <ButtonWhoAppear
      props={toggleThemeProps}
      render={() => (
        <img
          src={theme.is === 'light' ? iconLight : iconDark}
          alt=''
          aria-hidden='true'
          width={30}
          height={30}
        />
      )}
    />
  )
}

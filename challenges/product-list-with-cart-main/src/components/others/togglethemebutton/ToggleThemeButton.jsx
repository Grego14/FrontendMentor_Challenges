import './ToggleThemeButton.css'
import { invalidUserInteraction } from '/src/utils/utils.js'
import { m } from 'motion/react'
import useDebounce from '/src/hooks/useDebounce'
import AppButton from '../appbutton/AppButton.jsx'

export default function ToggleThemeButton({ theme, toggleTheme }) {
  const [isDebouncing, handleToggleThemeClick] = useDebounce(e => {
    if (invalidUserInteraction(e)) return

    const target = e.target.matches('.toggle-theme')
      ? e.target
      : e.target.closest('.toggle-theme')

    target.removeAttribute('disabled')
    toggleTheme(e)
  }, 200)

  const toggleThemeProps = {
    className: 'toggle-theme',
    onPointerUp: handleToggleThemeClick,
    onKeyDown: handleToggleThemeClick,
    'aria-label': `change theme to ${theme === 'light' ? 'dark' : 'light'} mode`,
    variants: {
      hidden: {
        opacity: 0,
        x: '100%'
      },
      show: {
        opacity: 1,
        x: '0%',
        transition: {
          duration: 0.4
        }
      }
    }
  }

  return (
    <AppButton
      props={toggleThemeProps}
      render={
        <img
          src={`${import.meta.env.BASE_URL}${
            theme === 'light'
              ? 'assets/images/icon-light.svg'
              : 'assets/images/icon-dark.svg'
          }`}
          alt=''
          aria-hidden='true'
          width={30}
          height={30}
          draggable='false'
        />
      }
    />
  )
}

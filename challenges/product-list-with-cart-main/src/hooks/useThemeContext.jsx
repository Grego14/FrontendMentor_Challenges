import { ThemeContext, themes } from '../theme-context.jsx'
import { useContext } from 'react'

export default function useThemeContext() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return { theme, toggleTheme, ThemeContext }
}

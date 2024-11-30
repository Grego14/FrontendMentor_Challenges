import ButtonWhoAppear from '../ButtonWhoAppear.jsx'
import './AppButton.css'
import { memo } from 'react'

const AppButton = memo(function AppButton({ props, render }) {
  const _props = {
    ...props,
    className: `app-button ${props?.className}`
  }

  return <ButtonWhoAppear props={_props} render={render} />
})

export default AppButton

import ButtonWhoAppear from '../ButtonWhoAppear.jsx'
import './AppButton.css'

export default function AppButton({ props, render }) {
  const _props = {
    ...props,
    className: `app-button ${props?.className}`
  }

  return <ButtonWhoAppear props={_props} render={render} />
}

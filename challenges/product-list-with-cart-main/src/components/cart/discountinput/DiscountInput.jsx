import { useState } from 'react'
import ButtonWhoAppear from '../../others/ButtonWhoAppear.jsx'
import './DiscountInput.css'
import { invalidUserInteraction } from '/src/utils/utils.js'
import useDebounce from '/src/hooks/useDebounce.jsx'

export default function DiscountInput(props) {
  const { message, validCode, setValid, id, isValid } = props
  const [value, setValue] = useState(message)

  const [showDiscountInput, setShowDiscountInput] = useState(false)
  const [applyClicked, setApplyClicked] = useState(false)

  const [isTyping, debounce] = useDebounce(e => {
    setValue(e.target.value)
  }, 250)

  function handleOnChange(e) {
    setApplyClicked(false)
    debounce(e)
  }

  function handleTextClick(e) {
    if (invalidUserInteraction(e)) return

    setShowDiscountInput(true)
  }

  function handleApplyClick(e) {
    if (invalidUserInteraction(e)) return

    setApplyClicked(true)
    setValid(value === validCode)
  }

  const clickedAndInvalid = applyClicked && !isValid

  const inputBtnProps = {
    onPointerUp: handleApplyClick,
    onKeyDown: handleApplyClick,
    className: 'discount-input-button',
    disabled: clickedAndInvalid,
    'data-hover': ''
  }

  const textClickBtnProps = {
    className: 'discount-text-click',
    onPointerUp: handleTextClick,
    onKeyDown: handleTextClick
  }

  return (
    <div className='discount-input-container'>
      {showDiscountInput && !isValid ? (
        <>
          <label
            htmlFor={id}
            value='discount code'
            className='discount-input-label'>
            {clickedAndInvalid ? (
              <span className='discount-error'>Invalid Code</span>
            ) : (
              'Discount Code'
            )}
            <input
              className={`discount-input${clickedAndInvalid ? ' invalid' : ''}`}
              type='text'
              placeholder={message}
              onChange={handleOnChange}
              name={id}
              id={id}
            />
          </label>

          <ButtonWhoAppear props={inputBtnProps} render='Apply' />
        </>
      ) : (
        !isValid && (
          <div className='discount-text'>
            Discount code?{' '}
            <ButtonWhoAppear props={textClickBtnProps} render='Click here!' />
          </div>
        )
      )}

      {isValid && <div className='discount-text'>-20% discount applied!</div>}
    </div>
  )
}

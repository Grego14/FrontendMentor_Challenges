import { useRef, useState } from 'react'
import ButtonWhoAppear from '../../others/ButtonWhoAppear.jsx'
import './DiscountInput.css'
import { invalidUserInteraction } from '/src/utils/utils.js'

export default function DiscountInput(props) {
  const { message, validCode, setValid, id, isValid } = props
  const [value, setValue] = useState(message)
  const [showDiscountInput, setShowDiscountInput] = useState(false)

  const [isTyping, setIsTyping] = useState(false)
  const typingDelay = 250
  const typingTimeout = useRef(null)

  const [applyClicked, setApplyClicked] = useState(false)

  function handleOnChange(e) {
    setIsTyping(true)
    clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      setValue(e.target.value)
      setIsTyping(false)
    }, 300)

    setApplyClicked(false)
  }

  function handleTextClick(e) {
    if (invalidUserInteraction(e)) return

    setShowDiscountInput(true)
  }

  function handleApplyClick(e) {
    setApplyClicked(true)

    setValid(value === validCode)
  }

  const clickedAndInvalid = applyClicked && !isValid
  const buttonProps = {
    onPointerUp: handleApplyClick,
    className: 'discount-input-button'
  }

  return (
    <>
      {!showDiscountInput && (
        <div className='discount-text'>
          Discount code?{' '}
          <ButtonWhoAppear
            render='Click here!'
            props={{
              className: 'discount-text-click',
              onPointerUp: handleTextClick,
              onKeyDown: handleTextClick
            }}
            bounce={false}
          />
        </div>
      )}
      {showDiscountInput && (
        <div className='discount-input-container'>
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

          <ButtonWhoAppear
            eventClassName='discount-input-button'
            render='Apply'
            props={buttonProps}
            show={!clickedAndInvalid}
          />
        </div>
      )}
    </>
  )
}

import { useReducer, useRef, useState } from 'react'
import './ConferenceForm.css'
import DropZone from '../dropzone/DropZone'
import userDataReducer from '../../reducers/userDataReducer'
import {
  preventDefault,
  setErrorAttribute,
  removeErrorAttribute,
  getClosest
} from '../../utils/utils'
import useBounce from '../../hooks/useBounce'
import ErrorIcon from '../erroricon/ErrorIcon'

const getClosestFormField = target =>
  getClosest.call(null, target, '.form__field')

export default function ConferenceForm({
  showTicket,
  sendTicketData,
  dropZoneRef
}) {
  const [userData, dispatchUserData] = useReducer(userDataReducer, {
    'full-name': {
      value: '',
      error: ''
    },

    email: {
      value: '',
      error: ''
    },

    'github-name': {
      value: '',
      error: ''
    },

    userAvatar: {
      value: ''
    }
  })

  const formRef = useRef(null)
  const buttonRef = useRef(null)
  const [isGithubUserValid, setIsGithubUserValid] = useState(false)
  const [validatingGithubUser, setValidatingGithubUser] = useState(false)

  // lastGithubUserFetched is only updated when the fetching was successful
  const [lastGithubUserFetched, setLastGithubUserFetched] = useState('')

  const [formSent, setFormSent] = useState(false)
  const [inputsAreValid, setInputsAreValid] = useState(false)

  const [addBounceClass, removeBounceClass] = useBounce(buttonRef)
  const debounceTimeout = useRef(null)

  function setInputErrorMsg(inputName, msg) {
    dispatchUserData({ type: 'error', who: inputName, msg })
  }

  // choose the appropriate validation function and send an object
  // with the validation state and an error message that may be empty
  async function runValidationFunc(inputName, inputValue) {
    const validations = await import('./validations.js').then(
      mod => mod.default
    )

    const trimmedValue = inputValue.trim()
    const userToFetch = trimmedValue.split('@')[1]
    const validateFuncs = {
      'full-name': validations.validateUserName,
      email: validations.validateUserEmail,
      'github-name': validations.validateUserGithubName
    }

    let validationError = validateFuncs[inputName](trimmedValue)

    if (
      inputName === 'github-name' &&
      !validationError &&
      lastGithubUserFetched !== userToFetch
    ) {
      setValidatingGithubUser(true)
      buttonRef.current.disabled = true

      await fetch(`https://api.github.com/users/${userToFetch}`)
        .then(res => res.json())
        .then(
          data => {
            if (data.status === '404') {
              validationError = 'Github user not found'
            }

            setIsGithubUserValid(!data.status)
            setLastGithubUserFetched(userToFetch)
          },

          err => {
            validationError = 'Unknown error when fetching the user'
            setIsGithubUserValid(false)
            console.error(err)
          }
        )
        .finally(() => {
          setValidatingGithubUser(false)
          buttonRef.current.removeAttribute('disabled')
        })
    }

    return {
      msg: validationError || '',
      state: !validationError
    }
  }

  function handleInputsChange(e) {
    const inputName = e.target.name
    const closestField = getClosestFormField(e.target)

    if (inputName === 'github-name') setIsGithubUserValid(false)

    setFormSent(false)
    setInputErrorMsg(inputName, '')
    removeErrorAttribute(closestField)
  }

  function handleFormTransitionEnd(e) {
    // prevent sending the data if the transition event isn't from the Form
    if (e.target !== formRef.current) return

    sendTicketData({
      fullName: userData['full-name'].value,
      email: userData.email.value,
      github: userData['github-name'].value,
      userAvatar: userData.userAvatar.value
    })

    showTicket()
  }

  function handleButtonClick() {
    clearTimeout(debounceTimeout.current)
    addBounceClass()

    debounceTimeout.current = setTimeout(async () => {
      const inputs = formRef.current.querySelectorAll(
        'input:not([type="file"])'
      )
      let inputsAreValidTemp = true

      // run validationfunc on each input,
      // set/remove the error attribute and update userData
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        const closestField = getClosestFormField(input)
        const inputValidation = await runValidationFunc(input.name, input.value)

        setInputErrorMsg(input.name, inputValidation.msg)
          ; (inputValidation.state ? removeErrorAttribute : setErrorAttribute)(
            closestField
          )

        dispatchUserData({ type: 'set', who: input.name, value: input.value })

        // check for inputsAreValidTemp so we avoid updating it to true if there's
        // was already an invalid input
        if (!inputValidation.state || inputsAreValidTemp) {
          inputsAreValidTemp = inputValidation.state
        }
      }

      // avatar validations are managed in the DropZone Component
      const avatarIsValid = userData.userAvatar.value !== ''

      inputsAreValidTemp = inputsAreValidTemp && avatarIsValid

      setInputsAreValid(inputsAreValidTemp)
        ; (avatarIsValid ? removeErrorAttribute : setErrorAttribute)(
          getClosestFormField(dropZoneRef.current)
        )

      setFormSent(true)
    }, 500)
  }

  function handleButtonBounceEnd() {
    removeBounceClass()
  }

  function setUserAvatar(avatar) {
    dispatchUserData({ type: 'set', who: 'userAvatar', value: avatar })
  }

  const dropZoneProps = {
    setUserAvatar,
    userAvatar: userData.userAvatar.value
  }

  return (
    <form
      className={`form pos-relative${formSent && inputsAreValid ? ' form--hide' : ''}`}
      aria-hidden={formSent && inputsAreValid}
      onTransitionEnd={handleFormTransitionEnd}
      onSubmit={preventDefault}
      noValidate
      ref={formRef}>
      <div className='form__field'>
        <div className='form__label'>Upload Avatar</div>
        <DropZone {...dropZoneProps} ref={dropZoneRef} />
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='full-name'>
          Full Name
        </label>
        <input
          autoComplete='off'
          onChange={handleInputsChange}
          className='form__input'
          type='text'
          name='full-name'
          id='full-name'
        />
        <FormFieldError>{userData['full-name'].error}</FormFieldError>
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='email'>
          Email Address
        </label>
        <input
          autoComplete='off'
          onChange={handleInputsChange}
          className='form__input'
          type='email'
          name='email'
          id='email'
          placeholder='example@email.com'
        />
        <FormFieldError>{userData.email.error}</FormFieldError>
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='github'>
          GitHub Username
        </label>
        <input
          autoComplete='off'
          onChange={handleInputsChange}
          className={`form__input${validatingGithubUser ? ' form__input--validating-user' : ''}${isGithubUserValid ? ' form__input--valid-user' : ''}`}
          type='text'
          name='github-name'
          id='github'
          placeholder='@yourusername'
        />
        <FormFieldError>{userData['github-name'].error}</FormFieldError>
      </div>

      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        onAnimationEnd={handleButtonBounceEnd}
        onTouchStart={addBounceClass}
        onContextMenu={preventDefault}
        type='submit'
        className='form__button'>
        Generate My Ticket
      </button>
    </form>
  )
}

function FormFieldError({ children }) {
  return (
    <span className='form__field__error' aria-live='polite'>
      {/* always show the icon on red color */}
      <ErrorIcon error={true} />
      {children}
    </span>
  )
}

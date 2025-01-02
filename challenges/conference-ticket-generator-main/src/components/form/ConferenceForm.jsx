import { useReducer, useRef } from 'react'
import './ConferenceForm.css'
import DropZone from '../dropzone/DropZone'
import userDataReducer from '../../reducers/userDataReducer'

/* TODO - Implement use of the ticketRef to make the 
 * user auto-scroll when the form data is valid */
export default function ConferenceForm({ showTicket, sendTicketData, sendUserAvatar, ticketRef }) {
  const formRef = useRef(null)
  const buttonAnimationClass = 'form__button--bounce'
  const buttonClickSound = new Audio(`${import.meta.env.BASE_URL}assets/sounds/button-click.mp3`)
  const formErrorSound = new Audio(`${import.meta.env.BASE_URL}assets/sounds/form-error.mp3`)

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
    }
  })

  function handleInputError(input, error = false) {
    if (error) return input.setAttribute('data-error', '')

    input.removeAttribute('data-error')
  }

  function handleErrorMessage(who, msg = '') {
    dispatchUserData({ type: 'error', who, msg })
    return !msg
  }

  function preventDefault(e) {
    e.preventDefault()
  }

  const validateFuncs = {
    'full-name': {
      validate: validateUserName,
    },

    'email': {
      validate: validateUserEmail,
    },

    'github-name': {
      validate: validateUserGithubName,
    },
  }

  function validateUserName(name) {
    const trimmed = name.trim()
    const messages = {
      long: 'Name is too long',
      short: 'Name is too short',
      empty: 'Name can\'t be empty',
      chars: 'Name must not contain numbers or signs'
    }

    const errorMessage = (() => {
      if (trimmed.length === 0) return 'empty'
      if (trimmed.length >= 64) return 'long'
      if (trimmed.length < 3) return 'short'
      if (trimmed.match(/[0-9!*\(\)+%\$\^\{\}\\\:\;\/\,\<\>"@]/)?.[0]) return 'chars'
    })()

    return handleErrorMessage('full-name', messages[errorMessage])
  }

  function validateUserEmail(email) {
    const trimmed = email.trim()
    const messages = {
      match: 'Email must match username@domain.tld',
      empty: 'Email can\'t be empty'
    }

    const errorMessage = (() => {
      if (trimmed.length === 0) return 'empty'
      if (!trimmed.match(/^.{2,}@.{2,}\..{2,3}/)) return 'match'
    })()

    return handleErrorMessage('email', messages[errorMessage])
  }

  function validateUserGithubName(githubUser) {
    const trimmed = githubUser.trim()
    const messages = {
      empty: 'Github user can\'t be empty',
      short: 'Github user is too short',
      match: 'Github user must match @username'
    }

    const errorMessage = (() => {
      if (trimmed.length === 0) return 'empty'
      if (trimmed.length < 2) return 'short'
      if (!trimmed.match(/^@.+/)) return 'match'
    })()

    return handleErrorMessage('github-name', messages[errorMessage])
  }

  function handleInputsChange(e) {
    const inputName = e.target.name
    const inputValue = e.target.value

    if (validateFuncs[inputName].validate(inputValue)) {
      handleInputError(e.target)
      dispatchUserData({ type: 'set', who: inputName, value: inputValue })
      handleErrorMessage(inputName, '')
      return
    }

    handleInputError(e.target, true)
  }

  function handleFormTransitionEnd(e) {
    // prevent sending the data if the transition event isn't from the Form
    if (e.target !== formRef.current) return

    sendTicketData({
      fullName: userData['full-name'].value,
      email: userData.email.value,
      github: userData['github-name'].value,
    })

    showTicket()
  }

  function handleButtonClick() {
    const inputs = formRef.current.querySelectorAll('input:not([type="file"])')
    let inputsAreValid = true

    // run inputs validate validateFuncs
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const inputValidateFunc = validateFuncs[input.name]

      if (!inputValidateFunc.validate(input.value)) {
        handleInputError(input, true)
        inputsAreValid = false
      }
    }

    if (!inputsAreValid) {
      formRef.current.setAttribute('data-error', '')
      return formErrorSound.play()
    }

    formRef.current.removeAttribute('data-error')
    buttonClickSound.play()
  }

  function makeButtonBounce(e) {
    if (e.target.classList.contains(buttonAnimationClass)) return

    e.target.classList.add(buttonAnimationClass)

    // maybe use the animationEnd event instead of a setTimeout
    setTimeout(() => {
      e.target.classList.remove(buttonAnimationClass)

      if (formRef.current.getAttribute('data-error') === '') return

      formRef.current.classList.add('form--hide')
      ticketRef.current.scrollIntoView()
      buttonClickSound.play()

    }, 300);
  }

  return (
    <form
      className='form'
      onTransitionEnd={handleFormTransitionEnd}
      onSubmit={preventDefault}
      noValidate
      ref={formRef}>

      <div className='form__field'>
        <label className='form__label' htmlFor='avatar'>Upload Avatar</label>
        <DropZone sendUserAvatar={sendUserAvatar} />
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='full-name'>Full Name</label>
        <input
          onChange={handleInputsChange}
          className='form__input'
          type='text'
          name='full-name'
          id='full-name' />
        <span className='form__field__error' aria-live='polite'>{userData['full-name'].error}</span>
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='email'>Email Address</label>
        <input
          onChange={handleInputsChange}
          className='form__input'
          type='email'
          name='email'
          id='email'
          placeholder='example@email.com' />
        <span className='form__field__error' aria-live='polite'>{userData.email.error}</span>
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='github'>GitHub Username</label>
        <input
          onChange={handleInputsChange}
          className='form__input'
          type='text'
          name='github-name'
          id='github'
          placeholder='@yourusername' />
        <span className='form__field__error' aria-live='polite'>{userData['github-name'].error}</span>
      </div>

      <button
        onClick={handleButtonClick}
        onTouchStart={makeButtonBounce}
        onPointerUp={makeButtonBounce}
        onContextMenu={preventDefault}
        type='submit'
        className='form__button'>
        Generate My Ticket
      </button>
    </form>
  )
}

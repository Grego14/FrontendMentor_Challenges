import { useReducer, useRef, useState } from 'react'
import './ConferenceForm.css'
import DropZone from '../dropzone/DropZone'
import userDataReducer from '../../reducers/userDataReducer'
import {
  preventDefault, howManyChars, setErrorAttribute,
  removeErrorAttribute, getClosest, BASE_URL
} from '../../utils/utils'
import useBounce from '../../hooks/useBounce'
import ErrorIcon from '../erroricon/ErrorIcon'

const getClosestFormField = (target) => getClosest.call(null, target, '.form__field')

export default function ConferenceForm({ showTicket, sendTicketData,
  setUserAvatar, userAvatar, dropZoneRef }) {
  const [userData, dispatchUserData] = useReducer(userDataReducer, {}, userDataInitializer)

  const formRef = useRef(null)
  const buttonRef = useRef(null)

  const [audioPlaying, setAudioPlaying] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [inputsAreValid, setInputsAreValid] = useState(false)

  const [imageUploaded, setImageUploaded] = useState(false)
  const [addBounceClass, removeBounceClass] = useBounce(buttonRef)

  function setInputErrorMsg(inputName, msg) {
    dispatchUserData({ type: 'error', who: inputName, msg })
  }

  function playSound(sound) {
    if (audioPlaying) return

    sound.addEventListener('ended', () => {
      setAudioPlaying(false)
    }, { once: true })

    sound.play()
    setAudioPlaying(true)
  }

  // choose the appropriate validation function and send an object 
  // with the validation state and an error message that may be empty
  function runValidationFunc(inputName, inputValue) {
    const validateFuncs = {
      'full-name': validateUserName,
      'email': validateUserEmail,
      'github-name': validateUserGithubName,
    }

    const validated = validateFuncs[inputName](inputValue)

    // if validated is true, it means that an error message exists
    return { msg: !validated ? '' : validated, state: !validated ? true : false }
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
      const match = trimmed.match(/[0-9!*\(\)+%\$\^\{\}\\\:\;\/\,\<\>"@_]/)?.[0]

      if (trimmed.length === 0) return 'empty'
      if (trimmed.length >= 64) return 'long'

      if (trimmed.length < 3 && match) return 'chars'
      if (trimmed.length < 3) return 'short'

      if (match) return 'chars'
    })()

    return messages[errorMessage]
  }

  function validateUserEmail(email) {
    const trimmed = email.trim()
    const messages = {
      match: 'Email must match username@domain.tld',
      empty: 'Email can\'t be empty',
      usernameShort: 'Username is too short',
      domainShort: 'Domain is too short',
      tldShort: 'TLD is too short'
    }

    const splittedMail = email.split(/[@\.]/)
    /* 
     * splittedMail[0] = username
     * splittedMail[1] = domain || null
     * splittedMail[2] = tld || null
    */

    const errorMessage = (() => {
      const howManyAts = howManyChars(trimmed, '@')

      // order matters
      if (trimmed.length === 0) return 'empty'

      if (splittedMail.length > 3) return 'match'

      if (splittedMail[0].length < 2) return 'usernameShort'

      if (!splittedMail[1]) return 'match'
      if (splittedMail[1].length < 2) return 'domainShort'

      if (!splittedMail[2]) return 'match'
      if (splittedMail[2].length < 2) return 'tldShort'

      if (howManyAts > 1 || howManyAts < 1) return 'match'
    })()

    return messages[errorMessage]
  }

  function validateUserGithubName(githubUser) {
    const trimmed = githubUser.trim()
    const messages = {
      empty: 'Github user can\'t be empty',
      short: 'Github user is too short',
      match: 'Github user must match @username'
    }

    const errorMessage = (() => {
      const howManyAts = howManyChars(trimmed, '@')

      if (trimmed.length === 0) return 'empty'

      // In this case...[0] will be the @
      if (trimmed.split(/[@]/)[0] !== '') return 'match'

      // Github usersnames can be 1 char so we test for @ + char
      if (trimmed.length < 2) return 'short'

      if (howManyAts > 1 || howManyAts < 1) return 'match'
    })()

    return messages[errorMessage]
  }

  function handleInputsChange(e) {
    const inputName = e.target.name
    const closestField = getClosestFormField(e.target)

    setFormSent(false)
    setInputErrorMsg(inputName, '')
    removeErrorAttribute(closestField)
  }

  function handleFormTransitionEnd(e) {
    const form = formRef.current
    // prevent sending the data if the transition event isn't from the Form
    if (e.target !== form) return

    sendTicketData({
      fullName: userData['full-name'].value,
      email: userData.email.value,
      github: userData['github-name'].value,
    })

    showTicket()

    form.style.display = 'hidden'
  }

  function handleButtonClick() {
    const form = formRef.current
    const inputs = form.querySelectorAll('input:not([type="file"])')
    let inputsAreValidTemp = true

    addBounceClass()

    // run validationfunc on each input
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const closestField = getClosestFormField(input)
      const inputValidation = runValidationFunc(input.name, input.value)

      setInputErrorMsg(input.name, inputValidation.msg);

      (inputValidation.state
        ? removeErrorAttribute
        : setErrorAttribute)(closestField)

      dispatchUserData({ type: 'set', who: input.name, value: input.value })

      // check for inputsAreValidTemp so we avoid updating it to true if there's
      // was already an invalid input, otherwise if an input is valid it will
      // update it to true and the formErrorSound will not be played.
      if (!inputValidation.state || inputsAreValidTemp) {
        inputsAreValidTemp = inputValidation.state
      }
    }

    inputsAreValidTemp = inputsAreValidTemp && userAvatar ? true : false;

    setInputsAreValid(inputsAreValidTemp);
    (userAvatar ? removeErrorAttribute : setErrorAttribute)(getClosestFormField(dropZoneRef.current))

    setFormSent(true)
  }

  function handleButtonBounceEnd() {
    removeBounceClass()

    playSound(
      new Audio(`${BASE_URL}${inputsAreValid
        ? 'assets/sounds/button-click.mp3'
        : 'assets/sounds/form-error.mp3'}`)
    )
  }

  const dropZoneProps = {
    setUserAvatar,
    userAvatar,
    imageUploaded,
    setImageUploaded
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
        <label className='form__label' htmlFor='avatar'>Upload Avatar</label>
        <DropZone {...dropZoneProps} ref={dropZoneRef} />
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='full-name'>Full Name</label>
        <input
          autoComplete='off'
          onChange={handleInputsChange}
          className='form__input'
          type='text'
          name='full-name'
          id='full-name' />
        <FormFieldError>{userData['full-name'].error}</FormFieldError>
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='email'>Email Address</label>
        <input
          autoComplete='off'
          onChange={handleInputsChange}
          className='form__input'
          type='email'
          name='email'
          id='email'
          placeholder='example@email.com' />
        <FormFieldError>{userData.email.error}</FormFieldError>
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='github'>GitHub Username</label>
        <input
          autoComplete='off'
          onChange={handleInputsChange}
          className='form__input'
          type='text'
          name='github-name'
          id='github'
          placeholder='@yourusername' />
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

function userDataInitializer() {
  return {
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
  }
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

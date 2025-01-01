import { useRef, useState, useReducer } from 'react'
import DropZone from '../dropzone/DropZone.jsx'
import Ticket from '../ticket/Ticket.jsx'
import './App.css'

const base_url = import.meta.env.BASE_URL

function ticketReducer(state, action) {
  return action.data || state
}

export default function App() {
  const [ticketVisible, setTicketVisible] = useState(false)
  const [ticketData, dispatch] = useReducer(ticketReducer, {})
  const [userAvatar, setUserAvatar] = useState('')

  function showTicket() {
    setTicketVisible(true)
  }

  function sendTicketData(data) {
    dispatch({ data })
  }

  function sendUserAvatar(src) {
    setUserAvatar(src)
  }

  const ticketProps = {
    ticketVisible,
    userAvatar,
    fullName: ticketData.fullName,
    githubUser: ticketData.github,
  }

  const conferenceFormProps = {
    showTicket,
    sendTicketData,
    sendUserAvatar
  }

  return (
    <>
      <Header />

      <div className='background-images' style={{ minHeight: document.documentElement.offsetHeight }}>

        <img
          className='background-image background-image__circle-top'
          src={`${base_url}assets/images/pattern-circle.svg`}
          alt=''
          aria-hidden='true'
          width='100'
          height='100' />

        <img
          className='background-image background-image__line-top'
          src={`${base_url}assets/images/pattern-squiggly-line-top.svg`}
          alt=''
          aria-hidden='true'
          width='100'
          height='100'
        />

        <img
          className='background-image background-image__circle-bottom'
          src={`${base_url}assets/images/pattern-circle.svg`}
          alt=''
          aria-hidden='true'
          width='120'
          height='120' />

        <img
          className='background-image background-image__line-bottom'
          src={`${base_url}assets/images/pattern-squiggly-line-bottom.svg`}
          alt=''
          aria-hidden='true'
          width='300'
          height='150' />
      </div>


      <img className='background-image background-image__pattern-lines'
        src={`${base_url}assets/images/pattern-lines.svg`} alt='' aria-hidden='true' />

      <main aria-live='polite' aria-atomic='true'>
        <h1 className='main-title'>
          {!ticketVisible
            ? 'Your Journey to Coding Conf 2025 Starts Here'
            : (
              <>
                Congrats, <span className='main-title__fullName'>
                  {ticketData.fullName}
                </span>! Your ticket is ready.
              </>
            )}
        </h1>
        <p className='main-text'>{
          !ticketVisible
            ? 'Secure your spot at next year\'s biggest coding conference.'
            : (
              <>
                We've emailed your ticket to
                <span className='main-text__email'>
                  {' '}{ticketData.email}
                </span> and will send
                updates in the run up to the event.
              </>
            )
        }</p>

        <ConferenceForm {...conferenceFormProps} />

        {ticketVisible && <Ticket {...ticketProps} />}
      </main>

      <picture>
        <source srcSet={`${base_url}assets/images/background-mobile.png`} media='(max-width: 480px)'></source>
        <source srcSet={`${base_url}assets/images/background-tablet.png`} media='(min-width: 481px) and (max-width: 1023px)'></source>
        <source srcSet={`${base_url}assets/images/background-desktop.png`} media='(min-width: 1024px)'></source>
        <img className='background-image background-image__main'
          src={`${base_url}assets/images/background-mobile.png`}
          alt=''
          aria-hidden='true'
          draggable='false'
          fetchpriority='high'
        />
      </picture>
    </>
  )
}

function ConferenceForm({ showTicket, sendTicketData, sendUserAvatar }) {
  const formRef = useRef(null)
  const buttonAnimationClass = 'form__button--bounce'
  const sound = new Audio(`${base_url}assets/sounds/button-click.mp3`)

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userGithubName, setUserGithubName] = useState('')

  function handleInputsChange(e) {
    const fns = { 'full-name': setUserName, email: setUserEmail, 'github-name': setUserGithubName }
    const inputName = e.target.name
    const inputValue = e.target.value

    fns[inputName]?.(inputValue)
  }

  function handleFormTransitionEnd(e) {
    e.target.classList.add('form--remove')

    sendTicketData({
      fullName: userName,
      email: userEmail,
      github: userGithubName
    })

    showTicket()
  }

  function preventDefault(e) {
    e.preventDefault()
  }

  function handleButtonClick() {
    sound.play()

    if (formRef.current) {
      formRef.current.classList.add('form--hide')
    }
  }

  function makeButtonBounce(e) {
    if (e.target.classList.contains(buttonAnimationClass)) return

    e.target.classList.add(buttonAnimationClass)

    setTimeout(() => {
      e.target.classList.remove(buttonAnimationClass)
      sound.play()
    }, 300);
  }

  return (
    <form
      className='form'
      onTransitionEnd={handleFormTransitionEnd}
      onSubmit={preventDefault}
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
      </div>

      <div className='form__field'>
        <label className='form__label' htmlFor='email'>Email Address</label>
        <input
          onChange={handleInputsChange}
          className='form__input'
          type='text'
          name='email'
          id='email'
          placeholder='example@email.com' />
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

function Header() {
  return (
    <header className='header'>
      <img src={`${base_url}assets/images/logo-full.svg`} alt='Coding Conf Logo' />
    </header>
  )
}

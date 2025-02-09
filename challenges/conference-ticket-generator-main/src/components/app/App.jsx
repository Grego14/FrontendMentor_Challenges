import { useState, useReducer, useRef, lazy, Suspense } from 'react'
import ConferenceForm from '../form/ConferenceForm'
import DecorationIcons from './DecorationIcons'
import ticketReducer from '../../reducers/ticketReducer'
import './App.css'
import { substring, BASE_URL } from '../../utils/utils'
import useBounce from '../../hooks/useBounce'

const Ticket = lazy(() => import('../ticket/Ticket'))

export default function App() {
  const dropZoneRef = useRef(null)
  const ticketRef = useRef(null)

  const [ticketVisible, setTicketVisible] = useState(false)
  const [ticketData, dispatch] = useReducer(ticketReducer, {})
  const [userAvatar, setUserAvatar] = useState('')
  const [ticketID, setTicketID] = useState(null)

  function showTicket() {
    setTicketVisible(true)
  }

  function sendTicketData(data) {
    dispatch({ data })
  }

  const layoutProps = {
    dropZoneRef,
    fullName: ticketData.fullName,
    githubUser: ticketData.github,
    email: ticketData.email,
    userAvatar,

    ticket: {
      ticketVisible,
      ticketRef,
      ticketID,
      setTicketID
    },

    conferenceForm: {
      showTicket,
      sendTicketData,
      setUserAvatar
    },
  }

  return (
    <>
      <Header />

      <DecorationIcons />

      <Layout {...layoutProps} />

      <img
        className='background-image background-image__pattern-lines'
        src={`${BASE_URL}assets/images/pattern-lines.svg`}
        alt=''
        aria-hidden='true'
        fetchpriority='low' />

      <picture>
        <source srcSet={`${BASE_URL}assets/images/background-mobile.png`} media='(max-width: 480px)'></source>
        <source srcSet={`${BASE_URL}assets/images/background-tablet.png`} media='(min-width: 481px) and (max-width: 1023px)'></source>
        <source srcSet={`${BASE_URL}assets/images/background-desktop.png`} media='(min-width: 1024px)'></source>
        <img className='background-image background-image__main'
          src={`${BASE_URL}assets/images/background-mobile.png`}
          alt=''
          aria-hidden='true'
          draggable='false'
          fetchpriority='high'
        />
      </picture>
    </>
  )
}

function Layout(props) {
  const { conferenceForm, dropZoneRef, fullName, githubUser,
    email, userAvatar, ticket } = props

  const buttonRef = useRef(null)
  const [addBounceClass, removeBounceClass] = useBounce(buttonRef)

  function handleTicketBtnClick() {
    addBounceClass()

    const options = {
      backgroundColor: 'hsl(248, 70%, 10%)',
      logging: false
    }

    import('html2canvas').then(mod => {
      mod.default(ticket.ticketRef.current, options).then((canvas) => {
        const imagenURL = canvas.toDataURL()
        const link = document.createElement('a')
        link.href = imagenURL
        link.download = `ticket_${ticket.ticketID}`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    })
  }

  function handleTicketBtnTransition() {
    removeBounceClass()

    new Audio(`${BASE_URL}assets/sounds/button-click.mp3`).play()
  }

  const formProps = {
    ...conferenceForm,
    dropZoneRef,
    ticketVisible: ticket.ticketVisible,
    userAvatar
  }

  const mainTextProps = {
    fullName,
    githubUser,
    email,
    ticketVisible: ticket.ticketVisible
  }

  const ticketProps = {
    ...mainTextProps,
    ticketID: ticket.ticketID,
    setTicketID: ticket.setTicketID,
    userAvatar,
  }

  return (
    <main className='pos-relative' aria-live='polite' aria-atomic='true'>

      <MainText {...mainTextProps} />

      <ConferenceForm {...formProps} />

      <Suspense>
        {ticket.ticketVisible && (
          <Ticket {...ticketProps} ref={ticket.ticketRef} />
        )}
      </Suspense>

      <button
        ref={buttonRef}
        className={`save-ticket-btn${ticket.ticketVisible ? ' save-ticket-btn--show' : ''}`}
        aria-hidden={!ticket.ticketVisible}
        onClick={handleTicketBtnClick}
        onAnimationEnd={handleTicketBtnTransition}>
        Click to save your ticket!
      </button>
    </main>
  )
}

function MainText({ ticketVisible, fullName, email }) {
  return (
    <>
      <h1 className={`main-title${ticketVisible ? ' main-title--ticket' : ''}`}>
        {!ticketVisible
          ? 'Your Journey to Coding Conf 2025 Starts Here'
          : (
            <>
              Congrats, <span className='main-title__fullName'>
                {substring(fullName, 16)}
              </span>! Your ticket is ready.
            </>
          )}
      </h1>

      <p className={`main-text${ticketVisible ? ' main-text--ticket' : ''}`}>{
        !ticketVisible
          ? 'Secure your spot at next year\'s biggest coding conference.'
          : (
            <>
              We've emailed your ticket to{' '}
              <span className='main-text__email'>
                {substring(email, 18)}</span> and will send
              updates in the run up to the event.
            </>
          )
      }</p>
    </>
  )
}

function Header() {
  return (
    <header className='header'>
      <img
        src={`${BASE_URL}assets/images/logo-full.svg`}
        className='header-image'
        alt='Coding Conf Logo'
        draggable={false}
        width='200'
        height='30' />
    </header>
  )
}

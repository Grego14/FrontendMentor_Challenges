import { useState, useReducer } from 'react'
import Ticket from '../ticket/Ticket'
import ConferenceForm from '../form/ConferenceForm'
import DecorationIcons from './DecorationIcons'
import ticketReducer from '../../reducers/ticketReducer'
import './App.css'

const base_url = import.meta.env.BASE_URL

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

  const layoutProps = {

    conferenceForm: {
      showTicket,
      sendTicketData,
      sendUserAvatar
    },

    mainText: {
      ticketVisible,
      fullName: ticketData.fullName,
      githubUser: ticketData.github,
    },

    ticket() {
      return {
        ...this.mainText,
        userAvatar,
      }
    }
  }

  return (
    <>
      <Header />

      <DecorationIcons />

      <Layout {...layoutProps} />

      <img className='background-image background-image__pattern-lines'
        src={`${base_url}assets/images/pattern-lines.svg`} alt='' aria-hidden='true' />

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

function Layout(props) {
  return (
    <main aria-live='polite' aria-atomic='true'>

      <MainText {...props.mainText} />

      <ConferenceForm {...props.conferenceForm} />

      <Ticket {...props.ticket()} />
    </main>
  )
}

function MainText({ ticketVisible, fullName, email }) {
  return (
    <>
      <h1 className='main-title'>
        {!ticketVisible
          ? 'Your Journey to Coding Conf 2025 Starts Here'
          : (
            <>
              Congrats, <span className='main-title__fullName'>
                {fullName}
              </span>! Your ticket is ready.
            </>
          )}
      </h1>

      <p className='main-text'>{
        !ticketVisible
          ? 'Secure your spot at next year\'s biggest coding conference.'
          : (
            <>
              We've emailed your ticket to{' '}
              <span className='main-text__email'>{email}</span> and will send
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
      <img src={`${base_url}assets/images/logo-full.svg`} alt='Coding Conf Logo' />
    </header>
  )
}

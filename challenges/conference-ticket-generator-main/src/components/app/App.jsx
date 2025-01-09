import { useState, useReducer, useRef } from 'react'
import Ticket from '../ticket/Ticket'
import ConferenceForm from '../form/ConferenceForm'
import DecorationIcons from './DecorationIcons'
import ticketReducer from '../../reducers/ticketReducer'
import './App.css'
import { substring, BASE_URL } from '../../utils/utils'

export default function App() {
  const dropZoneRef = useRef(null)

  const [ticketVisible, setTicketVisible] = useState(false)
  const [ticketData, dispatch] = useReducer(ticketReducer, {})
  const [userAvatar, setUserAvatar] = useState('')

  function showTicket() {
    setTicketVisible(true)
  }

  function sendTicketData(data) {
    dispatch({ data })
  }

  const layoutProps = {
    dropZoneRef,
    ticketVisible,
    fullName: ticketData.fullName,
    githubUser: ticketData.github,
    email: ticketData.email,
    userAvatar,

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

      <img className='background-image background-image__pattern-lines'
        src={`${BASE_URL}assets/images/pattern-lines.svg`} alt='' aria-hidden='true' />

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
    email, userAvatar, ticketVisible } = props

  const formProps = {
    ...conferenceForm,
    dropZoneRef,
    ticketVisible,
    userAvatar
  }

  const mainTextProps = {
    fullName,
    githubUser,
    email,
    ticketVisible
  }

  const ticketProps = {
    ...mainTextProps,
    userAvatar,
  }

  return (
    <main className='pos-relative' aria-live='polite' aria-atomic='true'>

      <MainText {...mainTextProps} />

      <ConferenceForm {...formProps} />

      <Ticket {...ticketProps} />
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
      <img src={`${BASE_URL}assets/images/logo-full.svg`} alt='Coding Conf Logo' />
    </header>
  )
}

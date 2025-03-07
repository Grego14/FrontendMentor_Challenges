import { forwardRef, useEffect } from 'react'
import { substring, BASE_URL } from '../../utils/utils'
import './Ticket.css'

const Ticket = forwardRef((props, ref) => {
  const {
    ticketVisible,
    fullName,
    githubUser,
    userAvatar,
    setTicketID,
    ticketID
  } = props

  useEffect(() => {
    setTicketID(Math.floor(Math.random() * 10000) + 1)
  }, [setTicketID])

  return (
    <div
      ref={ref}
      className={`ticket pos-absolute${ticketVisible ? ' ticket--show' : ''}`}
      aria-hidden={!ticketVisible}>
      <div className='ticket__content-left'>
        <div>
          <img
            className='ticket__logo'
            src={`${BASE_URL}assets/images/logo-mark.svg`}
            alt=''
            aria-hidden='true'
            width='40'
            height='40'
          />
          <div className='data__top__footer'>
            <h2 className='ticket__title'>Coding Conf</h2>
            <span className='ticket__date'>
              <time dateTime='2025-01-31'>Jan 31, 2025</time> / Austin, TX
            </span>
          </div>
        </div>

        <div>
          <img
            className='ticket__avatar'
            src={userAvatar}
            alt={`${fullName} avatar picture`}
            aria-hidden='true'
            width='50'
            height='50'
          />

          <div className='data__bottom__footer'>
            <h3 className='ticket__full-name'>{substring(fullName, 10)}</h3>
            <a
              className='github-link'
              href={`https://github.com/${githubUser.split('@')[1]}`}
              target='_blank'
              rel='noreferrer'
              aria-label={`${fullName} github profile`}>
              <img
                className='github-link__icon'
                src={`${BASE_URL}assets/images/icon-github.svg`}
                alt=''
                width='20'
                height='20'
              />
              <span className='github-link__name'>
                {substring(githubUser, 12)}
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className='ticket__content-right'>
        <div className='ticket__id'>
          #{ticketID?.toString().padStart(5, '0')}
        </div>
      </div>
    </div>
  )
})

export default Ticket

const base_url = import.meta.env.BASE_URL
import './Ticket.css'

export default function Ticket({
  ticketVisible,
  fullName,
  githubUser,
  userAvatar }) {

  const ticketID = Math.floor(Math.random() * 10000) + 1

  return (
    <div className={`ticket${ticketVisible ? ' ticket--show' : ''}`}>
      <div className='ticket__content-left'>

        <div className='ticket__data'>
          <div className='ticket__data__top'>
            <img
              className='ticket__logo'
              src={`${base_url}assets/images/logo-mark.svg`}
              alt=''
              aria-hidden='true'
              width='40'
              height='40' />
            <div className='data__top__footer'>
              <h2 className='ticket__title'>Coding Conf</h2>
              <span className='ticket__date'>Jan 31, 2025 / Austin, TX</span>
            </div>
          </div>

          <div className='ticket__data__bottom'>
            <img
              className='ticket__avatar'
              src={userAvatar}
              alt={`${fullName} avatar`}
              aria-hidden='true'
              width='50'
              height='50' />

            <div className='data__bottom__footer'>
              <h3 className='ticket__full-name'>{fullName}</h3>
              <a
                className='github-link'
                href={`https://github.com/${githubUser.split('@')[1]}`}
                target='_blank'
                aria-label={`${fullName} github profile`} >
                <img
                  className='github-link__icon'
                  src={`${base_url}assets/images/icon-github.svg`}
                  alt=''
                  width='20'
                  height='20' />
                <span className='github-link__name'>{githubUser}</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className='ticket__content-right'>
        <div className='ticket__id'>#{ticketID.toString().padStart(5, '0')}</div>
      </div>

      <img
        className='ticket-background'
        src={`${base_url}assets/images/pattern-ticket.svg`}
        alt=''
        width=''
        height=''
        aria-hidden='true' />
    </div>
  )
}

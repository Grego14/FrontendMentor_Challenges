export default function ErrorIcon({ error }) {
  const svgColor = error
    ? 'var(--color-error-dark)'
    : '#D1D0D5'

  return (
    <svg className='error-icon'
      style={{
        marginRight: '.3rem',
        transition: 'stroke var(--transition-fast) ease-in-out, fill var(--transition-fast) ease-in-out'
      }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden='true'
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16">
      <path stroke={svgColor} strokeLinecap="round"
        strokeLinejoin="round" d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z" />
      <path fill={svgColor} d="M8.004 10.462V7.596ZM8 5.57v-.042Z" />
      <path stroke={svgColor} strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.004 10.462V7.596M8 5.569v-.042" />
    </svg>
  )
}

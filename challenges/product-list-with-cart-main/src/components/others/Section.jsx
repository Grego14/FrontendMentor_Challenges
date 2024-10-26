export default function Section({ isFor, children, props }) {
  return (
    <section
      className={`app-section${isFor ? ` app-section--${isFor}` : ''}`}
      {...props}>
      {children}
    </section>
  )
}

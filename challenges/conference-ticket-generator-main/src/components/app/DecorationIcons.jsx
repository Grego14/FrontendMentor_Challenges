const base_url = import.meta.env.BASE_URL

export default function DecorationIcons() {
  return (
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
  )
}

const d = document
const form = d.getElementById('form')

const errorMessages = {
  required: 'This field is required',
  query: 'Please select a query type',
  email: 'Please enter a valid email address',
  consent: 'To submit this form, please consent to being contacted',
  pattern: 'Please enter a valid',
  short: 'Value is too short',
  long: 'Value is too long'
}

const isTablet = window.matchMedia('(min-width: 40rem)')

function handleIsTablet(e){
  if(e?.target?.matches || e.matches) return d.getElementById('message').setAttribute('rows', '4')

  d.getElementById('message').setAttribute('rows', '8')
}

isTablet.addEventListener('change', handleIsTablet)

handleIsTablet(isTablet)

// elements with data-input are the only one that will be validated
const globalInputs = [...form.elements].filter(el => el.dataset.input)
const notificationElement = d.getElementById('notification')

d.addEventListener('DOMContentLoaded', e => {

  form.addEventListener('submit', handleSubmitForm)

  form.addEventListener('change', e => {
    e.target.setAttribute('aria-checked', e.target.checked)
  })

  d.addEventListener('click', e => {
    if (e.target.matches('#submit-btn ')) handleSubmitForm(e)
  })
})

let notificationTimeout

function handleNotification(notification){
  if(!notification.getAttribute('aria-hidden')) return

  notification.removeAttribute('aria-hidden')

  form.reset()

  notificationTimeout = setTimeout(() => {
    notification.setAttribute('aria-hidden', 'true')
  }, 6000);
}

function handleNotificationError(notification){
  notification.setAttribute('aria-hidden', 'true')

  clearTimeout(notificationTimeout)
}

function handleSubmitForm(e) {
  e.preventDefault()

  globalInputs.filter(input => input.type === 'email' || input.type === 'text').every(input => input.value = input.value.trim())

  const check = checkAllInputs(globalInputs)

  const validEls = []

  if(check){

    for (const [key, value] of check) {
      if(value) validEls.push(key)
    }

    validEls.length === globalInputs.length 
      ? handleNotification(notificationElement) 
      : handleNotificationError(notificationElement)
  }
}

function getError(validity) {
  if (validity === 'valueMissing') return errorMessages.required
  if (validity === 'tooLong') return errorMessages.long
  if (validity === 'tooShort') return errorMessages.short
  if (validity === 'patternMismatch') return errorMessages.pattern
}

function getValidation(validity) {
  if (validity.valueMissing) return { state: false, val: 'valueMissing' }
  if (validity.tooLong) return { state: false, val: 'tooLong' }
  if (validity.tooShort) return { state: false, val: 'tooShort' }
  if (validity.typeMismatch) return { state: false, val: 'typeMismatch' }
  if (validity.patternMismatch) return { state: false, val: 'patternMismatch' }

  return { state: true, val: '' }
}

function checkBasicValidations(input) {
  return getValidation(input.validity)
}

function validateEmailInput(input) {
  const emailUser = input.value.split('@')[0]

  if(emailUser && emailUser.length < 6) return setInputError('email', 'Email username is too short')

  const specials = noSpecialValidation(input)

  if(specials.val === 'typeMismatch') return setInputError('email', errorMessages.email)
}

function validateRadios(...radios) {
  const checked = radios.find(radio => radio.checked)

  if (!checked) return setInputError('query', errorMessages.query)

  setInputError('query', '', true)
}

function noSpecialValidation(input) {
  const basics = checkBasicValidations(input)

  if(!basics.state && basics.val === 'patternMismatch') 
  return setInputError(input.dataset.input, `${errorMessages.pattern} ${input.name.split('-').join(' ')}`)

  if(!basics.state) {
    setInputError(input.dataset.input, getError(getValidation(input.validity).val))
    return basics
  }

  setInputError(input.dataset.input, '', true)
  return basics
}

function validateCheckbox(input) {
  return !input.checked
    ? setInputError('consent', errorMessages.consent)
    : setInputError('consent', '', true)
}

const validations = new Map()

validations.set('email', { validation: validateEmailInput })
validations.set('name', { validation: noSpecialValidation })
validations.set('last-name', { validation: noSpecialValidation })
validations.set('query', { validation: validateRadios })
validations.set('textarea', { validation: noSpecialValidation })
validations.set('consent', { validation: validateCheckbox })

function checkAllInputs(inputs) {
  let validInputs = new Map()

  for (const input of inputs) {

    if (input.name === 'query-item' && !inputs.filter(el => el.name === 'query-item').find(el => el.checked)) {
      validations.get('query').validation(...inputs.filter(el => el.name === 'query-item'))
      continue
    }

    if(input.name !== 'query-item') validations.get(input.dataset.input).validation(input)

    if(input.validity.valid) validInputs.set(input.dataset.input, true)
  }

  return validInputs
}

function getErrorEl(el) {
  return el.querySelector('.form__error') || false
}

function getElement(el, data) {
  if (data) return d.querySelector(`[data-${data}='${el}']`)

  return (el.startsWith('#'))
    ? d.getElementById(el.slice(1))
    : d.querySelector(el)
}

// input => data-container='$input'
function setInputError(input, error, clear = false) {
  let inputContainer = getElement(input, 'container')
  let errorEl = getErrorEl(inputContainer)

  if (clear) {
    errorEl.textContent = ''

    inputContainer.removeAttribute('data-error')
    errorEl.setAttribute('aria-hidden', 'true')

    return
  }

  errorEl.textContent = error

  inputContainer.setAttribute('data-error', '')
  errorEl.removeAttribute('aria-hidden')
}

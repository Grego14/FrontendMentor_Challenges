import './lib/leaflet.js'

const d = document
const L = window.L
const errorNotification = d.getElementById('error-msg')
let map;

let userData = {}

async function getData(request, outputObject) {
  return await fetch(request)
    .then(res => res.json())
    .then(data => Object.assign(outputObject, data))
}

function handleApiError(data, notificationElement) {
  if (data && data.code) return sendErrorNotification(notificationElement, data) 
}

d.addEventListener('DOMContentLoaded', async () => {
  await getData('https://geo.ipify.org/api/v2/country,city?apiKey=at_MXzrZpwhz3Tcth8fFn9JEGUTpwMT5', userData)
    .then(data => handleApiError(data))

  map = handleMap(map, userData).map
  setInfoCards({ data: userData })

  d.addEventListener('submit', async e => {
    e.preventDefault()

    let input = e.target.querySelector('input')
    input.value = input.value.trim()

    handleInputError(input, validateInput(input.value))

    if (input.getAttribute('aria-invalid') === 'true') {
      return sendErrorNotification(errorNotification, 'Invalid IP or domain.')
    }

    // server-side validation
    let validation = await apiValidation(input.value)

    if (validation.error) return sendErrorNotification(errorNotification, validation.error)

    userData = validation.data;

    map = handleMap(map, userData, true).map
    setInfoCards({ data: userData, remove: true })

    setTimeout(() => {
      setInfoCards({ data: userData })
    }, 1000)
  })
})

function handleInputError(input, remove) {

  if (remove) {
    input.removeAttribute('aria-invalid')
    input.removeAttribute('disabled')
    return
  }

  input.setAttribute('aria-invalid', 'true')
  input.setAttribute('disabled', '')
}

function validateIp(value) {
  if (value.length > 15) return false

  // not 100% accurate, may cause errors
  return /((25[0-5]?|24[0-9]?|2[0-9]?[0-9]?|[0-9][0-9]?[0-9]?)\.([0-9][0-9]?[0-9]?)\.([0-9][0-9]?[0-9]?)\.([0-9][0-9]?[0-9]?))/.test(value)
}

function validateDomain(value) {
  return /^([A-Za-z0-9\_\-]+\.?)?([A-Za-z0-9\_\-]+\.?)([A-Za-z\_\-]+)$/.test(value)
}

function validateInput(value) {
  let dots = value.split(/[^\.]/).filter(Boolean).length

  if (!validateIp(value) && !validateDomain(value)) return false

  // treat less than 3 dots as if it were a domain
  if (dots < 3 && !validateDomain(value)) return false

  if (dots === 3 && !validateIp(value)) return false

  return true
}

function getCardText(data, element) {
  let output = (() => {
    switch (element) {
      case 'card-ip':
        return data.ip
      case 'card-location':
        if(data.location.region && data.location.city){
          return `${data.location.region}, ${data.location.city} ${data.location.postalCode}`
        }
        return 'Unknown'
      case 'card-timezone':
        if(data.location.timezone){
          return `UTC ${data.location.timezone}`
        }
        return 'Unknown'
      case 'card-isp':
        return data.isp || 'Unknown'
      default: return ''
    }
  })()

  return output
}

function setInfoCards({ data, remove }) {
  let elements = ['card-ip', 'card-location', 'card-timezone', 'card-isp']

  for (const el of elements) {
    if (remove) {
      removeAnimatedUserText(el)
      continue;
    }

    setAnimatedUserText({
      element: el,
      text: getCardText(data, el)
    })
  }
}

function getElement(element) {
  const el = typeof element === 'string'
    ? document.getElementById(element)
    : element

  return el
}

function removeAnimatedUserText(element) {
  let nTime = 0
  let el = getElement(element)
  let childrens = [...el.children];

  for (const c of childrens) {

    // remove the last element and update the childrens array
    if (childrens.at(-1)) {
      setTimeout(() => {

        childrens.at(-1).remove()
        childrens = [...el.children]

      }, 1000 / childrens.length + nTime);
    }

    // make the animation faster
    if (childrens.length > 10) {
      nTime += 30; continue
    }

    nTime += 50
  }
}

function setAnimatedUserText({ element, text }) {
  let nTime = 0
  let el = getElement(element)

  for (const n of text.split('')) {
    const span = d.createElement('span')
    span.classList.add('char')
    span.textContent += n

    setTimeout(() => {
      el.append(span)
    }, 1000 / text.length + nTime)

    // make the animation faster
    if (text.length > 10) {
      nTime += 30; continue
    }

    nTime += 50
  }
}

function handleMap(map, data, update = false) {
  const latNLng = [data.location.lat, data.location.lng]

  // view[0] prevents the circle and marker from 
  // being positioned below the cards on mobile devices
  const view = latNLng[0] + .005;
  let c, m;

  ; (update)
    ? map.setView([view, latNLng[1]], 14)
    : map = L.map('map', {
      center: [view, latNLng[1]],
      zoom: 14,
      attributionControl: false,
      zoomControl: false,
      minZoom: 3
    });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);

  m = L.marker([...latNLng], {
    icon: L.icon({
      iconUrl: './assets/images/icon-location.svg',
      iconSize: [35, 45],
    })
  }).bindPopup("<strong>The location may not be accurate</strong>").openPopup()

  c = L.circle([...latNLng], {
    color: '#3A3D93',
    fillColor: '#3A3D93',
    fillOpacity: 0.2,
    radius: 500
  })

  let lGroup = L.layerGroup([m, c])
    .addTo(map)

  return { map, layers: lGroup }
}

// error -> {messages, code} || String 
function sendErrorNotification(notification, message) {
  const notificationText = notification.querySelector('.error__text')
  const cardsEl = d.getElementById('cards')

  notification.removeAttribute('aria-hidden')
  cardsEl.setAttribute('aria-hidden', '')

  notificationText.textContent = message.error.code
    ? message.error.code
    : message

  if (message.error.code) {
    notification.querySelector('.error__code').textContent = message.error.code
  }

  function handleErrorBtnClick() {
    notification.setAttribute('aria-hidden', 'true');
    cardsEl.removeAttribute('aria-hidden')

    notification.querySelector('.error__button').removeEventListener('click', handleErrorBtnClick)
  }

  notification.querySelector('.error__button').addEventListener('click', handleErrorBtnClick)
}

async function apiValidation(ipOrDomain) {
  let output = {error: false, data: {}}
  let request = 'ipAddress'

  const DOTS = ipOrDomain.split(/[^\.]/).filter(Boolean).length;

  if (DOTS < 3) {
    request = 'domain'
  }

  await getData(`https://geo.ipify.org/api/v2/country,city?apiKey=at_MXzrZpwhz3Tcth8fFn9JEGUTpwMT5&${request}=${ipOrDomain}`, output.data)
    .then(data => {

      if(data.code){
        output.error = data
      }
    })

  // data object means theres an error
  return output
}

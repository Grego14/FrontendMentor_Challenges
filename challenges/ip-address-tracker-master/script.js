import './lib/leaflet.js'

const d = document
const L = window.L
const errorNotification = d.getElementById('error-msg')
const cardsEl = d.getElementById('cards')

let map
let layers

//const userData = {}

const userData = {
  "ip": "201.208.237.177",
  "location": {
    "country": "VE",
    "region": "Miranda",
    "city": "Chacao",
    "lat": 10.49581,
    "lng": -66.85367,
    "postalCode": "",
    "timezone": "-04:00",
    "geonameId": 3645981
  },
  "as": {
    "asn": 8048,
    "name": "LACNIC-8048",
    "route": "201.208.224.0/19",
    "domain": "https://www.cantv.com.ve",
    "type": "Cable/DSL/ISP"
  },
  "isp": "CANTV"
}

function getData(request, outputObject) {
  return fetch(request)
    .then(res => res.json())
    .then(data => Object.assign(outputObject, data))
}

//function handleDataError(error) {
//if(!error.code) return

//return new Error(`${error.code} ${error.messages}`)
//}

d.addEventListener('DOMContentLoaded', async e => {
  // can't use the catch method with the API
  //await getData('https://geo.ipify.org/api/v2/country,city?apiKey=at_MXzrZpwhz3Tcth8fFn9JEGUTpwMT5', userData)
  //.then(data => handleDataError(data))

  updateInfoCards(userData)

  let initMap = setMap(userData)
  map = initMap.map
  layers = initMap.layers 

  d.addEventListener('submit', e => {
    e.preventDefault()

    //if (e.target.querySelector('input').getAttribute('aria-invalid') === 'true') return

    updateInfoCards(userData, true)

    setTimeout(() => {
      updateInfoCards(userData)
    }, 2000)
  })
})

function updateInfoCards(data, remove = false) {
  setAnimatedUserText({
    element: 'card-ip',
    text: data.ip,
    time: 1000,
    remove
  })

  setAnimatedUserText({
    element: 'card-location',
    text: `${data.location.region}, ${data.location.city} ${data.location.postalCode}`,
    time: 1000,
    remove
  })

  setAnimatedUserText({
    element: 'card-timezone',
    text: `UTC ${data.location.timezone}`,
    time: 1000,
    remove
  })

  setAnimatedUserText({
    element: 'card-isp',
    text: data.isp,
    time: 1000,
    remove
  })
}

function setAnimatedUserText({ element, text, time = 250, remove = false }) {
  let nTime = 0
  let el = element

  if (typeof element === 'string') {
    el = d.getElementById(element)
  }

  if (remove) return removeAnimatedUserText()

  for (const n of text.split('')) {
    const span = d.createElement('span')
    span.classList.add('char')
    span.textContent += n

    setTimeout(() => {
      el.append(span)
    }, time / text.length + nTime)

    if (text.length > 10) {
      nTime += 30; continue
    }

    nTime += 50
  }

  function removeAnimatedUserText() {
    let childrens = [...el.children]

    for (const c of childrens) {

      // remove the last element and update the childrens array
      if (childrens.at(-1)) {
        setTimeout(() => {
          childrens.at(-1).remove()
          childrens = [...el.children]
        }, time / childrens.length + nTime);
      }

      // if there are more than 10 elements make the animation faster
      if (childrens.length > 10) {
        nTime += 30; continue
      }

      nTime += 50
    }
  }
}

function setMap(data, update = false) {
  const latNLng = [data.location.lat, data.location.lng]
  // view[0] prevents the circle and marker from 
  // being positioned below the cards on mobile devices
  const view = [latNLng[0] + .005, latNLng[1]];
  let c,m;

  (update)
    ? map.setView(view, 14)
    : map = L.map('map', {
      center: view,
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

  return {map, layers: lGroup}
}

// error -> {messages, code} || String
function sendErrorNotification(notification, error){
  const notificationText = notification.querySelector('.error__text')

  notification.removeAttribute('aria-hidden')
  cardsEl.setAttribute('aria-hidden', '')

  notificationText.textContent = error

  if(error.code){
    notification.querySelector('.error__code').textContent = error.code
    notificationText.textContent = error.messages
  }

  setTimeout(() =>{
    notification.setAttribute('aria-hidden', 'true');
    cardsEl.removeAttribute('aria-hidden')

    ;[...notification.children].forEach(c => {
        c.textContent = ''
    });
  }, 8000)
}

// mejorar la accesibilidad a la hora de mostrarle a
  // el usuario la notificacion de el error
// hacer la funcion para validar la ip

sendErrorNotification(errorNotification, 'Theres an error, we don\'t know why!')

function validateDomain(domain) {
  return /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/.test(domain)
}

//async function validateIp(ip) {
//let output

//// let the API validate the ip...
//await getData(`https://geo.ipify.org/api/v2/country,city?apiKey=at_MXzrZpwhz3Tcth8fFn9JEGUTpwMT5&ipAddress=${ip}`, {})
//.then(data => {
//output = data.code ? true : false
//})

//return output
//}


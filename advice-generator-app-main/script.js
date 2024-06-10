const d = document

const adviceText = d.getElementById('advice-quote')
const adviceId = d.getElementById('advice-id')
const adviceTitle = adviceId.parentElement
const adviceButton = d.getElementById('advice-button')
let actualAdviceId = 1;

async function newAdvice(id) {
  let request;

  if (id) {
    request = new Request(`https://api.adviceslip.com/advice/${id}`)
  } else {
    request = new Request('https://api.adviceslip.com/advice')
  }

  return fetch(request)
    .then((res) => res.json()
      .then((data) => data))
}

function getId(actualId) {
  const newId = Math.floor(Math.random() * 200)

  if (actualId === newId) return getId()

  return newId
}

async function updateAdvice() {
  await newAdvice(getId(actualAdviceId)).then(advice => {

    actualAdviceId = advice.slip.id

    adviceText.removeAttribute('aria-hidden')
    adviceTitle.removeAttribute('aria-hidden')

    adviceText.textContent = advice.slip.advice
    adviceId.textContent = advice.slip.id
    adviceButton.removeAttribute('disabled')
  })
}

d.addEventListener('DOMContentLoaded', e => {
  updateAdvice()

  d.addEventListener('click', e => {
    if (e.target.matches('#advice-button')) {

      adviceButton.setAttribute('disabled', '')

      setTimeout(() => {
        updateAdvice()
      }, 300)
    }
  })
})

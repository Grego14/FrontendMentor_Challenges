const d = document
const w = window
const titleSpan = d.getElementById('fm-title')
const template = d.getElementById('fm-template')

d.addEventListener('DOMContentLoaded', e => {
  titleSpan.classList.add('fm-header__title--transition')
})

function getData(jsonFile) {
  return new Promise((resolve, reject) => {
    fetch(jsonFile)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

async function printChallenges() {
  const challenges = await getData('/challenges.json')
  const fragment = d.createDocumentFragment()
  const challengesContainer = d.getElementById('fm-challenges')

  Object.entries(challenges).forEach((challenge) => {
    const clone = template.cloneNode(true).content.getElementById('fm-challenge')
    const cloneName = clone.querySelector('.fm-challenge__name')

    const cloneStatus = clone.querySelector('.fm-challenge__status')
    const cloneImage = clone.querySelector('.fm-challenge__image')
    const cloneInfo = clone.querySelector('.fm-challenge-info')
    const obj = challenge[1]

    clone.removeAttribute('id')

    const challengeStatus = obj.status === '2'
      ? 'Completed'
      : challenge[1].status === '1'
        ? 'In progress'
        : challenge[1].status === '0'
        ? 'Not started'
        : 'To check'

    cloneName.textContent = obj.name.replace(/-/g, ' ').replace('_', '-')
    cloneStatus.textContent = challengeStatus
    updateChallengeImage(cloneImage, obj)

    clone.querySelector('.fm-challenge__image-container').append(cloneImage),
    clone.querySelector('.fm-challenge__info').append(cloneName, cloneStatus)

    fragment.append(clone)
  })

  challengesContainer.append(fragment)
}

function updateChallengeImage(image, obj){
  const noMobile = w.matchMedia('(max-width: 40rem)')

  if(noMobile.matches){
    return image.setAttribute('src', obj['desktop-screenshot'])
  }

  image.setAttribute('src', obj['mobile-screenshot'])
}

printChallenges()

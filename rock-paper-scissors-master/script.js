const d = document
const w = window

d.addEventListener('DOMContentLoaded', e => {
  const storage = w.localStorage

  const template = d.getElementById('game-template').content
  const fragment = d.createDocumentFragment()

  const options = new Map([
    ['rock' ,{name: 'rock', image: './assets/images/icon-rock.svg'}],
    ['paper', {name: 'paper', image: './assets/images/icon-paper.svg'}],
    ['scissors', {name: 'scissors', image: './assets/images/icon-scissors.svg'}],
    ['lizard', {name: 'lizard', image: './assets/images/icon-lizard.svg'}],
    ['spock', {name: 'spock', image: './assets/images/icon-spock.svg'}]
  ])

  if(!storage.getItem('game-mode')) storage.setItem('game-mode', 'rps') 

  const backgrounds = {
    triangle: {main: './assets/images/bg-triangle.svg', rules: './assets/images/image-rules.svg'},
    pentagon: {main: './assets/images/bg-pentagon.svg', rules: './assets/images/image-rules-bonus.svg'}
  }

  const gameBackground = d.getElementById('game-background')
  const rules = {
    rps: 'paper beats rock, rock beats scissors, scissors beats paper',
    rpsls: `scissors beats paper, paper beats rock, rock beats lizard, lizard beats spock, spock beats scissors
    scissors beats lizard, lizard beats paper, paper beats spock, spock beats rock, rock beats scissors`
  }
  const rulesText = d.getElementById('rules-text')

  storage.setItem('game-mode', 'rpsls')

  if(storage.getItem('game-mode') === 'rps'){
    gameBackground.src = backgrounds.triangle.main
    rulesText.setAttribute('alt', rules.rps)
    rulesText.setAttribute('src', backgrounds.triangle.rules)
  }else if(storage.getItem('game-mode') === 'rpsls'){
    gameBackground.src = backgrounds.pentagon.main
    rulesText.setAttribute('alt', rules.rpsls)
    rulesText.setAttribute('src', backgrounds.pentagon.rules)
  }

  const createOption = (option) =>{
    const clone = template.cloneNode(true)
    const cloneImg = clone.getElementById('image')
    cloneImg.removeAttribute('id')

    fragment.appendChild(clone)
  }
  createOption()

  const gameContent = d.getElementById('game-content')
  gameContent.appendChild(fragment)

  const rulesBtn = d.getElementById('game-rules')
  const closeRulesBtn = d.getElementById('close-rules')
  const rulesOverlay = d.getElementById('game-rules-overlay')

  function handleRulesBtnClick(e){ rulesOverlay.classList.toggle('game__rules--show') }

  d.addEventListener('click', e => {
    if(e.target === rulesBtn) handleRulesBtnClick(e)
    if(e.target === closeRulesBtn) handleRulesBtnClick(e)
  })
})

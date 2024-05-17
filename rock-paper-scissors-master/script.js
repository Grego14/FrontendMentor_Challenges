const d = document
const w = window

d.addEventListener('DOMContentLoaded', async e => {
  const storage = w.localStorage

  const gameElement = d.getElementById('game')
  const template = d.getElementById('game-template').content
  const fragment = d.createDocumentFragment()
  let score = storage.getItem('score') || 12

  const gameImageElement = d.getElementById('game-image')
  const gameImageAlt = storage.getItem('game-mode') === 'rps'
    ? 'Rock, paper, scissors'
    : 'Rock, paper, scissors, lizard, spock'

  // the orden of each option is important
  // as we are using nth-child to position them;
  const options = new Map([
    ['paper', {name: 'paper', image: './assets/images/icon-paper.svg', gradient: 'game__option--paper'}],
    ['scissors', {name: 'scissors', image: './assets/images/icon-scissors.svg', gradient: 'game__option--scissors'}],
    ['rock' ,{name: 'rock', image: './assets/images/icon-rock.svg', gradient: 'game__option--rock'}],
  ])

  const images = {
    triangle: {main: './assets/images/bg-triangle.svg', rules: './assets/images/image-rules.svg', title: './assets/images/logo.svg'},
    pentagon: {main: './assets/images/bg-pentagon.svg', rules: './assets/images/image-rules-bonus.svg', title: './assets/images/logo-bonus.svg'}
  }

  const rules = {
    rps: 'paper beats rock, rock beats scissors, scissors beats paper',
    rpsls: `scissors beats paper, paper beats rock, rock beats lizard, lizard beats spock, spock beats scissors
    scissors beats lizard, lizard beats paper, paper beats spock, spock beats rock, rock beats scissors`
  }

  if(!storage.getItem('game-mode')) storage.setItem('game-mode', 'rps') 
  if(!storage.getItem('score')) storage.setItem('score', score) 

  const gameImageUrl = storage.getItem('game-mode') === 'rps'
    ? images.triangle.title
    : images.pentagon.title

  gameImageElement.src = await fetch(gameImageUrl).then(res => res.url)
  gameImageElement.setAttribute('alt', gameImageAlt)

  gameImageElement.addEventListener('load', e => {
    gameImageElement.classList.add('game__image--loaded')
  }, {once: true})

  const gameBackgroundElement = d.getElementById('game-background')
  const rulesText = d.getElementById('rules-text')
  const gameContent = d.getElementById('game-content')

  const backgroundImageUrl = storage.getItem('game-mode') === 'rps'
  ? images.triangle.main
  : images.pentagon.main

  gameBackgroundElement.src = await fetch(backgroundImageUrl).then(res => res.url)

  gameBackgroundElement.addEventListener('load', e => {
    gameBackgroundElement.classList.add('game__background--show')
  }, {once: true})

  if(storage.getItem('game-mode') === 'rps'){

    rulesText.setAttribute('alt', rules.rps)
    rulesText.setAttribute('src', images.triangle.rules)

  }else if(storage.getItem('game-mode') === 'rpsls'){

    rulesText.setAttribute('alt', rules.rpsls)
    rulesText.setAttribute('src', images.pentagon.rules)
    gameElement.classList.add('game__content--rpsls')

    options.set('lizard', {name: 'lizard', image: './assets/images/icon-lizard.svg', gradient: 'game__option--lizard'})
    options.set('spock', {name: 'spock', image: './assets/images/icon-spock.svg', gradient: 'game__option--spock'})
  }

  function createOption({name, image, label, gradient, customClass, customAnimation}){
    const clone = template.cloneNode(true)
    const cloneImg = clone.getElementById('image')
    const cloneOption = clone.getElementById('name')

    cloneImg.removeAttribute('id')
    cloneOption.removeAttribute('id')

    cloneOption.classList.add(gradient)

    if(customClass) cloneOption.classList.add(customClass)
    if(customAnimation) {

      cloneOption.classList.add(customAnimation)

      cloneOption.addEventListener('animationend', e => {
        cloneOption.classList.add('game__option--show', 'game__option--start')

        cloneOption.classList.remove(customAnimation)
      }, {once: true})
    }

    setTimeout(() => {
      cloneOption.classList.add('game__option--show', 'game__option--start')
    }, 500);

    cloneOption.addEventListener('transitionend', e => {
      cloneImg.classList.add('image--show')
    }, {once: true})

    cloneImg.setAttribute('src', image)
    cloneOption.setAttribute('aria-label', `${label}`)

    return cloneOption
  }

  for (const [key, option] of options) {
    const opt = createOption({
      name: option.name,
      label: `Select ${option.name}`,
      image: option.image,
      gradient: option.gradient
    })

    fragment.append(opt)
  }

  const gameOptions = d.getElementById('game-options')
  gameOptions.append(fragment)

  const rulesBtn = d.getElementById('game-rules')
  const closeRulesBtn = d.getElementById('close-rules')
  const gameRulesOverlay = d.getElementById('game-rules-overlay')

  function handleRulesBtnClick(e){ gameRulesOverlay.classList.toggle('game__rules--show') }

  function handleOptionsOnClick(clickedOption){
    const domOptions = d.querySelectorAll('.game__option')
    for (const domOpt of domOptions) {

      if(domOpt === clickedOption) continue

      domOpt.classList.remove('game__option--show', 'game__option--start')

      domOpt.addEventListener('transitionend', e => {
        if(e.propertyName === 'opacity') domOpt.classList.add('game__option--hide')
      }, {once: true})

      gameBackgroundElement.classList.add('game__background--hide')

      clickedOption.classList.add('game__option--selected')
    }

    handleHouseOption()
  }

  function handleHouseOption(){
    const bg = d.createElement('div')
    bg.classList.add('game__option--house-selecting')

    gameOptions.append(bg)

    const name = getRandomOption()

    const houseOpt = createOption({
      name: name, 
      image: `./assets/images/icon-${name}.svg`,
      label: `The house selects ${name}`,
      gradient: `game__option--${name}`,
      customClass: 'game__option--house'
    })

    houseOpt.addEventListener('transitionend', e =>{
      gameOptions.removeChild(bg)
    }, {once: true})

    gameOptions.append(houseOpt)
  }

  function getRandomOption(){
    const opts = []
    for (const [key, value] of options.entries()) {
      opts.push(value.name)
    }
    return opts[Math.floor(Math.random() * opts.length)]
  }

  d.addEventListener('click', e => {
    if(e.target === rulesBtn) handleRulesBtnClick(e)
    if(e.target === closeRulesBtn) handleRulesBtnClick(e)

    if(e.target.matches('.game__option')) handleOptionsOnClick(e.target)
  })
})

const d = document
const w = window

d.addEventListener('DOMContentLoaded', async e => {
  const storage = w.localStorage

  const gameElement = d.getElementById('game')
  const template = d.getElementById('game-template').content
  const fragment = d.createDocumentFragment()
  const gameOptions = d.getElementById('game-options')

  if(!storage.getItem('game-mode')) storage.setItem('game-mode', 'rps') 
  if(!storage.getItem('score')) storage.setItem('score', 12) 

  let score = storage.getItem('score')
  const gameMode = storage.getItem('game-mode')

  const sounds = {
    lose: new Audio(),
    win: new Audio()
  }

  const options = new Map([
    ['paper', {name: 'paper', image: './assets/images/icon-paper.svg', gradient: 'game__option--paper'}],
    ['scissors', {name: 'scissors', image: './assets/images/icon-scissors.svg', gradient: 'game__option--scissors'}],
    ['rock' ,{name: 'rock', image: './assets/images/icon-rock.svg', gradient: 'game__option--rock'}],
  ])

  const images = {
    rps: {main: './assets/images/bg-triangle.svg', rules: './assets/images/image-rules.svg', title: './assets/images/logo.svg'},
    rpsls: {main: './assets/images/bg-pentagon.svg', rules: './assets/images/image-rules-bonus.svg', title: './assets/images/logo-bonus.svg'}
  }

  const soundsUrls = {
    win: './assets/sounds/win-sound.mp3',
    lose: './assets/sounds/lose-sound.mp3'
  }

  const rules = {
    rps: 'paper beats rock, rock beats scissors, scissors beats paper',
    rpsls: `scissors beats paper, paper beats rock, rock beats lizard, lizard beats spock, spock beats scissors
    scissors beats lizard, lizard beats paper, paper beats spock, spock beats rock, rock beats scissors`
  }

  const gameImageElement = d.getElementById('game-image')
  const gameImageAlt = gameMode === 'rps' 
    ? 'Rock, paper, scissors'
    : 'Rock, paper, scissors, lizard, spock'
  const gameImageUrl = images[gameMode].title

  preloadSource(gameImageUrl, gameImageElement, (src) =>{
    gameImageElement.classList.add('game__image--loaded')
    gameImageElement.setAttribute('alt', gameImageAlt)
  })

  const gameBackgroundElement = d.getElementById('game-background')
  const rulesText = d.getElementById('rules-text')
  const gameContent = d.getElementById('game-content')

  const backgroundImageUrl = images[gameMode].main

  preloadSource(soundsUrls.win, sounds.win, (src) =>{
    sounds.win.src = src
  })

  preloadSource(soundsUrls.lose, sounds.lose, (src) =>{
    sounds.lose.src = src
  })

  function preloadSource(url, source, callback){
    source.src = url

    source.addEventListener('load', () =>{
      callback(source.src)
    }, {once: true})
  }

  preloadSource(backgroundImageUrl, gameBackgroundElement, (src) =>{
    gameBackgroundElement.classList.add('game__background--show')
  })

  rulesText.setAttribute('alt', rules[gameMode])
  rulesText.setAttribute('src', images[gameMode].rules)

  if(gameMode === 'rpsls') {
    gameElement.classList.add('game__content--rpsls')

    // reorganize the options, and their tabindexes.
    options.clear()

    options.set('scissors', {name: 'scissors', image: './assets/images/icon-scissors.svg', gradient: 'game__option--scissors'})
    options.set('paper', {name: 'paper', image: './assets/images/icon-paper.svg', gradient: 'game__option--paper'})
    options.set('rock' ,{name: 'rock', image: './assets/images/icon-rock.svg', gradient: 'game__option--rock'})
    options.set('lizard', {name: 'lizard', image: './assets/images/icon-lizard.svg', gradient: 'game__option--lizard'})
    options.set('spock', {name: 'spock', image: './assets/images/icon-spock.svg', gradient: 'game__option--spock'})
  }

  const gameResult = d.getElementById('game-result')
  const gameResultText = d.getElementById('game-result-text')
  const gameScore = d.getElementById('game-score')
  setScore(score)

  function createOption({name, image, label, gradient, customClass}){
    const clone = template.cloneNode(true)
    const cloneImg = clone.getElementById('image')
    const cloneOption = clone.getElementById('name')

    cloneImg.removeAttribute('id')
    cloneOption.removeAttribute('id')

    cloneOption.classList.add(gradient)
    cloneOption.setAttribute('data-option', name)

    if(customClass) cloneOption.classList.add(customClass)

    setTimeout(() => {
      cloneOption.classList.add('game__option--show', 'game__option--start')
    }, 500);

    cloneOption.addEventListener('transitionend', e => {
      cloneOption.classList.remove('game__option--start')
      cloneImg.classList.add('image--show')
    }, {once: true})

    cloneImg.setAttribute('src', image)
    cloneOption.setAttribute('aria-label', `${label}`)

    return cloneOption
  }

  // prevent adding the options if the background is not loaded yet
  gameBackgroundElement.addEventListener('load', () =>{
    for (const [key, option] of options) {
      const opt = createOption({
        name: option.name,
        label: `Select ${option.name}`,
        image: option.image,
        gradient: option.gradient
      })
      fragment.append(opt)
    }
    gameOptions.append(fragment)
  }, {once: true})

  const rulesBtn = d.getElementById('game-rules')
  const closeRulesBtn = d.getElementById('close-rules')
  const gameRulesOverlay = d.getElementById('game-rules-overlay')

  function handleRulesBtnClick(e){ 
    gameElement.classList.toggle('game__rules-desktop-overlay--show')
    gameRulesOverlay.classList.toggle('game__rules--show') 
    gameRulesOverlay.setAttribute('aria-hidden', gameRulesOverlay.getAttribute('aria-hidden') === 'true' ? 'false' : 'true') 
    rulesBtn.classList.toggle('game__rules--clicked')
  }

  function handleOptionsText(){
    const textElements = d.querySelectorAll('.option__text')

    for (const textEl of textElements) {
      textEl.classList.add('option__text--show')
      textEl.setAttribute('aria-hidden', textEl.getAttribute('aria-hidden') === 'true' ? 'false' : 'true')
    }
  }

  const playAgainBtn = d.getElementById('button-play')
  const modeBtn = d.getElementById('button-mode')

  modeBtn.textContent = gameMode === 'rps' ? 'Lizard + Spock' : 'Normal mode'
  modeBtn.dataset.mode = gameMode === 'rps' ? 'rpsls' : 'rps'

  function handleOptionsOnClick(clickedOption){
    clickedOption.setAttribute('id', 'selected-option')
    gameElement.classList.add('game__content--user-select')

    const domOptions = d.querySelectorAll('.game__option')
    for (const domOpt of domOptions) {

      if(domOpt === clickedOption) continue

      clickedOption.classList.remove('game__option--start')
      domOpt.classList.remove('game__option--show', 'game__option--start')

      if(!domOpt.classList.contains('game__option--selected') || !domOpt.classList.contains('game__option--house')){
        domOpt.removeAttribute('tabindex')
      }

      domOpt.addEventListener('transitionend', e => {
        if(e.propertyName === 'opacity') domOpt.classList.add('game__option--hide')
      }, {once: true})

      gameBackgroundElement.classList.add('game__background--hide')

      clickedOption.classList.add('game__option--selected')
    }
    handleOptionsText()
    handleHouseOption()
  }

  let houseOpt;

  function handleHouseOption(){
    const bg = d.createElement('div')
    bg.classList.add('game__option--house-selecting')

    const name = getRandomOption()

    houseOpt = createOption({
      name: name, 
      image: `./assets/images/icon-${name}.svg`,
      label: `The house selects ${name}`,
      gradient: `game__option--${name}`,
      customClass: 'game__option--house',
    })

    const houseOptContainer = d.createElement('div')
    houseOptContainer.classList.add('game__option__container', 'option__container--house')
    const selectedOptContainer = d.createElement('div')
    selectedOptContainer.classList.add('game__option__container', 'option__container--selected')

    houseOptContainer.append(houseOpt, bg)
    selectedOptContainer.append(d.getElementById('selected-option'))

    houseOpt.addEventListener('transitionend', e =>{
      houseOptContainer.removeChild(bg)

      gameResult.setAttribute('aria-hidden', 'false')
      gameResult.classList.add('game__result--show')

      d.activeElement.blur()
      gameResultText.focus()

      handleScore({target: d.querySelector('.game__option--selected')})
    }, {once: true})

    gameOptions.append(selectedOptContainer)
    gameOptions.append(houseOptContainer)
  }

  function getRandomOption(){
    const opts = []
    for (const [key, value] of options.entries()) {
      opts.push(value.name)
    }
    return opts[Math.floor(Math.random() * opts.length)]
  }

  function updateScore(){ gameScore.textContent = score }

  function setScore(newScore){
    score = newScore
    storage.setItem('score', score)

    updateScore()
  }

  function updateGameResult(text){
    gameResultText.textContent = text
  }

  function handleScore(e){
    const userSelected = e.target.dataset.option
    const houseSelected = houseOpt.dataset.option 

    if(userSelected === houseSelected) return updateGameResult('Draw')

    if((userSelected === 'paper' && houseSelected === 'rock')
      || (userSelected === 'rock' && houseSelected === 'scissors')
      || (userSelected === 'scissors' && houseSelected === 'paper')
      || (userSelected === 'rock' && houseSelected === 'lizard')
      || (userSelected === 'lizard' && houseSelected === 'spock')
      || (userSelected === 'spock' && houseSelected === 'scissors')
      || (userSelected === 'scissors' && houseSelected === 'lizard')
      || (userSelected === 'lizard' && houseSelected === 'paper')
      || (userSelected === 'paper' && houseSelected === 'spock')
      || (userSelected === 'spock' && houseSelected === 'rock')
    ) {
      setScore(Number(score) + 1)
      sounds.win.play()
      e.target.classList.add('game__option--winner')
      gameOptions.classList.add(`options__winner--${d.querySelector('.game__option--winner').dataset.option}`)
      return updateGameResult('You win')
    }

    sounds.lose.play()
    setScore(Number(score) - 1)
    houseOpt.classList.add('game__option--winner')
    gameOptions.classList.add(`options__winner--${d.querySelector('.game__option--winner').dataset.option}`)
    return updateGameResult('You lose')
  }

  function handleModeBtn(e){
    if(gameMode === e.target.dataset.mode) return

    w.localStorage.setItem('game-mode', e.target.dataset.mode)

    e.target.dataset.mode = e.target.dataset.mode === 'rps' ? 'rpsls' : 'rps'

    w.location.reload()
  }

  function handlePlayBtn(e){ w.location.reload() }
  
  function updateOptionsLabels(e){
    e.target.setAttribute('aria-label', `You picked ${e.target.dataset.option}`)
    houseOpt.setAttribute('aria-label', `The house picked ${houseOpt.dataset.option}`)
  }

  d.addEventListener('click', e => {
    if(e.target === rulesBtn) handleRulesBtnClick(e)
    if(e.target === closeRulesBtn) handleRulesBtnClick(e)
    if(e.target.matches('#desktop-overlay') && gameElement.classList.contains('game__rules-desktop-overlay--show')) handleRulesBtnClick(e)

    if(e.target === modeBtn) handleModeBtn(e)
    if(e.target === playAgainBtn) handlePlayBtn(e)

    if(e.target.matches('.game__option')) {
      handleOptionsOnClick(e.target)
      updateOptionsLabels(e)
    }
  })

  d.addEventListener('keydown', e =>{
    if(e.key === 'Enter' && e.target.matches('.game__option:not(.game__option--selected, .game__option--house)')){
      handleOptionsOnClick(e.target)
      updateOptionsLabels(e)
    }
  })
})

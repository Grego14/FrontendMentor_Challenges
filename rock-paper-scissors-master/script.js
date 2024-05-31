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
  let gameMode = storage.getItem('game-mode')

  const sounds = {
    lose: new Audio(),
    win: new Audio()
  }

  const backgrounds = {
    rps: new Image(),
    rpsls: new Image(),
    rules_rps: new Image(),
    rules_rpsls: new Image(),
    title_rps: new Image(),
    title_rpsls: new Image()
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

  const gameBackgroundElement = d.getElementById('game-background')

  const rulesImage = d.getElementById('rules-image-text')
  const gameContent = d.getElementById('game-content')

  function preloadSource(url, source, callback){
    source.src = url

    if(callback){
      source.addEventListener('load', () =>{
        callback(source.src)
      }, {once: true})
    }
  }

  preloadSource(gameImageUrl, gameImageElement, (src) =>{
    gameImageElement.classList.add('game__image--loaded')
    gameImageElement.setAttribute('alt', gameImageAlt)
  })

  function updateImage(element, src, {className, alt}){
    element.src = src

    if(className) element.classList.add(className)
    if(alt) element.setAttribute('alt', alt)
  }

  preloadSource(soundsUrls.win, sounds.win, (src) =>{
    sounds.win.src = src
  })

  preloadSource(soundsUrls.lose, sounds.lose, (src) =>{
    sounds.lose.src = src
  })

  preloadSource(images.rps.main, backgrounds.rps)
  preloadSource(images.rpsls.main, backgrounds.rpsls)

  updateImage(gameBackgroundElement, backgrounds[gameMode].src, { className: 'game__background--show' })

  preloadSource(images.rps.rules, backgrounds.rules_rps)
  preloadSource(images.rpsls.rules, backgrounds.rules_rpsls)

  updateImage(rulesImage, backgrounds[`rules_${gameMode}`].src, { className: 'rules__image--show', alt: rules[gameMode]})

  preloadSource(images.rps.title, backgrounds.title_rps)
  preloadSource(images.rpsls.title, backgrounds.title_rpsls)

  updateImage(gameImageElement, backgrounds[`title_${gameMode}`].src, { className: 'game__image--show' })

  function updateOptions(){
    if(gameMode === 'rpsls') {
      gameElement.classList.add('game__content--rpsls')

      options.clear()

      options.set('scissors', {name: 'scissors', image: './assets/images/icon-scissors.svg', gradient: 'game__option--scissors'})
      options.set('paper', {name: 'paper', image: './assets/images/icon-paper.svg', gradient: 'game__option--paper'})
      options.set('rock' ,{name: 'rock', image: './assets/images/icon-rock.svg', gradient: 'game__option--rock'})
      options.set('lizard', {name: 'lizard', image: './assets/images/icon-lizard.svg', gradient: 'game__option--lizard'})
      options.set('spock', {name: 'spock', image: './assets/images/icon-spock.svg', gradient: 'game__option--spock'})

      return options
    }

    gameElement.classList.remove('game__content--rpsls')

    options.clear()

    options.set('paper', {name: 'paper', image: './assets/images/icon-paper.svg', gradient: 'game__option--paper'})
    options.set('scissors', {name: 'scissors', image: './assets/images/icon-scissors.svg', gradient: 'game__option--scissors'})
    options.set('rock' ,{name: 'rock', image: './assets/images/icon-rock.svg', gradient: 'game__option--rock'})
  }

  updateOptions()

  const gameResult = d.getElementById('game-result')
  const gameResultText = d.getElementById('game-result-text')
  const gameScore = d.getElementById('game-score')
  setScore(score)

  function changeMode(){
    gameMode = storage.getItem('game-mode')

    updateImage(gameBackgroundElement, backgrounds[gameMode].src, 'game__background--show')
    updateImage(rulesImage, backgrounds[`rules_${gameMode}`].src, 'rules__image--show')
    updateImage(gameImageElement, backgrounds[`title_${gameMode}`].src, 'game__image--show')

    handleGameResults()
    handleGameElement()

    removeOptions()
  }

  function createOption({name, image, label, gradient, customClass}){
    const clone = template.cloneNode(true)
    const cloneImg = clone.getElementById('image')
    const cloneOption = clone.getElementById('option')
    const cloneOptionContainer = clone.getElementById('container')

    cloneImg.removeAttribute('id')
    cloneOption.removeAttribute('id')
    cloneOptionContainer.removeAttribute('id')

    cloneOptionContainer.classList.add(gradient)
    cloneOptionContainer.setAttribute('data-option', name)

    if(customClass) cloneOptionContainer.classList.add(customClass)

    setTimeout(() => {
      cloneOptionContainer.classList.add('game__option--show', 'game__option--start')
    }, 500);

    cloneOptionContainer.addEventListener('transitionend', e => {
      cloneOptionContainer.classList.remove('game__option--start')
      cloneOptionContainer.classList.add('game__option--loaded')
      cloneImg.classList.add('image--show')
    }, {once: true})

    cloneImg.setAttribute('src', image)
    cloneOptionContainer.setAttribute('aria-label', `${label}`)

    return cloneOptionContainer
  }

  function createOptions(){
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
  }

  // prevent adding the options if the background is not loaded yet
  gameBackgroundElement.addEventListener('load', () =>{
    createOptions()
  }, {once: true})

  const rulesBtn = d.getElementById('game-rules')
  const closeRulesBtn = d.getElementById('close-rules')
  const gameRulesOverlay = d.getElementById('game-rules-overlay')

  function handleRulesBtnClick(e){ 
    gameElement.classList.toggle('game__rules-overlay--show')
    gameRulesOverlay.classList.toggle('game__rules--show') 
    gameRulesOverlay.setAttribute('aria-hidden', gameRulesOverlay.getAttribute('aria-hidden') === 'true' ? 'false' : 'true') 
    rulesBtn.classList.toggle('game__rules--clicked')
  }

  function handleOptionsText(remove){
    const houseOptText = d.createElement('div')
    const selectedOptText = d.createElement('div')

    houseOptText.classList.add('game__option__text--house', 'game__option__text')
    selectedOptText.classList.add('game__option__text--selected', 'game__option__text')

    houseOptText.textContent = 'the house picked'
    selectedOptText.textContent = 'you picked'

    d.getElementById('selected-option').append(selectedOptText)
    d.getElementById('house-option').append(houseOptText)
  }

  const playAgainBtn = d.getElementById('button-play')
  const modeBtn = d.getElementById('button-mode')


  function updateModeBtn(){
    modeBtn.textContent = gameMode === 'rps' ? 'Lizard + Spock' : 'Normal mode'
    modeBtn.dataset.mode = gameMode === 'rps' ? 'rpsls' : 'rps'
  }

  updateModeBtn()

  function removeOptions(callback){
    for (const domOpt of d.querySelectorAll('.game__option__container')) {

      if(callback) callback(domOpt)

      gameOptions.removeChild(domOpt)
    }
  }

  // reset some content before playing again 
  function handleGameElement(){
    gameElement.classList.remove('game__content--user-select')
    gameBackgroundElement.classList.remove('game__background--hide')

    if(gameElement.classList.value.match(/options__winner--.*$/)?.[0]) 
    gameElement.classList.remove(gameElement.classList.value?.match(/options__winner--.*$/)[0])
    gameElement.classList.remove('game__content--house-selected')
  }

  function handlePlayAgainBtn(){
    changeMode()
    createOptions()
  }

  function handleModeBtn(e){
    w.localStorage.setItem('game-mode', e.target.dataset.mode)
    e.target.dataset.mode = e.target.dataset.mode === 'rps' ? 'rpsls' : 'rps'

    changeMode()

    updateModeBtn()

    updateOptions()
    createOptions()
  }

  function handleOptionsOnClick(clickedOption){
    clickedOption.setAttribute('id', 'selected-option')
    clickedOption.setAttribute('aria-selected', clickedOption.getAttribute('aria-selected') === 'true' ? 'false' : 'true')

    gameElement.classList.add('game__content--user-select')

    clickedOption.classList.add('game__option--start')

    for (const domOpt of d.querySelectorAll('.game__option__container')) {

      if(domOpt === clickedOption) continue

      gameOptions.removeChild(domOpt)
    }

    gameBackgroundElement.classList.add('game__background--hide')
    clickedOption.classList.add('game__option--selected')

    handleHouseOption()
    handleOptionsText()
  }

  let houseOpt;
  const bg = d.createElement('div')

  function handleHouseOption(){
    bg.classList.add('game__option--house-selecting')

    const name = getRandomOption()

    houseOpt = createOption({
      name: name, 
      image: `./assets/images/icon-${name}.svg`,
      label: `The house selects ${name}`,
      gradient: `game__option--${name}`,
      customClass: 'game__option--house',
    })

    houseOpt.setAttribute('id', 'house-option')

    houseOpt.append(bg)

    handleHouseOptTransitionEnd()

    gameOptions.append(houseOpt)
  }

  function handleGameResults(){
    gameResult.setAttribute('aria-hidden', gameResult.getAttribute('aria-hidden') === 'true' ? 'false' : 'true')
  }

  function handleHouseOptTransitionEnd(){
    houseOpt.addEventListener('transitionend', e =>{
      houseOpt.removeChild(bg)
      gameElement.classList.add('game__content--house-selected')

      handleGameResults()

      d.activeElement.blur()
      gameResultText.focus()

      handleScore(d.querySelector('.game__option--selected'))
    }, {once: true})
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

  function handleScore(selectedOpt){
    const userSelected = selectedOpt.dataset.option
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
      selectedOpt.classList.add('game__option--winner')
      gameElement.classList.add(`options__winner--${d.querySelector('.game__option--winner').dataset.option}`)
      return updateGameResult('You win')
    }

    sounds.lose.play()
    setScore(Number(score) - 1)
    houseOpt.classList.add('game__option--winner')
    gameElement.classList.add(`options__winner--${d.querySelector('.game__option--winner').dataset.option}`)
    return updateGameResult('You lose')
  }

  function updateOptionsLabels(e){
    e.target.setAttribute('aria-label', `You picked ${e.target.dataset.option}`)
    houseOpt.setAttribute('aria-label', `The house picked ${houseOpt.dataset.option}`)
  }

  d.addEventListener('click', e => {
    if(e.target === rulesBtn) handleRulesBtnClick(e)
    if(e.target === closeRulesBtn) handleRulesBtnClick(e)
    if(e.target.matches('#desktop-overlay') && gameElement.classList.contains('game__rules-overlay--show')) handleRulesBtnClick(e)

    if(e.target === modeBtn) handleModeBtn(e)
    if(e.target === playAgainBtn) handlePlayAgainBtn(e)

    if(e.target.matches('.game__option__container')) {
      handleOptionsOnClick(e.target)
      updateOptionsLabels(e)
    }
  })

  d.addEventListener('keydown', e =>{
    if(e.key === 'Enter' && e.target.matches('.game__option__container:not(.game__option--selected, .game__option--house)')){
      handleOptionsOnClick(e.target)
      updateOptionsLabels(e)
    }
  })
})

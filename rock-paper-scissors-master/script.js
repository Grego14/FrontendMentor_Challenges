const d = document
const w = window

d.addEventListener('DOMContentLoaded', e => {
  const storage = w.localStorage

  const template = d.getElementById('game-template').content
  const fragment = d.createDocumentFragment()
  let score = 12

  // the orden of each option is important
  // as we are using nth-child to position them;
  const options = new Map([
    ['paper', {name: 'paper', image: './assets/images/icon-paper.svg'}],
    ['scissors', {name: 'scissors', image: './assets/images/icon-scissors.svg'}],
    ['rock' ,{name: 'rock', image: './assets/images/icon-rock.svg'}],
  ])

  if(!storage.getItem('game-mode')) storage.setItem('game-mode', 'rps') 
  if(!storage.getItem('score')) storage.setItem('score', score) 

  const backgrounds = {
    triangle: {main: './assets/images/bg-triangle.svg', rules: './assets/images/image-rules.svg'},
    pentagon: {main: './assets/images/bg-pentagon.svg', rules: './assets/images/image-rules-bonus.svg'}
  }

  const rules = {
    rps: 'paper beats rock, rock beats scissors, scissors beats paper',
    rpsls: `scissors beats paper, paper beats rock, rock beats lizard, lizard beats spock, spock beats scissors
    scissors beats lizard, lizard beats paper, paper beats spock, spock beats rock, rock beats scissors`
  }

  const gameBackground = d.getElementById('game-background')
  const rulesText = d.getElementById('rules-text')
  const gameContent = d.getElementById('game-content')

  if(storage.getItem('game-mode') === 'rps'){
    gameBackground.src = backgrounds.triangle.main
    rulesText.setAttribute('alt', rules.rps)
    rulesText.setAttribute('src', backgrounds.triangle.rules)
  }else if(storage.getItem('game-mode') === 'rpsls'){
    gameBackground.src = backgrounds.pentagon.main
    rulesText.setAttribute('alt', rules.rpsls)
    rulesText.setAttribute('src', backgrounds.pentagon.rules)
    gameContent.classList.add('game__content--rpsls')

    options.set('lizard', {name: 'lizard', image: './assets/images/icon-lizard.svg'})
    options.set('spock', {name: 'spock', image: './assets/images/icon-spock.svg'})
  }

  for (const [key, option] of options) {
    const clone = template.cloneNode(true)
    const cloneImg = clone.getElementById('image')
    const cloneName = clone.getElementById('name')

    cloneImg.removeAttribute('id')
    cloneName.removeAttribute('id')

    setTimeout(() => {
      cloneName.classList.add('game__option--show')
    }, 500);

    cloneName.addEventListener('transitionend', e => {
      cloneImg.classList.add('image--show')
    }, {once: true})

    cloneImg.setAttribute('src', option.image)
    cloneName.setAttribute('aria-label', `Select ${option.name}`)

    fragment.appendChild(clone)
  }

  const gameOptions = d.getElementById('game-options')

  gameOptions.append(fragment)

  const rulesBtn = d.getElementById('game-rules')
  const closeRulesBtn = d.getElementById('close-rules')
  const rulesOverlay = d.getElementById('game-rules-overlay')

  function handleRulesBtnClick(e){ rulesOverlay.classList.toggle('game__rules--show') }

  function handleOptionsOnClick(clickedOption){
    const domOptions = d.querySelectorAll('.game__option')
    for (const domOpt of domOptions) {

      if(domOpt === clickedOption) continue

      domOpt.classList.remove('game__option--show')

      domOpt.addEventListener('transitionend', e => {
        if(e.propertyName === 'opacity') domOpt.classList.add('game__option--hide')
      }, {once: true})

      gameBackground.classList.add('game__background--hide')

      clickedOption.classList.add('game__option--selected')

      options.set('house', {name: getRandomOption(), image: `./assets/images/icon-${getRandomOption()}.svg`})
      gameOptions.append(options.get('house'))
    }
  }

  function handleHouseOption(name, image){
    const opt = d.createElement('div')
    opt.classList.add('game__option game__option--house')

  }

  function getRandomOption(){
    const opts = []
    for (const [key, value] of options.entries()) {
      opts.push(value.name)
    }
    return opts[Math.floor(Math.random() * opts.length)]
  }

  function selectOption(e){
    console.log(e)
    handleOptionsOnClick(e.target)
  }


  d.addEventListener('click', e => {
    if(e.target === rulesBtn) handleRulesBtnClick(e)
    if(e.target === closeRulesBtn) handleRulesBtnClick(e)

    if(e.target.matches('.game__option')) selectOption(e)
  })
})

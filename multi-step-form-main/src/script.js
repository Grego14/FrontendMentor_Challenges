import { 
	gebi, 
	qs, 
	qsa, 
	firstLetter, 
	handleBtn, 
	updateErrorEl, 
	throwError, 
	characters, 
	verifyUsername, 
	getRegex, 
	addEvent,
  extractNumber
} from './utilities/usefulFunctions.js'

const d = document;

const form = gebi('form')
let actualFormStep = qs('.form__step.form--show')

const cardBtn = gebi('button-price')
let actualCard;

const addons = Array.from(qsa('.form__addon'))

const backBtn = gebi('back-btn')
const nextBtn = gebi('next-btn')

const stepsIndicators = qsa('.form__step-indicator')
let actualStepIndicator = qs('.form__step-indicator.indicator--actual')

const changePlan = gebi('change-plan')

const userInfo = {
	name: '',
	email: '',
	phone: '',
	plan: '',
	planPrice: '',
	yearly: false,
	addons: [],
	addonsPrice: 0
}

const invalidMessages = {
	name:  'Invalid Name',
	email: 'Invalid Email',
	phone: 'Invalid Phone',
	required: 'This field is required'
}

const titleAndDesc = new Map([
	['1', {
		title: 'Personal info',
		desc: 'Please provide your name, email address, and phone number.'
	}],
	['2', {
		title: 'Select your plan',
		desc: 'You have the option of monthly or yearly billing.'
	}],
	['3', {
		title: 'Pick add-ons',
		desc: 'Add-ons help enhance your gaming experience.'
	}],
	['4', {
		title: 'Finishing up',
		desc: 'Double-check everything looks OK before confirming.'
	}],
	['5', {
		title: '',
		desc: ''
	}]
])

function calculatePrice(price){
  return userInfo.yearly ? price * 10 : price / 10
}

function transformPrice(price, plus){
	return `${plus ? '+' : ''}$${price}/${userInfo.yearly ? 'yr' : 'mo'}`
}

function changeActualFormStep(formStep, animationBackward){

  const transition = animationBackward
  ? 'left'
  : 'right'

  const newStep = qs(`.form__step[data-step="${formStep}"]`)

  if(!newStep) return

  newStep.setAttribute('data-position', 'actual')
  newStep.classList.add('form--slow-transition')

	actualFormStep.setAttribute('data-position', transition)

  actualFormStep.addEventListener('transitionend', e => {

    newStep.classList.add('form--show')
    newStep.removeAttribute('aria-hidden')
    newStep.classList.remove('form--slow-transition')

    for (const [key, step] of d.querySelectorAll('.form__step').entries()){
      if(step === newStep || step.getAttribute('aria-hidden') || !step.classList.contains('form--show')) continue

      step.setAttribute('aria-hidden', 'true')
      step.classList.remove('form--show')
    }

    updateIndicator(newStep.dataset.step)
    updateTitleAndDesc(formStep.toString())

    actualFormStep = newStep

    !newStep.previousElementSibling.getAttribute('data-step')
      ? handleBtn(backBtn, true, 'button--hide')
      : handleBtn(backBtn, false, 'button--hide')
  }, {once: true})
}

function validateInput(e){
	const input = e.target || e
	const msg = invalidMessages[input.name]
	const regex = getRegex(input.name)
	const msgRequired = invalidMessages.required
	const parent = input.parentElement
	const errorClass = 'input--error'

	if(!input.value) 
		return throwError({parent, parentClass: errorClass, msg: msgRequired, input})

	if(input.name === 'name' && characters(input.value) < 3) 
		return throwError({parent, parentClass: errorClass, msg: 'Must be 3 or more characters!', input})

	if(!regex.test(input.value)) 
		return throwError({parent, parentClass: errorClass, msg, input})

	if(input.name === 'email' && verifyUsername(input.value) < 6) 
		return throwError({parent, parentClass: errorClass, msg:'Username must be 6 or more characters!', input})

	updateErrorEl(parent.querySelector('[data-error]'), '')
	parent.classList.remove('input--error')
	input.setAttribute('aria-invalid', 'false')
	return true
}

function updateTitleAndDesc(step){
	const formTitle = gebi('title')
	const formDesc = gebi('description')

	const { title, desc } = titleAndDesc.get(step)
	formTitle.textContent = title
	formDesc.textContent = desc

  if(step === '5'){
    formTitle.hidden = true
    formDesc.hidden = true
  }
}

function updateCardsPrices(price){
	const cards = qsa('.form__card')

  cardBtn.setAttribute('aria-label', `Change to ${cardBtn.dataset.price} plan`)

	cardBtn.dataset.price = price === 'yearly' ? 'monthly' : 'yearly'
	userInfo.yearly = cardBtn.dataset.price === 'yearly' ? true : false

	for (const card of cards) {
		const cardPrice = card.querySelector('.card__price')
		const actualPrice = transformPrice(calculatePrice(extractNumber(cardPrice.textContent)))
		
		cardPrice.textContent = actualPrice
	}

	userInfo.planPrice = extractNumber(actualCard?.querySelector('.card__price').textContent)
}

function updateCardBtn(){
	updateCardsPrices(cardBtn.dataset.price)

	cardBtn.classList.toggle('yearly')

	const freeMonthsEls = d.querySelectorAll('.card__free-months')

	for (const freeMonth of freeMonthsEls) {
		freeMonth.classList.toggle('freemonths--show')
	}
}

function updateIndicator(step){
	const newStepIndicator = qs(`.form__step-indicator[data-step="${step}"]`)

	if(!newStepIndicator) return

	actualStepIndicator.classList.remove('indicator--actual')
	newStepIndicator.classList.add('indicator--actual')

	actualStepIndicator = newStepIndicator
}

function handleCardsClick(card){
	if(card === actualCard){
		card.classList.toggle('card--selected')
	}else if(card !== actualCard){
		actualCard?.classList?.remove('card--selected')
		card.classList.add('card--selected')
	}

  card.setAttribute('aria-checked', card.classList.contains('card--selected') ? 'true' : 'false')
  actualCard?.setAttribute('aria-checked', !actualCard.classList.contains('card--selected') ? 'false' : 'true')

	actualCard = card 
	userInfo.planPrice = extractNumber(actualCard.querySelector('.card__price').textContent)
}

function handleAddonsClick(addon){
	addon.classList.toggle('addon--selected')
  addon.setAttribute('aria-checked', addon.classList.contains('addon--selected') ? 'true' : 'false')
}

function getSelectedAddonsPrice(){
	let addonsPrice = 0

	for (const addon of userInfo.addons) {
		const price = extractNumber(addon[1])
		addonsPrice += price
	}
	userInfo.addonsPrice = addonsPrice
}

function updateSummary(){
	const addonsContainer = gebi('summary-addons')
	const planPrice = gebi('summary-plan-price')
	const selectedPlan = gebi('plan-selected')
	const totalPer = gebi('total-per')
	const totalPrice = gebi('total-price')

	selectedPlan.textContent = `${firstLetter(userInfo.plan)} (${userInfo.yearly ? 'Yearly' : 'Monthly'})`
	planPrice.textContent = transformPrice(userInfo.planPrice)
	totalPer.textContent = `Total (per ${userInfo.yearly ? 'year' : 'month'})`
	totalPrice.textContent = transformPrice(userInfo.planPrice + userInfo.addonsPrice, true)

	const template = gebi('summary-addons-template').content

	// i think it's easier to do this than iterate over each added addon and delete it.
	addonsContainer.innerHTML = `
		<template id='summary-addons-template'>
			<div class='summary__addon'>
				<div class='addon__name' id='summary__addon__name'></div>
				<div class='addon__price'id='summary__addon__price'></div>
			</div>
		</template>
	`

	for (const addon of userInfo.addons) {
		const newAddon = template.cloneNode(true)

		const addonName = newAddon.getElementById('summary__addon__name')
		const addonPrice = newAddon.getElementById('summary__addon__price')

		addonName.textContent = addon[0]
		addonPrice.textContent = addon[1]

		addonsContainer.append(newAddon)
	}
}

const prices = {
	OS: {
		monthly: 1,
		yearly: 10
	},
	LS: {
		monthly: 2,
		yearly: 20
	},
	CP: {
		monthly: 2,
		yearly: 20
	}
}

function updateAddonsPrice(){
	for (const addon of addons) {
		const addonPrice = addon.querySelector('.addon__text__price')
		const newPrice = userInfo.yearly
		? prices[addon.dataset.name].yearly
		: prices[addon.dataset.name].monthly

		addonPrice.textContent = transformPrice(newPrice, true)
	}
}

const nextBtnDefaultText = nextBtn.textContent

function updateNextButton(last){
	if(last){
		nextBtn.textContent = 'Confirm'
		nextBtn.classList.add('button--confirm')
		return
	}

	nextBtn.textContent = nextBtnDefaultText
	nextBtn.classList.remove('button--confirm')
}

function handleFormStepErrorAnimation(formStep){
	formStep.classList.add('form--shake')

	formStep.addEventListener('animationend', e => {
		formStep.classList.remove('form--shake')
	})

  return false
}

function handleFormStepSubmit({formStep, formStepAnimation, nextBtnValue, blur = true}){
	changeActualFormStep(formStep, formStepAnimation)
	updateNextButton(nextBtnValue)

  if(blur){
    d.activeElement.blur()
  }
}

const stepSubmitValidationFunctions = {
  step1: {
    validation: ()=>{
      let validInputs = true

      for (const [key, input] of Object.entries(form)) {

        if(!input.classList.contains('form__input')) continue

        if(!validateInput(input)){
          validInputs = false
        }
      }

      if(validInputs){
        userInfo.name = form.name.value.trim()
        userInfo.email = form.email.value.trim()
        userInfo.phone = form.phone.value.trim()
      }
      
      return validInputs
    }
  },
  step2: {
    validation: ()=>{
      const selectedCard = d.querySelector('.form__card.card--selected')

      if(!selectedCard) return false

      userInfo.plan = selectedCard.dataset.plan
      updateAddonsPrice()

      return true
    }
  },
  step3: {
    validation: ()=>{
      const selectedAddons = addons.filter(addon => addon.classList.contains('addon--selected'))

      userInfo.addons = []

      for (const addon of selectedAddons) {
        const addonTitle = addon.querySelector('.addon__text__title')
        const addonPrice = addon.querySelector('.addon__text__price')

        userInfo.addons.push([addonTitle.textContent, addonPrice.textContent])
      }

      if(selectedAddons.length < 1) return false

      getSelectedAddonsPrice()
      updateSummary()

      return true
    },
    options: {
      nextBtnValue: true
    }
  },
  step4: {
   validation: ()=>{
    if(stepSubmitValidationFunctions.step3.validation()) return true

    return false
    }
  }
}

function getSVF(step){
  return {VF: stepSubmitValidationFunctions[`step${step}`], step: Number(step)}
}

d.addEventListener('DOMContentLoaded', e => {

	d.addEventListener('click', e =>{

    if(e.target === backBtn)
      handleFormStepSubmit({
        formStep: (actualFormStep.dataset.step - 1).toString(),
        formStepAnimation: true})

		if(e.target === cardBtn) updateCardBtn()

		if(e.target === changePlan){
      // this prevents the 3rd formStep from coming from the right after 
      // clicking on the nextBtn after having changed the plan.
      actualFormStep.previousElementSibling.setAttribute('data-position', 'left')

      handleFormStepSubmit({
        formStep: '2',
        formStepAnimation: true,
        blur: false})

      d.querySelector('.form__card.card--selected').focus()
    }

		if(e.target.classList.contains('form__card') || e.target.matches('.form__card *')){
			const card = e.composedPath().find(el => el.classList.contains('form__card'))
			handleCardsClick(card)
		}

		if(e.target.classList.contains('form__addon') || e.target.matches('.form__addon *')){
			const addon = e.composedPath().find(el => el.classList.contains('form__addon'))
			handleAddonsClick(addon)
		}
	})

	form.addEventListener('submit', e =>{
		e.preventDefault()

    const formStep = actualFormStep.dataset.step
    const actualStepSVF = getSVF(formStep)

    const actualStepValidation = actualStepSVF.VF.validation()

    if(actualStepValidation){
      handleFormStepSubmit({
        formStep: Number(formStep) + 1,
        nextBtnValue: actualStepSVF.VF?.options?.nextBtnValue || false,
      })
    }

    if((Number(formStep) + 1) === 5){
      const buttonsParent = gebi('buttons-container')

      buttonsParent.classList.add('form__buttons--hide')
    }

    if(!actualStepValidation) return handleFormStepErrorAnimation(actualFormStep)
	})

	d.addEventListener('keydown', e =>{
		if(e.key === 'Enter'){
			if(e.target.classList.contains('form__card')) handleCardsClick(e.target)
			if(e.target.classList.contains('form__addon')) handleAddonsClick(e.target)
		}
	})

	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) continue

    if(input.value !== '') validateInput(input)

		addEvent(input, 'input', validateInput)
		addEvent(input, 'blur', validateInput)
	}
})

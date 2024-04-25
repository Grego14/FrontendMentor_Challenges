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

function changeActualFormStep(formStep, animationName = 'form--hide-forward'){
	actualFormStep.classList.toggle(animationName)

  actualFormStep.addEventListener('animationend', e => {
    const newStep = qs(`.form__step[data-step="${formStep}"]`)

    if(!newStep) return

    for (const [key, value] of d.querySelectorAll('.form__step').entries()){
      if(value === newStep) continue

      value.classList.remove('form--show', animationName)
      value.setAttribute('aria-hidden', 'true')
    }

    newStep.classList.add('form--show')
    newStep.removeAttribute('aria-hidden')

    updateTitleAndDesc(formStep.toString())
    updateTabIndexs(actualFormStep, newStep)

    actualFormStep = newStep

    !newStep.previousElementSibling.getAttribute('data-step')
      ? handleBtn(backBtn, true, 'button--hide')
      : handleBtn(backBtn, false, 'button--hide')
  })
}

function updateTabIndexs(actualStep, newStep){
	const actualElements = actualStep.querySelectorAll('[tabIndex]')
	const newElements = newStep.querySelectorAll('[tabIndex]')

	for (const actualEl of actualElements) {
		actualEl.setAttribute('tabIndex', '-1')
	}

	for (const newElement of newElements) {
		newElement.setAttribute('tabIndex', '0')
	}
}

function validateForm(){
  let errorFound = false
	for (const [key, input] of Object.entries(form)) {

		if(!input.classList.contains('form__input')) continue

		if(!validateInput(input)){
			errorFound = true
		}
	}
	return errorFound
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

	const icon = parent.querySelector('.form__input__info')

	updateErrorEl(parent.querySelector('[data-error]'), '')
	parent.classList.remove('input--error')
	input.setAttribute('aria-invalid', 'false')
	icon.setAttribute('tabIndex', '-1')
	icon.setAttribute('aria-hidden', 'false')
	return true
}

function handleIconFocus(e){
	const icon = e.target.closest('.form__input__container').querySelector('.form__input__info')

	if(e.target.parentElement.querySelector('.form__input').getAttribute('aria-invalid') === 'false') return

	icon.setAttribute('tabIndex', '0')
}

function handleIconClick(e){

	const icon = e.composedPath().find(el => el.classList.contains('form__input__info'))

	const inputFormat = icon.querySelector('.input__format')

	inputFormat.getAttribute('hidden') === ''
		? inputFormat.removeAttribute('hidden')
		: inputFormat.setAttribute('hidden', '')

	icon.getAttribute('aria-expanded') === 'true'
		? icon.setAttribute('aria-expanded', 'false')
		: icon.setAttribute('aria-expanded', 'true')
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

function updateIndicator(back = false, times = 1){
	if(!back && !actualStepIndicator.nextElementSibling) return

	let newStepIndicator = back
	? actualStepIndicator.previousElementSibling
	: actualStepIndicator.nextElementSibling

	if(!newStepIndicator) return

	if(times > 1){
		for(let i = 1; i < times; i++){
			newStepIndicator = back
				? newStepIndicator.previousElementSibling
				: newStepIndicator.nextElementSibling
		}
	}

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

	actualCard = card 
	userInfo.planPrice = extractNumber(actualCard.querySelector('.card__price').textContent)
}

function validatePlan(){
	const selectedCard = d.querySelector('.form__card.card--selected')

	if(!selectedCard) return false

	userInfo.plan = selectedCard.dataset.plan
	return true
}

function handleAddonsClick(addon){
	addon.classList.toggle('addon--selected')
}

function updateSelectedAddons(){
	const selectedAddons = addons.filter(addon => addon.classList.contains('addon--selected'))

	userInfo.addons = []

	for (const addon of selectedAddons) {
		const addonTitle = addon.querySelector('.addon__text__title')
		const addonPrice = addon.querySelector('.addon__text__price')

		userInfo.addons.push([addonTitle.textContent, addonPrice.textContent])
	}

	return selectedAddons.length
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
}

function handleFormStepSubmit({formStep, formStepAnimation, indicatorValue, nextBtnValue, indicatorTimes}){
	changeActualFormStep(formStep, formStepAnimation)
	updateIndicator(indicatorValue, indicatorTimes)
	updateNextButton(nextBtnValue)

  d.activeElement.blur()
}

function handleInputBlur(e){
	validateInput(e)

  const icon = e.target.parentElement.querySelector('.form__input__info')

	icon.setAttribute('tabIndex', '-1')
}

d.addEventListener('DOMContentLoaded', e => {

	for (const icon of qsa('.form__input__info')) {
		icon.addEventListener('click', handleIconClick)
	}

	d.addEventListener('click', e =>{
    if(e.target === backBtn)
      handleFormStepSubmit({
        formStep: (actualFormStep.dataset.step - 1).toString(),
        formStepAnimation: 'form--hide-backward',
        indicatorValue: true
      })

		if(e.target === cardBtn) updateCardBtn()

		if(e.target === changePlan){
      handleFormStepSubmit({
        formStep: '2',
        formStepAnimation: 'form--hide-backward', 
        indicatorValue: true, 
        indicatorTimes: 2})
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

		if(formStep === '1'){

			if(validateForm()) return handleFormStepErrorAnimation(actualFormStep)

			userInfo.name = form.name.value.trim()
			userInfo.email = form.email.value.trim()
			userInfo.phone = form.phone.value.trim()

			handleFormStepSubmit({formStep: '2'})

		}else if(formStep === '2'){

			if(!validatePlan()) return handleFormStepErrorAnimation(actualFormStep)

			updateAddonsPrice()
			handleFormStepSubmit({formStep: '3'})

		}else if(formStep === '3'){

			if(updateSelectedAddons() < 1) return handleFormStepErrorAnimation(actualFormStep)

			getSelectedAddonsPrice()
			handleFormStepSubmit({formStep: '4', nextBtnValue: true})
			updateSummary()

		}else if(formStep === '4'){
			const buttonsParent = gebi('buttons-container')

			handleFormStepSubmit({formStep: '5'})
			buttonsParent.classList.add('form__buttons--hide')
		}
	})

	d.addEventListener('keydown', e =>{
		if(e.key === 'Enter'){
			if(e.target.classList.contains('form__card')) handleCardsClick(e.target)
			if(e.target.classList.contains('form__addon')) handleAddonsClick(e.target)
      if(e.target.classList.contains('form__input__info')) handleIconClick(e)
		}
	})

  function handleInput(e){
    validateInput(e)
    handleIconFocus(e)
  }

	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) continue

    if(input.value !== '') validateInput(input)

		addEvent(input, 'input', handleInput)
		addEvent(input, 'focus', handleIconFocus)
		addEvent(input, 'blur', handleInputBlur)
	}
})

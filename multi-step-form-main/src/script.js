import * as funcs from './utilities/usefulFunctions.js'

// shortcuts
const d = document;

const form = funcs.gebi('form')
const formTitle = funcs.gebi('title')
const formDesc = funcs.gebi('description')

let actualFormStep = funcs.qs('.form__step.form--show')

const cardBtn = funcs.gebi('button-price')
const cards = funcs.qsa('.form__card')
const cardsError = funcs.gebi('cards-error')
let actualCard;

const changePlan = funcs.gebi('change-plan')

const addons = Array.from(funcs.qsa('.form__addon'))

const buttonsParent = funcs.gebi('buttons-container')
const backBtn = funcs.gebi('back-btn')
const nextBtn = funcs.gebi('next-btn')

const stepIndicators = funcs.qsa('.form__step-indicator')
let actualStepIndicator = funcs.qs('.form__step-indicator.indicator--actual')

const formsValidation = {
	formStep1: false,
	formStep2: false,
	formStep3: false,
	formStep4: false
}

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

function changeActualFormStep(formStep, animationName = 'form--hide-forward'){
	actualFormStep.classList.add(animationName)

	actualFormStep.addEventListener('animationend', e =>{
		actualFormStep.classList.remove('form--show')
		actualFormStep.classList.remove(animationName)
		actualFormStep.setAttribute('aria-hidden', 'true')
		actualFormStep.setAttribute('tabIndex', '-1')

		updateTitleAndDesc(formStep.toString())

		const newStep = funcs.qs(`.form__step[data-step="${formStep}"]`)

		if(!newStep) return

		newStep.classList.add('form--show')
		newStep.removeAttribute('aria-hidden')
		newStep.removeAttribute('tabIndex')

		updateTabIndexs(actualFormStep, newStep)
		actualFormStep = newStep

		!newStep.previousElementSibling.getAttribute('data-step')
			? funcs.handleBtn(backBtn, true, 'button--hide')
			: funcs.handleBtn(backBtn, false, 'button--hide')
	})
}

function updateTabIndexs(actualStep, newStep){
	const actualElements = actualStep.querySelectorAll('[tabIndex]')
	const newElements = newStep.querySelectorAll('[tabIndex]')

	for (const actualEl of actualElements) {
		actualEl.setAttribute('tabIndex', '-1')
	}

	for (const newElement of newElements) {
		newElement.setAttribute('tabIndex', '1')
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
	const value = input.value
	const msg = invalidMessages[input.name]
	const regex = funcs.getRegex(input.name)
	const msgRequired = invalidMessages.required
	const parent = input.parentElement
	const parentClass = 'input--error'

	if(!value) return funcs.throwError({parent, parentClass, msg: msgRequired, invalidEl: input})

	if(input.name === 'name' && funcs.characters(value) < 3) return funcs.throwError({parent, parentClass, msg: 'Must be 3 or more characters!', invalidEl: input})

	if(!regex.test(value)) return funcs.throwError({parent, parentClass, msg, invalidEl: input})

	if(input.name === 'email' && funcs.verifyUsername(value) < 6) return funcs.throwError({parent, parentClass, msg:'Username must be 6 or more characters!', invalidEl: input})

	funcs.updateErrorEl(parent.querySelector('[data-error]'), '')
	parent.classList.remove('input--error')
	input.setAttribute('aria-invalid', 'false')
	return true
}

// extracts the first number of a string
// '$20/yr' -> 20
function extractNumber(string){
	return Number(string?.split(/[^0-9]/).filter(Boolean)[0])
}

function calculatePrice(price){
  return userInfo.yearly ? price * 10 : price / 10
}

function transformPrice(price, plus){
	return `${plus ? '+' : ''}$${price}/${userInfo.yearly ? 'yr' : 'mo'}`
}

function updateTitleAndDesc(step){
	const { title, desc } = titleAndDesc.get(step)
	formTitle.textContent = title
	formDesc.textContent = desc
}

function updateCardsPrices(price){
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

function handleInputBlur(e){
	validateInput(e)
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

// collect all data and updates ui
function updateSummary(){
	const addonsContainer = funcs.gebi('summary-addons')
	const planPrice = funcs.gebi('summary-plan-price')
	const selectedPlan = funcs.gebi('plan-selected')
	const totalPer = funcs.gebi('total-per')
	const totalPrice = funcs.gebi('total-price')

	selectedPlan.textContent = `${funcs.firstLetter(userInfo.plan)} (${userInfo.yearly ? 'Yearly' : 'Monthly'})`
	planPrice.textContent = transformPrice(userInfo.planPrice)
	totalPer.textContent = `Total (per ${userInfo.yearly ? 'year' : 'month'})`
	totalPrice.textContent = transformPrice(userInfo.planPrice + userInfo.addonsPrice, true)

	const template = funcs.gebi('summary-addons-template').content

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

function handleFormStepAnimation(formStep){
	formStep.classList.add('form--shake')

	formStep.addEventListener('animationend', e => {
		formStep.classList.remove('form--shake')
	})
	return true
}

function handleFormStepSubmit({formStep, formStepAnimation, indicatorValue, nextBtnValue, indicatorTimes}){
	changeActualFormStep(formStep, formStepAnimation)
	updateIndicator(indicatorValue, indicatorTimes)
	updateNextButton(nextBtnValue)
}

d.addEventListener('DOMContentLoaded', e => {

	d.addEventListener('click', e =>{
		if(e.target === cardBtn) updateCardBtn()

		if(e.target === changePlan)
			handleFormStepSubmit({
			formStep: '2', 
			formStepAnimation: 'form--hide-backward', 
			indicatorValue: true, 
			indicatorTimes: 2})

		if(e.target === backBtn) {
			handleFormStepSubmit({
				formStep: actualFormStep.dataset.step - 1,
				formStepAnimation: 'form--hide-backward',
				indicatorValue: true,
			})
		}


		if(e.target.classList.contains('form__card') || e.target.matches('.form__card *')){
			const card = e.target === e.target.closest('.form__card') 
				? e.target
				: e.target.closest('.form__card')

			handleCardsClick(card)
		}

		if(e.target.classList.contains('form__addon') || e.target.matches('.form__addon *')){
			const addon = e.target === e.target.closest('.form__addon') 
				? e.target 
				: e.target.closest('.form__addon')

			handleAddonsClick(addon)
		}
	})

	form.addEventListener('submit', e =>{
		e.preventDefault()

		const formStep = actualFormStep.dataset.step

		if(formStep === '1'){

			if(validateForm()) return handleFormStepAnimation(actualFormStep)

			userInfo.name = form.name.value.trim()
			userInfo.email = form.email.value.trim()
			userInfo.phone = form.phone.value.trim()

			handleFormStepSubmit({formStep: '2'})

		}else if(formStep === '2'){

			if(!validatePlan()) return handleFormStepAnimation(actualFormStep)

			updateAddonsPrice()
			handleFormStepSubmit({formStep: '3'})

		}else if(formStep === '3'){

			if(updateSelectedAddons() < 1) return handleFormStepAnimation(actualFormStep)

			getSelectedAddonsPrice()
			handleFormStepSubmit({formStep: '4', nextBtnValue: true})
			updateSummary()

		}else if(formStep === '4'){
			handleFormStepSubmit({formStep: '5'})
			buttonsParent.classList.add('form__buttons--hide')
		}
	})

	d.addEventListener('keydown', e =>{
		if(e.key === 'Enter'){
			if(e.target.classList.contains('form__card')) handleCardsClick(e.target)
			if(e.target.classList.contains('form__addon')) handleAddonsClick(e.target)
		}
	})

	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) return

		funcs.addEvent(input, 'blur', handleInputBlur)
		funcs.addEvent(input, 'input', validateInput)
	}
})

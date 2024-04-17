import * as funcs from './utilities/usefulFunctions.js'

// shortcuts
const d = document;

const form = funcs.gebi('form')
const formTitle = funcs.gebi('title')
const formDesc = funcs.gebi('description')

let actualFormStep = funcs.qs('.form__step.show')

const cardBtn = funcs.gebi('button-price')
const cards = funcs.qsa('.form__card')
let actualCard;

const changePlan = funcs.gebi('change-plan')

const addons = Array.from(funcs.qsa('.form__addon'))

const backBtn = funcs.gebi('back-btn')
const nextBtn = funcs.gebi('next-btn')

const stepIndicators = funcs.qsa('.form__step-indicator')
let actualStepIndicator = funcs.qs('.form__step-indicator.actual')

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

function handleBtns(btn, hide){
	hide ? btn.classList.add('hide')
		: btn.classList.remove('hide')
}

function changeActualFormStep(formStep){
	actualFormStep.classList.remove('show')

	updateTitleAndDesc(formStep.toString())

	const newStep = funcs.qs(`.form__step[data-step="${formStep}"]`)

	if(!newStep) return

	newStep.classList.add('show')

	actualFormStep = newStep

	// remove the backBtn if the previousElement isn't a step
	!newStep.previousElementSibling.getAttribute('data-step')
		? handleBtns(backBtn, true)
		: handleBtns(backBtn, false)
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

function throwError(input, msg){
	updateError(input, msg)
	input.classList.add('input--error')
	return false
}

function validateInput(e){
	const input = e.target || e
	const value = input.value
	const msg = invalidMessages[input.name]
	const regex = funcs.getRegex(input.name)
	const msgRequired = invalidMessages.required

	if(!value) return throwError(input, msgRequired)

	if(input.name === 'name' && funcs.characters(value) < 3) return throwError(input, 'Must be 3 or more characters!')

	if(!regex.test(value)) return throwError(input, msg)

	if(input.name === 'email' && funcs.verifyUsername(value) < 6) return throwError(input, 'Username must be 6 or more characters! (text before @)')

	updateError(input)
	input.classList.remove('input--error')
	input.parentElement.querySelector('.form__input__error').classList.remove('show')
	return true
}

function updateError(el, msg){
	const inputError = el.parentElement.querySelector('.form__input__error')
	inputError.classList.add('show')
	inputError.textContent = msg || ''
}

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
	console.log(step, 'from updateTitleAndDesc')
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

function updateCards(){
	updateCardsPrices(cardBtn.dataset.price)

	cardBtn.classList.toggle('yearly')

	const freeMonthsEls = d.querySelectorAll('.card__free-months')

	for (const freeMonth of freeMonthsEls) {
		freeMonth.classList.toggle('show')
	}
}

function updateIndicator(back = false){
	// don't update if is the last
	if(!back && !actualStepIndicator.nextElementSibling) return

	actualStepIndicator.classList.remove('actual')

	if(back){
		actualStepIndicator?.previousElementSibling?.classList.add('actual')
		actualStepIndicator = actualStepIndicator?.previousElementSibling
		return
	}

	actualStepIndicator?.nextElementSibling?.classList.add('actual')
	actualStepIndicator = actualStepIndicator?.nextElementSibling
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

	// reset before updating
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

	// get template and make a addon for each addon in userInfo.addons
	const template = funcs.gebi('summary-addons-template').content

	// reset the container, before adding new addons...
	// prevents adding the same addons again
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
		nextBtn.classList.add('confirm')
		return true
	}

	nextBtn.textContent = nextBtnDefaultText
	nextBtn.classList.remove('confirm')
}

d.addEventListener('DOMContentLoaded', e => {
	d.addEventListener('click', e =>{
		if(e.target === cardBtn) updateCards()

		if(e.target === changePlan) changeActualFormStep('2')

		if(e.target === backBtn) {
			changeActualFormStep(actualFormStep.dataset.step - 1)
			updateIndicator(true)
			updateNextButton()
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

		if(actualFormStep.dataset.step === '1'){

			if(validateForm()) return

			userInfo.name = form.name.value.trim()
			userInfo.email = form.email.value.trim()
			userInfo.phone = form.phone.value.trim()

			changeActualFormStep('2')
			updateIndicator()
			updateNextButton()
		}else if(actualFormStep.dataset.step === '2'){

			if(!validatePlan()) return

			updateAddonsPrice()
			changeActualFormStep('3')
			updateIndicator()
			updateNextButton()
		}else if(actualFormStep.dataset.step === '3'){

			if(updateSelectedAddons() < 1) return

			getSelectedAddonsPrice()
			changeActualFormStep('4')
			updateIndicator()
			updateSummary()
			updateNextButton(true)

		}else if(actualFormStep.dataset.step === '4'){
			changeActualFormStep('5')
			backBtn.classList.add('hide')
			nextBtn.classList.add('hide')
		}
	})

	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) return

		funcs.addEvent(input, 'blur', handleInputBlur)
		funcs.addEvent(input, 'input', validateInput)
	}
})

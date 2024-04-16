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

const addons = Array.from(funcs.qsa('.form__addon'))

const backBtn = funcs.gebi('back-btn')
const nextBtn = funcs.gebi('next-btn')

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

function handleBtns(btn, hide){
	hide ? btn.classList.add('hide')
		: btn.classList.remove('hide')
}

function changeActualFormStep(){
	actualFormStep.nextElementSibling.classList.add('show')
	actualFormStep.classList.remove('show')

	actualFormStep.previousElementSibling
	? handleBtns(backBtn, false)
	: handleBtns(backBtn, true)

	actualFormStep = actualFormStep.nextElementSibling
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
	return true
}

function updateError(el, msg){
	const inputError = el.parentElement.querySelector('.form__input__error')
	inputError.textContent = msg || ''
}

function getPrice({element, total, convert = true}){
	const price = Number(element?.textContent?.split(/[^0-9]/).filter(Boolean)[0]) || Number(element?.split(/[^0-9]/).filter(Boolean)[0])

	if(!price) return

	// returns the converted price, but does not multiply or divide, format: $ + price + / + (yr || mo)
	if((total && !convert) || (!total && !convert)) return `$${price}/${userInfo.yearly ? 'yr' : 'mo'}`

	// returns the price 
	if(total) return price

	// returns the price converted, but multiplies or divides, format: $ + (price (* || /) 10) + / + (yr || mo)
	if(convert) return `$${userInfo.yearly ? price * 10 : price / 10}/${userInfo.yearly ? 'yr' : 'mo'}`
}

function updateCardsPrices(price){
	cardBtn.dataset.price = price === 'yearly' ? 'monthly' : 'yearly'
	userInfo.yearly = cardBtn.dataset.price === 'yearly' ? true : false

	for (const card of cards) {
		const cardPrice = card.querySelector('.card__price')
		const actualPrice = getPrice({element: cardPrice})
		
		cardPrice.textContent = actualPrice
	}

	userInfo.planPrice = getPrice({element: actualCard?.querySelector('.card__price'), convert: false})
}

function updateCards(){
	updateCardsPrices(cardBtn.dataset.price)

	cardBtn.classList.toggle('yearly')

	const freeMonthsEls = d.querySelectorAll('.card__free-months')

	for (const freeMonth of freeMonthsEls) {
		freeMonth.classList.toggle('show')
	}
}

function handleCardsClick(card){
	if(card === actualCard){
		card.classList.toggle('card--selected')
	}else if(card !== actualCard){
		actualCard?.classList?.remove('card--selected')
		card.classList.add('card--selected')
	}

	actualCard = card 
	userInfo.planPrice = getPrice({element: actualCard.querySelector('.card__price'), total: true})
}

function updatePlan(){
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
		const price = getPrice({element: addon[1], total: true})
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
	planPrice.textContent = `${getPrice({element: userInfo.planPrice.toString(), convert: false})}`
	totalPer.textContent = `Total (per ${userInfo.yearly ? 'year' : 'month'})`
	totalPrice.textContent = getPrice({element: (userInfo.planPrice + userInfo.addonsPrice).toString(), convert: false})

	// get template and make a addon for each addon in userInfo.addons
	const template = funcs.gebi('summary-addons-template').content

	for (const addon of userInfo.addons) {
		const newAddon = template.cloneNode(true)

		const addonName = newAddon.getElementById('summary__addon-name')
		const addonPrice = newAddon.getElementById('summary__addon-price')

		addonName.textContent = addon[0]
		addonPrice.textContent = addon[1]

		addonsContainer.append(newAddon)
	}
}

function updateAddonsPrice(){
	for (const addon of addons) {
		const addonPrice = addon.querySelector('.addon__text__price')
		const price = getPrice({element: addonPrice, total: true, convert: false})

		addonPrice.textContent = price
	}
}

d.addEventListener('DOMContentLoaded', e => {
	d.addEventListener('click', e =>{
		if(e.target === cardBtn) updateCards()

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

			changeActualFormStep()
			console.log(userInfo)
		}else if(actualFormStep.dataset.step === '2'){
			if(!updatePlan()) return

			updateAddonsPrice()
			changeActualFormStep()
			console.log(userInfo)
		}else if(actualFormStep.dataset.step === '3'){

			if(updateSelectedAddons() < 1) return

			getSelectedAddonsPrice()
			changeActualFormStep()
			updateSummary()
			console.log(userInfo)
		}
	})

	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) return

		funcs.addEvent(input, 'blur', handleInputBlur)
		funcs.addEvent(input, 'input', validateInput)
	}
})

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

const addons = funcs.qsa('.form__addon')
let actualAddons = []

const backBtn = funcs.gebi('back-btn')
const nextBtn = funcs.gebi('next-btn')

const userInfo = {
	name: '',
	email: '',
	phone: '',
	plan: '',
	planPrice: '',
	yearly: false
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

function getPrice(element){
	return Number(element.textContent.split(/[^0-9]/).filter(Boolean)[0])
}

function updateCardsPrices(price){
	for (const card of cards) {

		const cardPrice = card.querySelector('.card__price')
		const actualPrice = getPrice(cardPrice)

		const prices = {
			yearly: actualPrice * 10,
			monthly: actualPrice / 10,
		}
		
		cardPrice.textContent = price === 'monthly'
		? `$${prices.yearly}/yr`
		: `$${prices.monthly}/mo`;
	}

	cardBtn.dataset.price = price === 'yearly' ? 'monthly' : 'yearly'
	userInfo.yearly = cardBtn.dataset.price === 'yearly' ? true : false
	userInfo.planPrice = getPrice(actualCard.querySelector('.card__price'))
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
	userInfo.planPrice = getPrice(actualCard.querySelector('.card__price'))
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

function handleAddonsClick(card){
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
		console.log(e.target)
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

			changeActualFormStep()
			console.log(userInfo)
		}
	})

	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) return

		funcs.addEvent(input, 'blur', handleInputBlur)
		funcs.addEvent(input, 'input', validateInput)
	}
})

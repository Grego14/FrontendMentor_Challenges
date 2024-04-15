import * as funcs from './utilities/usefulFunctions.js'

// shortcuts
const d = document;

const form = funcs.gebi('form')
const formTitle = funcs.gebi('title')
const formDesc = funcs.gebi('description')

let actualFormStep = funcs.qs('.form__step.show')

const cardBtn = funcs.gebi('button-price')
const cards = funcs.qsa('.form__card')
let actualCard = funcs.qs('.form__card.card--selected')

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
	if(btn){
		hide ? btn.classList.add('hide')
		: btn.classList.remove('hide')
	}
}

function changeActualFormStep(){
	actualFormStep.nextElementSibling.classList.add('show')
	actualFormStep.classList.remove('show')

	actualFormStep.previousElementSibling
	? handleBtns(backBtn, true)
	: handleBtns(backBtn, false)

	actualFormStep = actualFormStep.nextElementSibling
}

function validateForm(e){
	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) return
		validateInput(input)
	}
}

function throwError(input, msg){
	updateError(input, msg)
	input.classList.add('input--error')
	return false
}

function validateInput(e){
	const input = e.target
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

function updateCardsPrices(price){
	for (const card of cards) {

		const cardPrice = card.querySelector('.card__price')
		const actualPrice = cardPrice.textContent.split(/[^0-9]/).filter(Boolean)[0]
		
		cardPrice.textContent = price === 'monthly'
		? `$${actualPrice * 10}/yr`
		: `$${actualPrice / 10}/mo`;

		userInfo.planPrice = cardPrice.textContent
	}

	cardBtn.dataset.price = price === 'yearly' ? 'monthly' : 'yearly'
	userInfo.yearly = cardBtn.dataset.price === 'yearly' ? true : false
}

function updateCards(){
	updateCardsPrices(cardBtn.dataset.price)

	cardBtn.classList.toggle('yearly')

	const freeMonthsEls = d.querySelectorAll('.card__free-months')

	for (const freeMonth of freeMonthsEls) {
		freeMonth.classList.toggle('show')
	}
}

function handleCardsClick(e){
	if(e.target === actualCard){
		e.target.classList.toggle('card--selected')
	}else if(e.target !== actualCard){
		actualCard?.classList?.remove('card--selected')
		e.target.classList.add('card--selected')
	}

	actualCard = e.target
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

function handleInputFocus(e){
	updateError(e.target)
}

d.addEventListener('DOMContentLoaded', e =>{

	d.addEventListener('click', e =>{
		if(e.target === cardBtn) updateCards()

		if(e.target.classList.contains('form__card')){
			handleCardsClick(e)
		}
		//console.log(e.target)
	})

	for (const [key, input] of Object.entries(form)) {

		if(!input.classList.contains('form__input')) return

		funcs.addEvent(input, 'blur', handleInputBlur)
		funcs.addEvent(input, 'focus', handleInputFocus)
		funcs.addEvent(input, 'input', validateInput)
	}

	form.addEventListener('submit', e =>{
		e.preventDefault()

		if(actualFormStep.dataset.step === '1'){

			if(!validateForm()) return

			userInfo.name = form.name.value.trim()
			userInfo.email = form.email.value.trim()
			userInfo.phone = form.phone.value.trim()

			changeActualFormStep()

		}else if(actualFormStep.dataset.step === '2'){
			if(!updatePlan()) return
			changeActualFormStep()
		}
	})
})

import * as funcs from './utilities/usefulFunctions.js'

const regexs = {
	email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
	name: /^[a-zA-Z\s.'-]{3,}$/ ,
	phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
}

// shortcuts
const d = document;

const form = funcs.gebi('form')
const formTitle = funcs.gebi('title')
const formDesc = funcs.gebi('description')

let actualFormStep = funcs.qs('.form__step.show')

const cardBtn = funcs.gebi('button-price')
const cards = funcs.qsa('.form__card')
let actualCard = funcs.qs('.form__card.card--selected')

const userInfo = {
	name: '',
	email: '',
	phone: '',
	plan: '',
	planPrice: '',
	yearly: false
}

function changeActualFormStep(){
	actualFormStep.nextElementSibling.classList.add('show')
	actualFormStep.classList.remove('show')

	actualFormStep = actualFormStep.nextElementSibling
}

const invalidMessages = {
	name:  'Invalid Name',
	email: 'Invalid Email',
	phone: 'Invalid Phone',
	required: 'This field is required'
}

function validateForm(e){

	if(!e.target.classList.contains('form__input')) return

	validateInput({
		input: e.target,
		value: e.target.value, 
		msg: invalidMessages[e.target.name], 
		regex: getRegex(e.target.name), 
		msgRequired: invalidMessages.required
	})
}

function throwError(input, msg){
	updateError(input, msg)
	return false
}

function validateInput({input, value, msg, regex, msgRequired}){
	if(!value) throwError(input, msgRequired)

	if(input.name === 'name' && funcs.characters(value) < 3) throwError(input, 'Must be 3 or more characters!')

	if(!regex.test(value)) throwError(input, msg)

	if(input.name === 'email' && verifyUsername(value) < 6) throwError(input, 'Must be 6 or more characters!')

	updateError(input)
	return true
}

function updateError(el, msg){
	const inputError = el.parentElement.querySelector('.form__input__error')
	inputError.textContent = msg || ''
}

function validateEmail(email){
	emailRegex.test(email) ? updateError(form.email) : updateError(form.email, 'Invalid Email')
}

function validatePhone(phone){
	phoneRegex.test(phone) ? updateError(form.phone) : updateError(form.phone, 'Invalid Phone')
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
	console.log(userInfo)
	return true
}

function handleInputBlur(e){
	validateForm(e)
}

function handleInputFocus(e){
	updateError(e.target)
}

d.addEventListener('DOMContentLoaded', e =>{

	for (const card of cards) {
		card.addEventListener('click', handleCardsClick)
	}

	d.addEventListener('click', e =>{
		if(e.target === cardBtn) updateCards()
	})

	d.addEventListener('input', e =>{
		validateForm(e)
	})


	for (const [key, input] of Object.entries(form)) {
		if(!input.classList.contains('form__input')) return
		addEvent(input, 'blur', handleInputBlur)
		addEvent(input, 'focus', handleInputFocus)
	}

	form.addEventListener('submit', e =>{
		e.preventDefault()
		if(actualFormStep.dataset.step === '1'){
			userInfo.name = form.name.value
			userInfo.email = form.email.value
			userInfo.phone = form.phone.value
			changeActualFormStep()
		}else if(actualFormStep.dataset.step === '2'){
			if(!updatePlan()) return
			changeActualFormStep()
		}
	})
})

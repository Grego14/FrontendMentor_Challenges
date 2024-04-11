const d = document;
const getElId = (id) => d.getElementById(id)

const tipAmount = getElId('tip-amount')
const totalAmount = getElId('total-amount')
const customTip = getElId('tip-custom')
const resetBtn = getElId('reset-btn')
const billInput = getElId('bill')
const peopleInput = getElId('people')
const tips = [ ...d.querySelectorAll('.splitter__tip') ]
let selectedTip = tips.filter(tip => tip.classList.contains('selected'))
const errEls = d.querySelectorAll('.error-element')

const UI = {
	tipAmount: 0,
	totalAmount: 0,
	bill: '',
	people: 1,
	tip: 0
}

function updateUI(){
	tipAmount.textContent = UI.tipAmount
	totalAmount.textContent = UI.totalAmount
	peopleInput.value = UI.people
	billInput.value = UI.bill
}

function personAmount(){
	return UI.bill / UI.people
}

function updateValues(){
	UI.tipAmount = Number(personAmount() / 100 * UI.tip)
	UI.totalAmount = Number(personAmount() + UI.tipAmount)

	updateUI()
}

function updateValue(k,v){
	UI[k] = Number(v)
	updateValues()
}

function handleTips(e){
	if(e.target.matches('.splitter__tip') && e.target.id !== 'tip-custom'){

		selectedTip?.classList?.remove('selected')
		e.target.classList.toggle('selected')

		selectedTip = e.target

		updateValue('tip', e.target.id)
	} 
}

function handleCustomTip(e){
	if(e.target.id === 'tip-custom'){
		selectedTip?.classList?.remove('selected')

		updateValue('tip', e.target.id)

		// use the las selectedTip if the value is invalid
		if(e.target.value <= 0 || !/^[0-9]+$/.test(e.target.value)){
			selectedTip?.classList?.add('selected')
			updateValue('tip', e.target.id)
		}
	}
}

function validateNumber(value){
	return !/^[^0-9]+$/.test(value)
}

function setError(el, err){
	el.textContent = err
}

function validate(target, el){
	const value = target.value

	el.classList.remove('show')

	if(value <= 0) {
		setError(el, 'Can\'t be zero')
		el.classList.add('show')
	}

	if(!validateNumber(value)) {
		setError(el, 'Value isn\'t a number')
		el.classList.add('show')
	}

	return validateNumber(value) && value > 0
}

function handleBill(e){
	if(validate(e.target, errEls[0])){
		updateValue('bill', e.target.value)
		e.target.classList.remove('input--error')
		setError(errEls[0], '')
	}else{
		e.target.classList.add('input--error')
		updateValue('bill', 0)
	}
}

function handlePeople(e){
	if(validate(e.target, errEls[1])){
		updateValue('people', e.target.value)
		e.target.classList.remove('input--error')
		setError(errEls[1], '')
	}else{
		e.target.classList.add('input--error')
		updateValue('people', 1)
	}
}

function handleReset(e){
	if(e.target === resetBtn){

		const resetAllValues = {
			tipAmount: '0.00',
			totalAmount: '0.00',
			bill: 0,
			people: 0,
			tip: 0,
		}

		for (const [key, value] of Object.entries(resetAllValues)) {
			UI[key] = value
		}

		updateUI()
	}
}

d.addEventListener('DOMContentLoaded', e =>{
	d.addEventListener('click', e =>{
		handleTips(e)
		handleReset(e)
	})

	d.addEventListener('input', e =>{
		handleCustomTip(e)
		if(e.target.id === 'bill') handleBill(e)
		if(e.target.id === 'people') handlePeople(e)
	})
})

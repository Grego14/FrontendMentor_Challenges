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
	bill: 1,
	people: 1,
	tip: 0
}

function updateUI(){
	tipAmount.textContent = `$${Number(UI.tipAmount).toFixed(2)}`
	totalAmount.textContent = `$${Number(UI.totalAmount).toFixed(2)}`
	peopleInput.value = UI.people
	billInput.value = UI.bill
}

function personAmount(){
	return Number(UI.bill) / Number(UI.people)
}

function getTipAmount(){
	return Number(personAmount() / 100 * (UI.tip))
}

function getTotalAmount(){
	return Number(personAmount()) + Number(UI.tipAmount)
}

function updateValues(){
	UI.tipAmount = getTipAmount()
	UI.totalAmount = getTotalAmount()

	updateUI()
}

function updateValue(k,v){
	UI[k] = v
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

		updateValue('tip', e.target.value)

		// use the las selectedTip if the value is invalid
		if(e.target.value <= 0 || !/^[0-9]+$/.test(e.target.value)){
			selectedTip?.classList?.add('selected')
			updateValue('tip', selectedTip?.id)
		}
	}
}

function validateNumber(value, regex){
	return regex ? regex.test(value) : /^[0-9]+$/.test(value)
}

function setError(el, err){
	el.textContent = err
}

function validate(target, el, customRegex){
	const value = target.value

	el.classList.remove('show')

	if(value <= 0) {
		setError(el, 'Can\'t be zero')
		el.classList.add('show')
	}

	if(!validateNumber(value, customRegex)) {
		setError(el, 'Value isn\'t a number')
		el.classList.add('show')
	}

	return validateNumber(value, customRegex) && value > 0
}

function handleBill(e){
	const customRegex = /^[0-9\.]+$/

	if(validate(e.target, errEls[0], customRegex)){
		updateValue('bill', e.target.value)
		e.target.classList.remove('input--error')
		setError(errEls[0], '')
	}else{
		e.target.classList.add('input--error')
		updateValue('bill', '')
	}
}

function handlePeople(e){
	if(validate(e.target, errEls[1])){
		updateValue('people', e.target.value)
		e.target.classList.remove('input--error')
		setError(errEls[1], '')
	}else{
		e.target.classList.add('input--error')
	}
}

function handleReset(e){
	if(e.target === resetBtn){

		const resetAllValues = {
			tipAmount: 0,
			totalAmount: 0,
			bill: '',
			people: 1,
			tip: 0,
		}

		for (const [key, value] of Object.entries(resetAllValues)) {
			UI[key] = value
		}

		customTip.value = ''
		selectedTip?.classList?.remove('selected')
		selectedTip = null

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

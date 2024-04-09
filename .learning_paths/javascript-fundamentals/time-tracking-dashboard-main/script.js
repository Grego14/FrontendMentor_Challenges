const d = document;
const w = window;

async function getData(){
	const req = new Request('data.json')
	const res = await fetch(req)
	const loadingEl = d.querySelector('.loading')

	const data = await res.json()

	manageCards(data)
}

const actualTimes = d.querySelectorAll('.card__actual-time')
const lastTimes = d.querySelectorAll('.card__last-time')
let actualSelectedButton = d.querySelector('.btn:not(.card__btn).selected')

if(!w.localStorage.getItem('time')) w.localStorage.setItem('time', actualSelectedButton.dataset.time)

function manageCards(data){

	// update the button.. otherwise it will use the 
	// button with the selected class in the markup
	d.querySelector('.btn:not(.card__btn).selected').classList.remove('selected')
	d.querySelector(`.btn:not(.card__btn)[data-time=${w.localStorage.getItem('time')}]`).classList.add('selected')
	actualSelectedButton = d.querySelector('.btn:not(.card__btn).selected')

	updateCardTime(w.localStorage.getItem('time'), updateCardText)

	function updateCardTime(newTime, callback){
		for (const [key, value] of actualTimes.entries()) {
			value.dataset.time = newTime
			updateCardText({element: value, time: data[key].timeframes[value.dataset.time].current, key})
		}
	}

	function updateCardText({element, time, key}){
		actualSelectedButton = d.querySelector('.btn:not(.card__btn).selected')

		const buttonTime = actualSelectedButton.dataset.time
		element.textContent = `${time}hrs`
		element.dataset.time = buttonTime

		const buttonTimeOutput = buttonTime === 'daily' ? 'Day' 
		: buttonTime === 'weekly' ? 'Week' 
		: buttonTime === 'monthly' ? 'Month' 
		: buttonTime

		w.localStorage.setItem('time2', buttonTimeOutput)

		lastTimes[key].textContent = `Last ${w.localStorage.getItem('time2') || buttonTimeOutput} - ${data[key].timeframes[element.dataset.time].previous}hrs`
	}

	d.getElementById('loading').classList.add('rev-opacity')

	setTimeout(() => {
		d.getElementById('loading').style.display = 'none'
	}, 300);

	d.addEventListener('click', e =>{
		if(e.target.matches('.btn:not(.card__btn)')){
			if(e.target.classList.contains('selected')){
				return
			}

			e.target.classList.add('selected')
			actualSelectedButton.classList.remove('selected')

			updateCardTime(e.target.dataset.time)
		  w.localStorage.setItem('time', e.target.dataset.time)
		}
	})
}

d.addEventListener('DOMContentLoaded', e =>{
	getData()
})

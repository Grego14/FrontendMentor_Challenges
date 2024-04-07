const d = document;
const form = d.getElementById('form')
const formError = d.getElementById('form-error')
const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i

let formData = new FormData(form)

function emailUsername(string){
	return string.toString().split('@')[0]
}

function handleErrors(value){
	return emailUsername(value).length < 6 || emailUsername(value).length > 64 || !regex.test(value) || value.length > 254
}

d.addEventListener('input', e =>{
	e.preventDefault()
	formData = new FormData(form)
	const [email] = formData.entries(); // email[0] => input.name, email[1] => input.value

	if(handleErrors(email[1])){
		formError.classList.add('show')
		form.classList.add('error')
	}else{ 
		formError.classList.remove('show')
		form.classList.remove('error')
	}

	if(email[1].length === 0){
		formError.classList.remove('show')
		form.classList.remove('error')
	}

})

const emailOutput = d.getElementById('email-output')
const successCard = d.getElementById('success-card')

form.addEventListener('submit', function(e){
	e.preventDefault()

	if(!handleErrors(e.target.email.value)){
		emailOutput.innerHTML = `&nbsp;${e.target.email.value}`
		form.classList.add('success')

		form.classList.add('success')
		successCard.classList.add('show')
	}

	successCard.querySelector('.form__button').addEventListener('click', e =>{
		successCard.classList.remove('show')
		form.classList.remove('success')
		this.email.setAttribute('disabled', '')
		this.button.setAttribute('disabled', '')
		this.button.value = 'Confirm your subscription!'
	})
})

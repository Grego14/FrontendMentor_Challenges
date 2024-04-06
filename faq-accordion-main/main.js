const d = document
const accordions = d.querySelectorAll('.accordion__item')
let actualOpenedText = d.querySelector('.accordion__text:not(.text--closed)')

const iconClosedUrl = './assets/images/icon-plus.svg'
const iconOpenedUrl = './assets/images/icon-minus.svg'

d.addEventListener('click', e => {

	if(!e.target.closest('.accordion__title')) return

	const closestText = e.target.closest('.accordion__item').querySelector('.accordion__text')
	const actualOpenedIcon = actualOpenedText.closest('.accordion__item').querySelector('.accordion__icon')
	const closestIcon = closestText.closest('.accordion__item').querySelector('.accordion__icon')

	const updateIcon = (icon) => { icon.src = icon.getAttribute('src') === iconOpenedUrl ? iconClosedUrl : iconOpenedUrl }

	if(closestText === actualOpenedText) {
		closestText.classList.toggle('text--closed')
		updateIcon(closestIcon)
	}

	if(closestText !== actualOpenedText){
		actualOpenedText.classList.add('text--closed')
		closestText.classList.remove('text--closed')

		actualOpenedText.classList.contains('text--closed') 
		&& actualOpenedIcon.getAttribute('src') === iconClosedUrl 
			? null 
			: updateIcon(actualOpenedIcon)

		updateIcon(closestIcon)
	}

	actualOpenedText = closestText

})

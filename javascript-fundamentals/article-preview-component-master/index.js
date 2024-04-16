const button = document.getElementById('share-button')
const shareLinks = document.getElementById('share-links')

button.addEventListener('click', function(e){
	this.classList.toggle('active')
	shareLinks.classList.toggle('active')
})

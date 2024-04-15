const d = document;
const gebi = id => d.getElementById(id);
const qs = s => d.querySelector(s);
const qsa = s => d.querySelectorAll(s);

const regexs = {
	email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i,
	name: /^[a-zA-Z\s.'-]{3,}$/ ,
	phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
}

// returns the length of characters in a string (no whitespaces)
function characters(string) {
	return string.replace(/\s/g, '').length
}

// returns the length of the username of an email (the text before @)
function verifyUsername(string) {
	return characters(string.split('@')[0])
}

function getRegex(name){
	return regexs[name]
}

function addEvent(element, event, handler){
	element.addEventListener(event, handler)
}

export { characters, verifyUsername, getRegex, addEvent, gebi, qs, qsa }

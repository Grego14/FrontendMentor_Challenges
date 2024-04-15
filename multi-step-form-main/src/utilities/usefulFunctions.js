const gebi = id => d.getElementById(id);
const qs = s => d.querySelector(s);
const qsa = s => d.querySelectorAll(s);

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

export default { characters, verifyUsername, getRegex, addEvent, gebi, qs, qsa }

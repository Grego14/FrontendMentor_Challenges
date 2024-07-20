const d = document
const menu = d.getElementById('menu')
const menuBtn = d.getElementById('menu-btn')
const slider = d.getElementById('slider')
const sliderLeft = d.getElementById('slider-btn-left')
const sliderRight = d.getElementById('slider-btn-right')
const nav = menu.closest('nav')
const sections = d.getElementById('slider')

const isDesktop = window.matchMedia('(min-width: 60rem)')
const icons = ['./assets/images/icon-hamburger.svg', './assets/images/icon-close.svg']

// prevent scroll bugs when changing from landscape to portrait
function updateScroll(){
  sections.scrollTo({
    left: 0,
    behavior: "smooth",
  })
}

d.addEventListener('DOMContentLoaded', e => {
  handleMenu(isDesktop)
  updateScroll()

  isDesktop.addEventListener('change', (e) => {
    handleMenu(e)
    updateScroll()
  })

  d.addEventListener('click', e => {
    if (e.target === menuBtn) 
      handleIconClick({
        menu, 
        menuBtn, 
        nav, 
        icons
      })

    if(e.target === sliderLeft || e.target === sliderRight) 
      slideSections({
        e, 
        sectionsParent: sections,
        prevBtn: sliderLeft,
        nextBtn: sliderRight
      })
  })
})

function handleIconClick({menu, menuBtn, nav, icons}){
  let menuBtnImage = menuBtn.querySelector('img')
  menuBtnImage.setAttribute('src', menuBtnImage.getAttribute('src') === icons[0] ? icons[1] : icons[0])

  menu.setAttribute('aria-expanded', menu.getAttribute('aria-expanded') === 'false' ? 'true' : 'false')
  nav.classList.toggle('room__nav--expanded')
}

function handleMenu(){

  if(!isDesktop.matches) {
    menu.setAttribute('aria-expanded', 'false')
    menuBtn.querySelector('img').setAttribute('src', icons[0])
    return
  }

  nav.classList.remove('room__nav--expanded')
  menu.setAttribute('aria-expanded', 'true')
}

function slideSections({e, sectionsParent, nextBtn, prevBtn}){
  let sectionVisible = [...sectionsParent.children].find(section => !section.getAttribute('aria-hidden'))

  let sectionToScroll = (() =>{

    if(e.target === nextBtn && sectionVisible)
      return sectionVisible.nextElementSibling 
        ? sectionVisible.nextElementSibling 
        : sectionsParent.firstElementChild

    if(e.target === prevBtn && sectionVisible)
      return sectionVisible.previousElementSibling 
        ? sectionVisible.previousElementSibling 
        : sectionsParent.lastElementChild
  })()

  sectionVisible?.setAttribute('aria-hidden', 'true')
  sectionToScroll?.removeAttribute('aria-hidden')
  sectionToScroll?.scrollIntoView({block: 'nearest'})
}

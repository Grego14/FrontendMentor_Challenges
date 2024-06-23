# Frontend Mentor - FAQ accordion solution

This is a solution to the [FAQ accordion challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/faq-accordion-wyfFdeBwBz). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

### The challenge

Users should be able to:

- Hide/Show the answer to a question when the question is clicked ✅
- Navigate the questions and hide/show answers using keyboard navigation alone ✅
- View the optimal layout for the interface depending on their device's screen size ✅
- See hover and focus states for all interactive elements on the page ✅

### Screenshot

![Screenshot](../screenshots/faq-accordion-main.webp)

### Links

[Solution](https://github.com/Grego14/FrontendMentor_Challenges/tree/main/faq-accordion-main) | [Live Site](https://grego14.github.io/FrontendMentor_Challenges/faq-accordion-main/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox


### What I learned

I learned about the :has selector.
```css
.accordion__item:not(:has(.text--open)) {
    /*...*/
}
```

## Author

- Frontend Mentor - [@Grego14](https://www.frontendmentor.io/profile/Grego14)

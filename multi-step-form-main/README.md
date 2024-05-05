# Frontend Mentor - Multi-step form solution

This is a solution to the [Multi-step form challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Complete each step of the sequence ✅
- Go back to a previous step to update their selections ✅
- See a summary of their selections on the final step and confirm their order ✅
- View the optimal layout for the interface depending on their device's screen size ✅
- See hover and focus states for all interactive elements on the page ✅
- Receive form validation messages if: ✅
  - A field has been missed ✅
  - The email address is not formatted correctly ✅
  - A step is submitted, but no selection has been made ✅

### Screenshot

![](/screenshots/multi-step-form.webp)

### Links

[Solution](https://github.com/Grego14/FrontendMentor_Challenges/tree/main/multi-step-form-main) [Live Site](https://grego14.github.io/FrontendMentor_Challenges/multi-step-form-main/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- Grid
- Transitions and animations

### What I learned

learned the **composedPath()** method of the Event interface,

learned that the toggle method of the classList interface can receive a second parameter. I didn't use it here but it looks very useful.

i've been learning a little bit about A11y, such as the use of **'aria-hidden'** to hide icons and other elements. 
Using **'aria-expanded'** and **'aria-controls'** to control the state of the 'info' element that appears when the user has an error in the input...

I don't know if this is a good way to get an element. 
```js 
const card = e.composedPath().find(el => el.classList.contains('form__card')) 
```
tried to use the maximum number of variables within the functions that I could. to avoid declaring them globally. 

It's the first time I've written so much JavaScript code and I think it's all useful +500 lines, of course there are some things that could be done do to make it better.

I added styles using only CSS, no JavaScript. 

To make it so that the elements that are hidden from the change of formStep cannot be focused, I used a function called updateTabIndexs, but after seeing better ways to do it, I ended up using only CSS. 
```css
.form__step{ 
  &[aria-hidden='true']{ 
    &*[tabindex], 
    button, 
    input, 
    a{ 
      visibility: hidden;
    }
  }
} 
```
## Author

- Frontend Mentor - [@Grego14](https://www.frontendmentor.io/profile/Grego14)

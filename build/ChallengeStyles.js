export default function ChallengeStyles() {
    return `
<style>

:host { 
  --challenge-size: 18rem;
  --time: .3s;

  display: block;
  color: #0D0D0D;
  width: 100%;
  max-width: clamp(var(--challenge-size), var(--challenge-size) + 10vw, 40rem);
  min-height: var(--challenge-size);
  cursor: pointer;
}

.fm-challenge__content {
  min-height: var(--challenge-size);
}

.fm-challenge__image {
  width: max(100%, var(--challenge-size));
  height: auto;
  vertical-align: middle;
  aspect-ratio: 4 / 4;
  object-fit: cover;
  transition: transform var(--time) ease-in,
}

.container--image{
  opacity: 0;
  transition: opacity var(--time) ease-in;
  height: var(--challenge-size);
  transition: background-color var(--time) ease-in,
    opacity var(--time) ease-in,
    transform var(--time) ease-in;
  overflow: hidden;
}

.container--image[data-loaded]{
  opacity: 1;
}

.fm-challenge__image:hover {
  transform: scale(1.3);
}

h2 {
  text-align: center;
}

.fm-challenge__inline-wrapper {
  display: flex;
}

.container--expand-content{
  padding: var(--padding-small);
}

.fm-challenge__name {
  font-weight: bold;
  font-size: var(--fs-normal);
}

.fm-challenge__status-icon {
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.fm-challenge__status-icon[status='1']{
  background-color: green;
}

.fm-challenge__status-icon[status='2']{
  background-color: blue;
}

.fm-challenge__status-icon[status='3']{
  background-color: orange;
}

.fm-challenge__difficulty {
  font-size: var(--fs-small);
  margin-left: auto;
}

/*--html-logo-1: #E34C26;*/
/*--html-logo-2: #F06529;*/

/*--css-logo-1: #0074BE;*/
/*--css-logo-2: #0089CA;*/

/*--js-logo-1: #D5B931;*/
/*--js-logo-2: #FDD83C;*/

/*--json-logo-1: #0E0E0E;*/
/*--json-logo-2: #494949;*/

/*--stack-color: #111;*/

/*--expand-icon-size: 1.875rem; [> 30px <]*/
/*--expand-height: calc(100% - var(--expand-icon-size));*/

/*--fs-name: 1rem;*/
/*--fs-df-label: 1rem;*/
/*--fs-stack: .85rem;*/
/*--fs-link: .9rem;*/
/*--fs-description: .9rem;*/
/*--expand-content-padding: 1rem;*/

</style>
`;
}

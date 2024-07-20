import utils from '../utils.js';
import ChallengeStyles from '../ChallengeStyles.js';
(() => {
    let dom = document;
    let styles = ChallengeStyles();
    let challenges;
    let challengeCount = 0;
    class Challenge extends HTMLElement {
        static get observedAttributes() {
            return ['expanded'];
        }
        constructor(data) {
            super();
            this.challenge = data;
            this.challenge.statusIcons = data.statusIcons || false;
        }
        connectedCallback() {
            var _a, _b, _c;
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `${styles}<div class='fm-challenge__content'></div>`;
            challenges = Array.from(dom.querySelectorAll('fm-challenge'));
            this.setAttribute('id', `challenge-${challengeCount}`);
            challengeCount++;
            let status = this.challenge.statusIcons
                ? utils.getStatusIcon(this.challenge.status, utils.getChallengeStatus(this.challenge.status))
                : utils.getChallengeStatus(this.challenge.status);
            let expandContent = `
        <div class='fm-challenge__container container--expand-content'>
          <div class='fm-challenge__inline-wrapper'>
            <div class='fm-challenge__status'>${status}</div>
            <div class='fm-challenge__name'>${this.challenge.name || 'Challenge Name'}</div>
            <div class='fm-challenge__difficulty'>${utils.getChallengeDifficulty(this.challenge.difficulty)}</div>
          </div>
          <div class='fm-challenge__stack'>${utils.getChallengeStack(this.challenge.stack)}</div>
          <div class='fm-challenge__description'>${this.challenge.description || "This challenge doesn't have a description."}</div>
          <ul class='fm-challenge__links'>
            <li><a class='fm-challenge__link' href='${this.challenge.repo}' target='blank' tabindex='-1'>Code</a></li>
            <li><a class='fm-challenge__link' href='${this.challenge.livesite}' target='blank' tabindex='-1'>Live Site</a></li>
          </ul>
        </div>
        <div class='fm-challenge__toggle'>
          <button class='fm-challenge__expand-button' aria-label='expand challenge info'>
            <img src='${utils.getExpandIcon(this.getExpanded())}' alt='' aria-hidden='true' width='30' height='30'>
          </button>
        </div>
        `;
            let image = new Image();
            image.src = this.challenge.image ? this.challenge.image : './src/assets/images/defaultImage.webp';
            image.width = 280;
            image.height = 280;
            image.loading = 'lazy';
            image.alt = '';
            image.classList.add('fm-challenge__image');
            let challengeContent = shadow.querySelector('.fm-challenge__content');
            let shadowContent = '';
            if (this.getAttribute('id') !== ((_a = challenges.at(0)) === null || _a === void 0 ? void 0 : _a.getAttribute('id')))
                shadowContent += `<button class='fm-challenge__prev'>Previous Challenge</button>`;
            shadowContent += `
        <h2>${utils.getChallengeName(this.challenge.name) || 'Challenge Name'}</h2>
        <div class='fm-challenge__container container--image'></div>
        ${expandContent}
      `;
            if (this.getAttribute('id') !== ((_b = challenges.at(-1)) === null || _b === void 0 ? void 0 : _b.getAttribute('id')))
                shadowContent += `<button class='fm-challenge__next'>Next Challenge</button>`;
            challengeContent.innerHTML = shadowContent;
            (_c = challengeContent === null || challengeContent === void 0 ? void 0 : challengeContent.querySelector('.container--image')) === null || _c === void 0 ? void 0 : _c.append(image);
            image.addEventListener('load', handleImageLoad);
            challengeContent.onclick = handleClickEvents;
        }
        getExpanded() {
            var _a;
            return ((_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.host.getAttribute('expanded')) === 'true' ? true : false;
        }
        getChallenge(position) {
            let output;
            if (challenges.length <= 1)
                return;
            for (const challenge of challenges) {
                let index = challenges.indexOf(challenge);
                if (challenge === this) {
                    output = position === 1 ? challenges[index + 1] : challenges[index - 1];
                }
            }
            return output;
        }
        attributeChangedCallback(name, oldValue, newValue) {
            return { name, oldValue, newValue };
        }
    }
    customElements.define('fm-challenge', Challenge);
    function handleClickEvents(e) {
        var _a, _b;
        let target = e.target;
        let challengeParent = target.closest('.fm-challenge__content').parentNode.host;
        if (target.matches('.fm-challenge__next'))
            return (_a = challengeParent.getChallenge(1)) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: 'end' });
        if (target.matches('.fm-challenge__prev'))
            return (_b = challengeParent.getChallenge(-1)) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ block: 'start' });
    }
    function handleImageLoad(e) {
        var _a;
        (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.setAttribute('data-loaded', '');
    }
})();

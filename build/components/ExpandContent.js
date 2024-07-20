var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExpandContent_instances, _ExpandContent_isInViewport;
import utils from "../utils.js";
class ExpandContent extends HTMLElement {
    static get observerAttributes() {
        return ['data-expanded'];
    }
    constructor(data, opts) {
        super();
        _ExpandContent_instances.add(this);
        this.options = {
            expandVisible: false
        };
        this.options = Object.assign(Object.assign({}, this.options), opts);
        this.parentInfo = data;
    }
    connectedCallback() {
        this.setAttribute('data-expanded', 'false');
        this.classList.add('fm-challenge__expand');
        let status = this.parentInfo.statusIcons
            ? utils.getStatusIcon(utils.getChallengeStatus(this.parentInfo.status))
            : utils.getChallengeStatus(this.parentInfo.status);
        this.innerHTML = `
    <div class='fm-challenge__container'>
      <div class='fm-challenge__inline-wrapper'>
        <h3 class='fm-challenge__name name--expand'>${this.parentInfo.name}</h3>
        <div class='fm-challenge__status status--expand'>${status}</div>
      </div>
      <div class='fm-challenge__box'>
        <div class='fm-challenge__difficulty'><span>Difficulty:</span>
        ${utils.getChallengeDifficulty(this.parentInfo.difficulty)}
        </div>
        <div class='fm-challenge__stacks'>${utils.getChallengeStack(this.parentInfo.stack)}</div>
        <p class='fm-challenge__desc'>${this.parentInfo.description || "This challenge doesn't have a description."}</p>
      </div>
      <ul class='fm-challenge__links'>
        <li><a class='fm-challenge__link' href='${this.parentInfo.repo}' target='blank' tabindex='-1'>Code</a></li>
        <li><a class='fm-challenge__link' href='${this.parentInfo.livesite}' target='blank' tabindex='-1'>Live Site</a></li>
      </ul>
    </div>
    <div class='fm-challenge__toggle'>
      <button class='fm-challenge__expand-button' aria-label='expand challenge info' tabindex='-1'>
        <img src='${utils.getExpandIcon(this.getExpanded())}' alt='' aria-hidden='true' width='30' height='30'>
      </button>
    </div>
    `;
        if (this.options.expandVisible && __classPrivateFieldGet(this, _ExpandContent_instances, "m", _ExpandContent_isInViewport).call(this)) {
            setTimeout(() => {
                this.expand();
            }, 3000);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
    }
    expand() {
        this.setAttribute('data-expanded', this.getAttribute('data-expanded') === 'false' ? 'true' : 'false');
        this.querySelectorAll('a').forEach(link => {
            link.setAttribute('tabindex', link.getAttribute('tabindex') === '-1' ? '0' : '-1');
        });
    }
    getExpanded() {
        return this.getAttribute('data-expanded') === 'false' ? false : true;
    }
}
_ExpandContent_instances = new WeakSet(), _ExpandContent_isInViewport = function _ExpandContent_isInViewport() {
    const rect = this.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth);
};
document.addEventListener('click', e => {
    let target = e.target;
    if (target.matches('.fm-challenge__expand-button')) {
        target.closest('expand-content').expand();
    }
    console.log(target);
});
customElements.define('expand-content', ExpandContent);
export default ExpandContent;

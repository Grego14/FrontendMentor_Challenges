const utils = {
    getStatusIcon(statusId, status) {
        const statusIcon = `
      <div class='fm-challenge__status-icon' status='${statusId}' title='Challenge ${status}'></div>
    `;
        return statusIcon;
    },
    getExpandIcon(expanded) {
        return expanded
            ? '/src/assets/images/expand-right.svg'
            : '/src/assets/images/expand-left.svg';
    },
    getChallengeStack(stacks) {
        let output = ``;
        for (const stack of stacks) {
            output += `<div class='fm-challenge__stack' color='${stack.toLowerCase()}'>${stack.toUpperCase()}</div>`;
        }
        return output;
    },
    getChallengeStatus(status) {
        const output = (() => {
            switch (status) {
                case 1:
                    return 'Completed';
                case 2:
                    return 'In progress';
                case 3:
                    return 'In revision';
                default:
                    return '';
            }
        })();
        return output;
    },
    getChallengeDifficulty(difficulty) {
        const output = (() => {
            switch (difficulty) {
                case 1:
                    return 'newbie';
                case 2:
                    return 'junior';
                case 3:
                    return 'intermediate';
                case 4:
                    return 'advanced';
                default:
                    return '';
            }
        })();
        return output;
    },
    getChallengeName(name) {
        return name.replace(/-/g, ' ').replace('_', '-');
    },
    toggleBooleanAttr(element, attr) {
        if (element.getAttribute(attr) === 'false')
            return 'true';
        return 'false';
    },
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth);
    }
};
export default utils;

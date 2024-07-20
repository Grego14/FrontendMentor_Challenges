var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import './components/Challenge.js';
const d = document;
function getData(jsonFile) {
    return new Promise((resolve, reject) => {
        fetch(jsonFile)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}
function printChallenges() {
    return __awaiter(this, void 0, void 0, function* () {
        const challenges = yield getData('../../challenges.json');
        const fragment = d.createDocumentFragment();
        const container = d.getElementById('fm-challenges');
        for (const obj of Object.values(challenges)) {
            const challengeContainer = d.createElement('div');
            challengeContainer.setAttribute('class', 'fm-challenge-container');
            const Challenge = customElements.get('fm-challenge');
            challengeContainer.append(new Challenge({
                name: obj.name,
                status: obj.status,
                difficulty: obj.difficulty,
                repo: obj.repo,
                livesite: obj.livesite,
                statusIcons: true,
                stack: [...obj.stack],
                description: obj.description || ''
            }));
            fragment.append(challengeContainer);
        }
        container === null || container === void 0 ? void 0 : container.append(fragment);
    });
}
printChallenges();

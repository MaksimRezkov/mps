const rootElem = document.querySelector('.root');
const titleSection = document.querySelector('.main__title');
const titleSectionHeight = titleSection.getBoundingClientRect().height;
const form = document.querySelector('.call-form');
const listRecomendationsWrapper = document.querySelector('.about__recomendations');
const listRecomendations = document.querySelector('.recomendations__rec-items');
const listRecomendationsItems = document.querySelectorAll('.rec-items__text');
const intersector = document.querySelector('.intersector');

console.log('list', listRecomendationsWrapper.getBoundingClientRect());
const listRecomendationsClientRect = listRecomendationsWrapper.getBoundingClientRect();
const intersectorClientRect = intersector.getBoundingClientRect();

let timeThrottleStart = 0;
const throttleDelay = 100;

function checkForm() {
    if (window.scrollY > (titleSectionHeight / 5)) {
        form.classList.add('call-form__visible');
        return;
    }
    form.classList.remove('call-form__visible');
}

function checkListRecomendations() {
    const intersectBottom = intersectorClientRect.top + window.scrollY;
    const listRecomendationsMid = listRecomendationsClientRect.top + (listRecomendationsClientRect.height);
    const isNotReached = intersectBottom < listRecomendationsMid;

    console.log('intersectBottom', intersectBottom);
    console.log('listRecomendationsMid', listRecomendationsMid);
    if (isNotReached || !listRecomendationsItems?.length) return;

    listRecomendations.classList.add('recomendations__rec-items_visible');
}

document.addEventListener('scroll', (event) => {
    const timeNow = Date.now()
    if ((timeNow - timeThrottleStart) < throttleDelay) return;
    timeThrottleStart = timeNow;

    checkForm();
    checkListRecomendations();
});

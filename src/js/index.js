const rootElem = document.querySelector('.root');
const titleSection = document.querySelector('.main__title');
const titleText = document.querySelector('.title__text');
const form = document.querySelector('.call-form');
const listRecomendationsWrapper = document.querySelector('.about__recomendations');
const listRecomendations = document.querySelector('.recomendations__rec-items');
const listRecomendationsItems = document.querySelectorAll('.rec-items__text');
const intersector = document.querySelector('.intersector');
const aboutCriteries = document.querySelector('.about__our-criteries');
const aboutCriteriesClientRect = aboutCriteries.getBoundingClientRect();
const aboutCriteriesTextList = document.querySelectorAll('.criteries-text');

const titleSectionHeight = titleSection.getBoundingClientRect().height;

titleText.classList.add('title__text-visible');

const listRecomendationsClientRect = listRecomendationsWrapper.getBoundingClientRect();
const intersectorClientRect = intersector.getBoundingClientRect();



let timeThrottleStart = 0;
const throttleDelay = 100;

checkIntersectElements();

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

    if (isNotReached || !listRecomendationsItems?.length) return;

    listRecomendations.classList.add('recomendations__rec-items_visible');
}

function checkAboutCriteries() {
    const isNotReached = (intersectorClientRect.top + window.scrollY) < (aboutCriteriesClientRect.top + aboutCriteriesClientRect.height / 3);
    if (isNotReached) return;

    for (let i = 0; i < aboutCriteriesTextList.length; i++) {
        aboutCriteriesTextList[i].classList.add('criteries-text-visible');
    }
}

function checkIntersectElements() {
    checkForm();
    checkAboutCriteries();
    checkListRecomendations();
}

document.addEventListener('scroll', (event) => {
    const timeNow = Date.now()
    if ((timeNow - timeThrottleStart) < throttleDelay) return;
    timeThrottleStart = timeNow;

    checkIntersectElements();
});

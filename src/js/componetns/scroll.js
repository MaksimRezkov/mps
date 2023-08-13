const rootElem = document.querySelector('.root');
const titleSection = document.querySelector('.main__title');
const titleText = document.querySelector('.title__text');
const form = document.querySelector('.static-form-wrapp');
const listRecomendationsWrapper = document.querySelector('.about__recomendations');
const listRecomendations = document.querySelector('.recomendations__rec-items');
const listRecomendationsItems = document.querySelectorAll('.rec-items__text');
const intersector = document.querySelector('.intersector');
const aboutCriteries = document.querySelector('.about__our-criteries');
const aboutCriteriesClientRect = aboutCriteries.getBoundingClientRect();
const aboutCriteriesTextList = document.querySelectorAll('.criteries-text');
const scrollUpBtn = document.querySelector('.scroll-up-btn');

const titleSectionHeight = titleSection?.getBoundingClientRect?.()?.height;

titleText.classList.add('title__text-visible');

const listRecomendationsClientRect = listRecomendationsWrapper.getBoundingClientRect();
const intersectorClientRect = intersector.getBoundingClientRect();

let timeThrottleStart = 0;
const throttleDelay = 100;

checkScrollingElements();

function checkForm() {
    if (window.scrollY > (titleSectionHeight / 5)) {
        form.classList.add('static-form-wrapp__visible');
        return;
    }
    form.classList.remove('static-form-wrapp__visible');
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

let isBtnScrollVisisble = window.scrollY >= titleSectionHeight;
function checkScrollUpBtn() {
    if (document.documentElement.clientWidth < 1024) {
        scrollUpBtn.classList.remove('scroll-up-btn_visible');
        isBtnScrollVisisble = false;
        return;
    }

    const isSetVisible = window.scrollY >= titleSectionHeight; // нужно сделать видимым
    if (isSetVisible) {
        !isBtnScrollVisisble && (scrollUpBtn.classList.add('scroll-up-btn_visible'));
        isBtnScrollVisisble = true;
        return;
    }
    isBtnScrollVisisble && (scrollUpBtn.classList.remove('scroll-up-btn_visible'));
    isBtnScrollVisisble = false;
}

function checkScrollingElements() {
    checkForm();
    checkAboutCriteries();
    checkListRecomendations();
    checkScrollUpBtn();
}

scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('scroll', (event) => {
    const timeNow = Date.now()
    if ((timeNow - timeThrottleStart) < throttleDelay) return;
    timeThrottleStart = timeNow;

    checkScrollingElements();
});

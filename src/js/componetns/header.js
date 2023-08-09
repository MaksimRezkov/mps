const contactsNavItem = document.querySelector('.contacts__title');
const contactsPopup = document.querySelector('.contacts-popup');
const burgerBtn = document.querySelector('.navbar__burger');
const navLinksMobile = document.querySelector('.navbar__nav-links_mobile');

let isContactsPopupOpen = false;
contactsNavItem.addEventListener('click', (e) => {
    e.stopPropagation();
    isContactsPopupOpen
        ? contactsPopup.classList.remove('contacts-popup_visible')
        : contactsPopup.classList.add('contacts-popup_visible');
        isContactsPopupOpen = !isContactsPopupOpen;
});

let isBurgerOpen = false;
burgerBtn.addEventListener('click', (event) => {
    if (isBurgerOpen) {
        event.currentTarget.classList.remove('burger-open');
        navLinksMobile.classList.remove('navbar__nav-links_mobile_visible');
    } else {
        event.currentTarget.classList.add('burger-open');
        navLinksMobile.classList.add('navbar__nav-links_mobile_visible');
    }
    isBurgerOpen = !isBurgerOpen;
});

document.body.addEventListener('click', () => {
    if (isContactsPopupOpen) {
        contactsPopup.classList.remove('contacts-popup_visible');
        isContactsPopupOpen = false;
    }
});

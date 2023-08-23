const contactsNavItem = document.querySelector('.contacts__title');
const contactsPopup = document.querySelector('.contacts-popup');
const burgerBtn = document.querySelector('.navbar__burger');
const navLinksMobile = document.querySelector('.navbar__nav-links_mobile');

let isContactsPopupOpen = false;

const popupContactsCopyItems = contactsPopup.querySelectorAll('.popup__copy');
function copyContact(e) {
    const data = e.currentTarget.dataset.copy;
    navigator.clipboard.writeText(data);
    const copyTextItem = e.currentTarget.querySelector('.copy__text');
    copyTextItem.innerHTML = 'Скопировано';
    setTimeout(() => {
        copyTextItem.innerHTML = 'Копировать';
    }, 2000);
}
contactsNavItem.addEventListener('click', (e) => {
    e.stopPropagation();
    if(isContactsPopupOpen) {
        popupContactsCopyItems.forEach((copyItem) => {
            copyItem.removeEventListener('click', copyContact);
            copyItem.removeEventListener('pointerup', copyContact);
        });
        contactsPopup.classList.remove('contacts-popup_visible');
    } else {
        contactsPopup.classList.add('contacts-popup_visible');
        popupContactsCopyItems.forEach((copyItem) => {
            copyItem.addEventListener('click', copyContact);
            copyItem.addEventListener('pointerup', copyContact);
        });
    }

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

contactsPopup.addEventListener('click', (e) => {
    e.stopPropagation();
});

const linksByPathNames = {
    '/': 'main_page',
    '/implemented_projects.html': 'implemented_projects',
};

const pathname = window.location.pathname;
if (linksByPathNames[pathname]) {
    const linkItemId = linksByPathNames[pathname];
    const linkItem = document.querySelector(`#${linkItemId}`);
    if (linkItem) linkItem.classList.add('nav-links__link-item_active');
}

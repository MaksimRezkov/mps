const contactsNavItem = document.querySelector('.contacts__title');
const contactsPopup = document.querySelector('.contacts-popup');

let isContactsPopupOpen = false;
contactsNavItem.addEventListener('click', (e) => {
    e.stopPropagation();
    isContactsPopupOpen
        ? contactsPopup.classList.remove('contacts-popup_visible')
        : contactsPopup.classList.add('contacts-popup_visible');
        isContactsPopupOpen = !isContactsPopupOpen;
});

document.body.addEventListener('click', () => {
    if (isContactsPopupOpen) {
        contactsPopup.classList.remove('contacts-popup_visible');
        isContactsPopupOpen = false;
    }
});

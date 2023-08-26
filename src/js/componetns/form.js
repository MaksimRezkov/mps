import '../libs/inputmask.min.js';
const openFormBtnList = document.querySelectorAll('.open-form__btn');
const fixedFormBg = document.querySelector('.fixed-form-bg'); // обёртка над скрываемой по кнопке формой
const staticFormWrapp = document.querySelector('.static-form-wrapp'); // обёртка над постоянно включённой формой

let isFormFixedOpen = false;

if (staticFormWrapp) {
    const form = staticFormWrapp.querySelector('.call-form');
    addListenersFormInput(form);
    initInputMask(form);
    addFormSubmitListeners(form);
}

if (openFormBtnList?.length) {
    const form = fixedFormBg.querySelector('.call-form');
    for (let i = 0; i < openFormBtnList.length; i++) {
        const openFormBtn = openFormBtnList[i];
        openFormBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fixedFormBg.classList.add('fixed-form-bg_visible');
            isFormFixedOpen = true;
            addListenersFormInput(form);
            addFormSubmitListeners(form);
            initInputMask(form);
            addListenersFormCloseBtn(fixedFormBg);
        });
    }
}

function initInputMask(form) {
    const phoneInput = form.querySelector('input[type="tel"]');
    const inputMask = new Inputmask('+7 (999) 999-99-99');
    inputMask.mask(phoneInput);
}

function addListenersFormInput(form) {
    // получаем инпуты из переданного экземпляра form
    const inputElements = form?.querySelectorAll('input');
    toggleListenersFormInput(inputElements, true); // события фокус/блюр
}

function removeListenersFormInput(form) {
    const inputElements = form?.querySelectorAll('input');
    toggleListenersFormInput(inputElements, false);
}

function inputHandler(event) {
    event.currentTarget.classList.remove('invalid_input');
}
function formInputFocusHandler(event) {
    event.currentTarget.classList.add('input-focused');
}
function formInputBlurHandler(event) {
    event.currentTarget.classList.remove('input-focused');
}

function toggleListenersFormInput(inputElementsList, isAdd) {
    if (inputElementsList?.length) {
        for (let i = 0; i < inputElementsList.length; i++) {
            const input = inputElementsList[i];
            if (isAdd) {
                input.addEventListener('input', inputHandler);
                input.addEventListener('focus', formInputFocusHandler);
                input.addEventListener('blur', formInputBlurHandler);
                continue;
            }
            input.removeEventListener('input', inputHandler);
            input.removeEventListener('blur', formInputBlurHandler);
            input.removeEventListener('focus', formInputFocusHandler);
        }
    }
}

function formCloseBtnHandler() {
    removeListenersFormCloseBtn(fixedFormBg);
    removeListenersFormInput(fixedFormBg);
    fixedFormBg.classList.remove('fixed-form-bg_visible');
    isFormFixedOpen = false;
}

function checkValidField(inputElement) {
    return inputElement.id !=='fio' && inputElement.id !== 'phone' || !!inputElement.value;
}

async function formSubmitHandler(form) {
    const formData = new FormData(form);

    const inputElements = form.querySelectorAll('input');
    let isAllValid = true;
    inputElements.forEach((element) => {
        const currentValid = checkValidField(element);
        isAllValid = isAllValid && currentValid;
        if (!currentValid) {
            element.classList.add('invalid_input');
        }
    });

    const forms = document.querySelectorAll('.call-form');

    if (isAllValid) {
        try {
            form.classList.add('form_sending');
            let response = await fetch('send_mail.php', {
                method: 'POST',
                body: formData
            });

            if (forms?.length) {
                forms.forEach((formItem) => {
                    formItem.classList.add('form_success-send');
                });
            }

            if (openFormBtnList?.length) {
                openFormBtnList.forEach((btn) => {
                    btn.classList.add('btn_hidden');
                });
            }
        } catch (error) {
            form.classList.add('form_err-send');
        } finally {
            form.classList.remove('form_sending');
        }
    }
}

function addListenersFormCloseBtn(formWrapper) {
    const closeFormBtn = formWrapper.querySelector('.close-form__btn');
    closeFormBtn.addEventListener('click', formCloseBtnHandler);
}

function removeListenersFormCloseBtn(formWrapper) {
    const closeFormBtn = formWrapper.querySelector('.close-form__btn');
    closeFormBtn.removeEventListener('click', formCloseBtnHandler);
}

function addFormSubmitListeners(form) {
    const handler = (e) => {
        e.preventDefault();
        formSubmitHandler(form);
    }
    form.addEventListener('submit', handler);
}

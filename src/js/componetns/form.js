import '../libs/inputmask.min.js';
const openFormBtnList = document.querySelectorAll('.open-form__btn');
const fixedFormBg = document.querySelector('.fixed-form-bg'); // обёртка над скрываемой по кнопке формой
const staticFormWrapp = document.querySelector('.static-form-wrapp'); // обёртка над постоянно включённой формой

const formStaticInputValues = {
    name: 'formStaticInputValues',
    fio: null,
    organization: null,
    phone: null,
};
const formFixedInputValues = {
    name: 'formFixedInputValues',
    fio: null,
    organization: null,
    phone: null,
};

let isFormFixedOpen = false;

if (staticFormWrapp) {
    addListenersFormInput(staticFormWrapp, formStaticInputValues);
    initInputMask(staticFormWrapp);
    addFormSendBtnListeners(staticFormWrapp, formStaticInputValues);
}

if (fixedFormBg) {
    fixedFormBg.addEventListener('click', (e) => {
        console.log('bg');
        // fixedFormBg.classList.remove('fixed-form-bg_visible');
    }, { capture: false });
}

if (openFormBtnList?.length) {
    for (let i = 0; i < openFormBtnList.length; i++) {
        const openFormBtn = openFormBtnList[i];
        openFormBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fixedFormBg.classList.add('fixed-form-bg_visible');
            isFormFixedOpen = true;
            addListenersFormInput(fixedFormBg, formFixedInputValues);
            addFormSendBtnListeners(fixedFormBg, formFixedInputValues);
            addListenersFormCloseBtn(fixedFormBg);
        });
    }
}

function initInputMask(form) {
    const phoneInput = form.querySelector('input[type="tel"]');
    console.log(phoneInput);
    const inputMask = new Inputmask('+7 (999) 999-99-99');
    console.log('input mask elem', inputMask);
    inputMask.mask(phoneInput);
}

function addListenersFormInput(form, targetFormValues) {
    // получаем инпуты из переданного экземпляра form
    const inputElements = form?.querySelectorAll('input');
    addInputHandlers(inputElements, targetFormValues); // события ввода
    toggleListenersFormInput(inputElements, true); // события фокус/блюр
}

function removeListenersFormInput(form) {
    const inputElements = form?.querySelectorAll('input');
    toggleListenersFormInput(inputElements, false);
}

function formInputFocusHandler(event) {
    const input = event.currentTarget.paramForHandler;
    input.classList.add('input-focused');
}
function formInputBlurHandler(event) {
    const input = event.currentTarget.paramForHandler;
    input.classList.remove('input-focused');
}

function toggleListenersFormInput(inputElementsList, isAdd) {
    if (inputElementsList?.length) {
        for (let i = 0; i < inputElementsList.length; i++) {
            const input = inputElementsList[i];
            input.paramForHandler = input;
            if (isAdd) {
                input.addEventListener('focus', formInputFocusHandler);
                input.addEventListener('blur', formInputBlurHandler);
                continue;
            }
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

function formSendBtnHandler(e) {
    e.preventDefault();
    const targetFormValues = e.target.targetFormValues;
    console.log('send', targetFormValues);

    e.target.classList.add('btn_sending');
    fetch('http://jsonplaceholder.typicode.com/posts')
        .then((response) => response.json())
        .then((data) => {
            console.log('data', data);
            e.target.classList.remove('btn_sending');
            return data;
        })
}

function addListenersFormCloseBtn(form) {
    const closeFormBtn = form.querySelector('.close-form__btn');
    closeFormBtn.addEventListener('click', formCloseBtnHandler);
}

function removeListenersFormCloseBtn(form) {
    const closeFormBtn = form.querySelector('.close-form__btn');
    closeFormBtn.removeEventListener('click', formCloseBtnHandler);
}

let idTimeDebounce = null;
function formInputHandler(event) {
    if (idTimeDebounce) {
        clearTimeout(idTimeDebounce);
    }

    const form = event.currentTarget.targetFormValues;

    idTimeDebounce = setTimeout(() => {
        form[event.target.id] = event.target.value;
        console.log('form', form);
    }, 500);
}

function addInputHandlers(inputList, targetFormValues) {
    if(!inputList?.length) return;

    for (let i = 0; i < inputList.length; i++) {
        const input = inputList[i];
        input.targetFormValues = targetFormValues;
        input.addEventListener('input', formInputHandler);
    }
}

function addFormSendBtnListeners(form, targetFormValues) {
    const sendBtn = form.querySelector('.call-form__send-btn');
    sendBtn.targetFormValues = targetFormValues;
    sendBtn.addEventListener('click', formSendBtnHandler);
}

function removeFormSendBtnListeners(sendBtn, fnHandler) {
    sendBtn.removeEventListener('click', fnHandler);
}

// document.body.addEventListener('click', () => {
//     if (isFormFixedOpen) {
//         formCloseBtnHandler();
//     }
// });

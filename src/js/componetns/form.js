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
            console.log(e.currentTarget.id);
            fixedFormBg.classList.add('fixed-form-bg_visible');
            isFormFixedOpen = true;
            addListenersFormInput(fixedFormBg, formFixedInputValues);
            addListenersFormCloseBtn();
        });
    }
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
    removeListenersFormCloseBtn();
    removeListenersFormInput(fixedFormBg);
    fixedFormBg.classList.remove('fixed-form-bg_visible');
    isFormFixedOpen = false;
}

function addListenersFormCloseBtn() {
    const closeFormBtn = fixedFormBg.querySelector('.close-form__btn');
    closeFormBtn.addEventListener('click', formCloseBtnHandler);
}

function removeListenersFormCloseBtn() {
    const closeFormBtn = fixedFormBg.querySelector('.close-form__btn');
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

// document.body.addEventListener('click', () => {
//     if (isFormFixedOpen) {
//         formCloseBtnHandler();
//     }
// });

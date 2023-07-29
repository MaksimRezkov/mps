/** Класс для инициализации событий и данных формы */
export class FormInit {
    openFormBtnList = null;
    fixedFormBg = null; // обёртка над скрываемой по кнопке формой
    staticFormWrapp = null; // обёртка над постоянно включённой формой

    formStaticInputValues = {
        name: 'formStaticInputValues',
        fio: null,
        organization: null,
        phone: null,
    };
    formFixedInputValues = {
        name: 'formFixedInputValues',
        fio: null,
        organization: null,
        phone: null,
    };

    constructor(openFormBtnClass, hiddenFormWrappClass, staticFormWrappClass) {
        openFormBtnClass && (this.openFormBtnList = document.querySelectorAll(openFormBtnClass));
        hiddenFormWrappClass && (this.staticFormWrapp = document.querySelector(hiddenFormWrappClass));
        staticFormWrappClass && (this.staticFormWrapp = document.querySelector(staticFormWrappClass));
    }
}

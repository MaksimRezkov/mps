const form = document.querySelector('.call-form');
const inputElements = form?.querySelectorAll('input');

if (inputElements?.length) {
    for (let i = 0; i < inputElements.length; i++) {
        const input = inputElements[i];
        input.addEventListener('focus', () => {
            input.classList.add('input-focused');
        });

        input.addEventListener('blur', () => {
            input.classList.remove('input-focused');
        });
    }
}
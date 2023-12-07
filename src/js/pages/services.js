import '../componetns/form.js';
import '../componetns/header.js';

const listServices = document.querySelector('.list__block');
const items = listServices.querySelectorAll('.item__description');

if (items?.length) {
    items.forEach(item => item.classList.add('item__description_visible'));
}

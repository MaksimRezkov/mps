import '../componetns/header.js';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const swiper = new Swiper('.swiper', {
  loop: true,
  grabCursor: true,
  centeredSlides: true,
  modules: [Navigation, Pagination],
  speed: 1000,
  spaceBetween: 40,
  slidesPerView: "auto",
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    dynamicBullets: true,
    dynamicMainBullets: 1,
  },
});

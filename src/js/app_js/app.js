"use strict"

const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

// медиазапрос
const MAX1024 = window.matchMedia('(max-width: 1023.98px)');
const MIN1100 = window.matchMedia('(min-width: 1100px)');

function throttle(callee, timeout) {
   let timer = null;
   return function perform(...args) {
      if (timer) return;
      timer = setTimeout(() => {
         callee(...args);
         clearTimeout(timer);
         timer = null;
      }, timeout)
   }
}

const CONTACTS_REGION = document.querySelector('.contacts__region');
const HEADER = document.querySelector('.header');
const MARKING_ITEM = document.querySelectorAll('.marking__item');

document.addEventListener('click', (event) => {
   if (event.target.closest('.about__contact-item-button')) {
      event.target.closest('.about__contact-item').classList.toggle('text-hidden')
   };
   if (event.target.closest('.contacts__region-button')) {
      CONTACTS_REGION.classList.toggle('open');
   } else if (CONTACTS_REGION && !event.target.closest('.contacts__region')) {
      CONTACTS_REGION.classList.remove('open');
   }
   if (event.target.closest('.marking__item-button')) {
      let parent = event.target.closest('.marking__item');
      MARKING_ITEM.forEach((e) => { e.classList.toggle('list-open', e == parent) })
   } else if (!event.target.closest('.marking__item-list')) {
      MARKING_ITEM.forEach((e) => { e.classList.remove('list-open') })
   }
})

document.addEventListener('scroll', () => {
   scrollHeaderThrottle();
})

const scrollHeaderThrottle = throttle(scrollHeader, 17);
function scrollHeader() {
   if (MIN1100.matches && window.scrollY > 500) {
      HEADER.classList.add('scroll-header');
   } else if (MIN1100.matches && window.scrollY < 300) {
      HEADER.classList.remove('scroll-header');
   }
   if (!MIN1100.matches) {
      HEADER.classList.remove('scroll-header');
   }
}
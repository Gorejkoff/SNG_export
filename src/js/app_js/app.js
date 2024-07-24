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

document.addEventListener('click', (event) => {
   if (event.target.closest('.about__contact-item-button')) {
      event.target.closest('.about__contact-item').classList.toggle('text-hidden')
   };
   if (event.target.closest('.contacts__region-button')) {
      CONTACTS_REGION.classList.toggle('open');
   } else if (!event.target.closest('.contacts__region')) {
      CONTACTS_REGION.classList.remove('open');
   }
})

document.addEventListener('scroll', () => {
   HEADER.classList.toggle('scroll-header', window.scrollY > 500);
})
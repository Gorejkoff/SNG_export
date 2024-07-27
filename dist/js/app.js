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

document.addEventListener('click', (event) => {
   if (event.target.closest('.about__contact-item-button')) {
      event.target.closest('.about__contact-item').classList.toggle('text-hidden')
   };
   if (event.target.closest('.contacts__region-button')) {
      CONTACTS_REGION.classList.toggle('open');
   } else if (CONTACTS_REGION && !event.target.closest('.contacts__region')) {
      CONTACTS_REGION.classList.remove('open');
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
// перемещение блоков при адаптиве по данным атрибута 
// data-da=".class,3,768" 
// класс родителя куда перемещать
// порядковый номер в родительском блоке куда перемещается начиная с 0 как индексы массива
// ширина экрана min-width
// два перемещения: data-da=".class,3,768,.class2,1,1024"
const ARRAY_DATA_DA = document.querySelectorAll('[data-da]');
ARRAY_DATA_DA.forEach(function (e) {
   const dataArray = e.dataset.da.split(',');
   const addressMove = searchDestination(e, dataArray[0]);
   const addressMoveSecond = dataArray[3] && searchDestination(e, dataArray[3]);
   const addressParent = e.parentElement;
   const listChildren = addressParent.children;
   const mediaQuery = window.matchMedia(`(max-width: ${dataArray[2]}px)`);
   const mediaQuerySecond = dataArray[5] && window.matchMedia(`(max-width: ${dataArray[5]}px)`);
   for (let i = 0; i < listChildren.length; i++) { !listChildren[i].dataset.n && listChildren[i].setAttribute('data-n', `${i}`) };
   mediaQuery.matches && startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   if (mediaQuerySecond && mediaQuerySecond.matches) moving(e, dataArray[4], addressMoveSecond);
   mediaQuery.addEventListener('change', () => { startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) });
   if (mediaQuerySecond) mediaQuerySecond.addEventListener('change', () => {
      if (mediaQuerySecond.matches) { moving(e, dataArray[4], addressMoveSecond); return; };
      startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   });
});

function startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) {
   if (mediaQuery.matches) { moving(e, dataArray[1], addressMove); return; }
   if (listChildren.length > 0) {
      for (let z = 0; z < listChildren.length; z++) {
         if (listChildren[z].dataset.n > e.dataset.n) {
            listChildren[z].before(e);
            break;
         } else if (z == listChildren.length - 1) {
            addressParent.append(e);
         }
      }
      return;
   }
   addressParent.prepend(e);
};

function searchDestination(e, n) {
   if (e.classList.contains(n.slice(1))) { return e }
   if (e.parentElement.querySelector(n)) { return e.parentElement.querySelector(n) };
   return searchDestination(e.parentElement, n);
}

function moving(e, order, addressMove) {
   if (order == "first") { addressMove.prepend(e); return; };
   if (order == "last") { addressMove.append(e); return; };
   if (addressMove.children[order]) { addressMove.children[order].before(e); return; }
   addressMove.append(e);
}



if (document.querySelector('.filter')) {
   // переменные
   const FORM_FILTER = document.forms.filter;
   const INPUTS_CHECK = FORM_FILTER && FORM_FILTER.querySelectorAll('input[type="checkbox"],input[type="radio"]');
   const INPUTS_NUMBER = FORM_FILTER && FORM_FILTER.querySelectorAll('input[type="number"]')
   const VERTICAL_INDICATOR = document.querySelector('.filter__vertical-indicator');
   const FILTER = document.querySelector('.filter');

   // двойной ползунок
   const INPUT_MAX = document.querySelector('.filter__max');
   const INPUT_MIN = document.querySelector('.filter__min');
   const SPIN_MAX = document.querySelector('.spin-max');
   const SPIN_MIN = document.querySelector('.spin-min');
   const PRICE_RANGE = document.querySelector('.track-range');
   const MAX_VALUE = Number(INPUT_MAX.max);
   const MIN_VALUE = Number(INPUT_MIN.min);
   let mouseX;
   let spinMove = false;
   let spinWidth = SPIN_MAX.offsetWidth;
   let rangeStart = PRICE_RANGE.getBoundingClientRect().left;
   let rangeWidth = PRICE_RANGE.offsetWidth - spinWidth;
   let maxRange = MAX_VALUE - MIN_VALUE;

   (function () {
      INPUT_MAX.value = INPUT_MAX.max;
      INPUT_MIN.value = INPUT_MAX.min;
      SPIN_MAX.ondragstart = function () { return false };
      SPIN_MIN.ondragstart = function () { return false };
      setGradient();
   })();

   isPC && document.addEventListener('mousemove', mousemove);
   isPC && SPIN_MAX.addEventListener('mousedown', startEvent);
   isPC && SPIN_MIN.addEventListener('mousedown', startEvent);
   isPC && document.addEventListener('mouseup', andEvent);
   !isPC && document.addEventListener('touchmove', mousemove);
   !isPC && SPIN_MAX.addEventListener('touchstart', startEvent);
   !isPC && SPIN_MIN.addEventListener('touchstart', startEvent);
   !isPC && document.addEventListener('touchend', andEvent);

   INPUT_MAX.addEventListener('change', () => {
      validationInput(INPUT_MAX);
      setRange(INPUT_MAX, SPIN_MAX);
   });
   INPUT_MIN.addEventListener('change', () => {
      validationInput(INPUT_MIN);
      setRange(INPUT_MIN, SPIN_MIN);
   });

   function startEvent(event) {
      !MIN1366.matches && getProperties(); // MIN... медиазапрос при какой ширине меняется длинна ползунка, необходимо создать эту переменную
      !isPC ? mouseX = event.changedTouches[0].clientX : false;
      if (event.target.closest('.spin-max')) {
         spinMove = true;
         SPIN_MAX.style.zIndex = 2;
         SPIN_MIN.style.zIndex = 1;
         moveRange(SPIN_MAX, INPUT_MAX)
      }
      if (event.target.closest('.spin-min')) {
         spinMove = true;
         SPIN_MIN.style.zIndex = 2;
         SPIN_MAX.style.zIndex = 1;
         moveRange(SPIN_MIN, INPUT_MIN)
      }
   }

   function andEvent() { spinMove = false };
   function mousemove(event) { isPC ? mouseX = event.clientX : mouseX = event.changedTouches[0].clientX };

   function validationInput(input) {
      const val = input.value;
      if (val < MIN_VALUE) input.value = MIN_VALUE;
      if (val > MAX_VALUE) input.value = MAX_VALUE;
      if (INPUT_MAX == input && Number(INPUT_MAX.value) < Number(INPUT_MIN.value)) { input.value = INPUT_MIN.value };
      if (INPUT_MIN == input && Number(INPUT_MIN.value) > Number(INPUT_MAX.value)) { input.value = INPUT_MAX.value };
   }

   function setRange(imput, spin) {
      let offsetSpin = (imput.value - MIN_VALUE) / maxRange;
      spin.style.left = offsetSpin * rangeWidth + 'px';
      setGradient();
      checkClearButton();
   }

   function setGradient() {
      PRICE_RANGE.style.setProperty('--minGradient', ((INPUT_MIN.value - MIN_VALUE) / maxRange * 100).toFixed(1) + '%');
      PRICE_RANGE.style.setProperty('--maxGradient', ((INPUT_MAX.value - MIN_VALUE) / maxRange * 100).toFixed(1) + '%');
   }

   function moveRange(spin, input) {
      if (!spinMove) return;
      let offsetLeft = mouseX - rangeStart - spinWidth / 2;
      if (offsetLeft < 0) { offsetLeft = 0 };
      if (offsetLeft > rangeWidth) { offsetLeft = rangeWidth };
      let value = Number((MIN_VALUE + offsetLeft / rangeWidth * maxRange).toFixed());
      if (INPUT_MAX == input && value < Number(INPUT_MIN.value)) { value = INPUT_MIN.value };
      if (INPUT_MIN == input && value > Number(INPUT_MAX.value)) { value = INPUT_MAX.value };
      input.value = value;
      setRange(input, spin);
      requestAnimationFrame(() => moveRange(spin, input))
   }

   function getProperties() {
      spinWidth = SPIN_MAX.offsetWidth;
      rangeStart = PRICE_RANGE.getBoundingClientRect().left;
      rangeWidth = PRICE_RANGE.offsetWidth - spinWidth;
      maxRange = MAX_VALUE - MIN_VALUE;
      setRange(INPUT_MAX, SPIN_MAX);
      setRange(INPUT_MIN, SPIN_MIN);
   }

   window.addEventListener('resize', () => {
      getProperties();
   })

   function clearFilter() {
      INPUTS_CHECK.forEach((e) => { e.checked = false });
      if (VERTICAL_INDICATOR) { VERTICAL_INDICATOR.style.setProperty('--indicator-height', '0px') };
      INPUTS_NUMBER.forEach((e) => {
         if (e.name == "range_min") { e.value = e.min };
         if (e.name == "range_max") { e.value = e.max };
         getProperties();
      })
      checkClearButton();
   }

   function openFilterCategory(element) {
      const parent = element.closest('.filter__block');
      parent.classList.toggle('open-category');
      if (!parent.querySelector('.filter__list-hidden')) return;
      if (parent.classList.contains('open-category')) {
         setTimeout(() => { parent.querySelector('.filter__list-hidden').style.overflowY = "auto" }, 300)
      } else {
         parent.querySelector('.filter__list-hidden').style.overflowY = "";
      }
   }

   function checkInputIndicator(list) {
      list.forEach((e) => {
         if (e.querySelector('input').checked) {
            VERTICAL_INDICATOR.style.setProperty('--indicator-height', e.clientHeight / 2 + e.offsetTop + 'px')
         }
      })
   }

   if (VERTICAL_INDICATOR) {
      const filter_check = VERTICAL_INDICATOR.querySelectorAll('.filter__check');
      VERTICAL_INDICATOR.addEventListener('click', (event) => {
         checkInputIndicator(filter_check);
      })
   }

   FORM_FILTER.addEventListener('change', (event) => {
      checkClearButton()
   })

   function checkClearButton() {
      FILTER.classList.add('clear-hidden');
      clearMarking();
      INPUTS_CHECK.forEach((e) => {
         if (e.checked) {
            showClearButton();
            addMarking(e);
         }
      });
      INPUTS_NUMBER.forEach((e) => {
         if (e.name == "range_min" && e.value !== e.min) {
            showClearButton();
            addMarking(e);
         };
         if (e.name == "range_max" && e.value !== e.max) {
            showClearButton();
            addMarking(e);
         };
      })
   }
   function showClearButton() {
      FILTER.classList.remove('clear-hidden')
   }
   function addMarking(e) {
      let el = e.closest('.filter__block').querySelector('.filter__category');
      el && el.classList.add('mark');
   }
   function clearMarking() {
      document.querySelectorAll('.mark').forEach((e) => { e.classList.remove('mark') })
   }
   document.addEventListener('click', (event) => {
      // открывает вкладки фильтра
      if (event.target.closest('.filter__category')) {
         openFilterCategory(event.target.closest('.filter__category'))
      }
      // очистка фильтров
      if (event.target.closest('.filter__clear')) {
         clearFilter();
      }
   })


}    

const HEADER_MENU_OPEN = document.querySelectorAll('.header__menu-open');
if (isPC) {
   document.addEventListener('mouseover', (event) => {
      actionHeaderMenuList(event);
      openMenuList(event);
   })
} else {
   document.addEventListener('click', (event) => {
      actionHeaderMenuList(event);
      openMenuList(event)
   })
}
function actionHeaderMenuList(event) {
   if (event.target.closest('.header__menu-open')) {
      openHeaderMenuList(event.target.closest('.header__menu-open'))
   } else {
      HEADER_MENU_OPEN.forEach((e) => {
         closeHeaderMenuList(e)
      })
   }
}
function openHeaderMenuList(element) {
   HEADER_MENU_OPEN.forEach((e) => {
      if (e == element) {
         setHeightHeaderMemuList(e);
         e.classList.add('open');
      } else {
         closeHeaderMenuList(e)
      }
   })
}
function setHeightHeaderMemuList(element) {
   let heightList = element.querySelector('.header__menu-sublist ol').clientHeight;
   element.style.setProperty('--height', heightList + 'px');
}
function closeHeaderMenuList(element) {
   element.classList.remove('open');
}

const HEADER_MENU_SECOND = document.querySelectorAll('.header-menu__second');
const HEADER_MENU_LIST = document.querySelectorAll('.header-menu__first-item');
const HEADER_MENU_THIRD = document.querySelectorAll('.header-menu__third');

// открывает каскад пунктов в меню
function openMenuList(event) {
   if (event.target.closest('.header-menu__first-item')) {
      let firstItem = event.target.closest('.header-menu__first-item');
      let secondItem;
      HEADER_MENU_LIST.forEach((e) => {
         let ol = e.querySelector('ol');
         if (e == firstItem) {
            if (ol) {
               ol.style.display = "block";
               secondItem = ol.querySelectorAll('.header-menu__second-item');
            };
            return;
         };
         if (ol) { ol.style.display = "" };
      });
      if (event.target.closest('.header-menu__second-item')) {
         let item = event.target.closest('.header-menu__second-item');
         secondItem.forEach((e) => {
            let ol = e.querySelector('ol');
            if (e == item) {
               if (ol) { ol.style.display = "block" };
               return;
            };
            if (ol) { ol.style.display = "" };
         });
      } else {
         HEADER_MENU_THIRD.forEach((e) => { e.style.display = '' })
      };
   } else {
      HEADER_MENU_SECOND.forEach((e) => { e.style.display = '' })
   };
}



/* открывает, закрывает модальные окна. */
/*
добавить классы
js-modal-hidden - родительский контейнер модального окна который скрывается и показывается, задать стили скрытия
js-modal-visible - задать стили открытия
js-modal-close - кнопка закрытия модального окна находится внутри js-modal-hidde
кнопка открытия, любая:
js-modal-open - кнопка открытия модального окна
data-modal_open="id" - id модального окна
если надо что бы окно закрывалось при клике на пустое место (фон), добавляется атрибут js-modal-stop-close.
js-modal-stop-close - атрибут указывает на поле, при клике на которое не должно происходить закрытие окна, 
т.е. контейнер контента, при этом внешний родительский контейнет помечается атрибутом js-modal-close.
допускается дополнительно кнопка закрытия внутри js-modal-stop-close.
*/
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-modal-open')) { openModal(event) }
   if (event.target.closest('.js-modal-close')) { testModalStopClose(event) }
})
function openModal(event) {
   let modalElement = event.target.closest('.js-modal-open').dataset.modal_open;
   if (typeof modalElement !== "undefined" && document.querySelector(`#${modalElement}`)) {
      document.querySelector(`#${modalElement}`).classList.add('js-modal-visible');
      document.body.classList.add('body-overflow')
   }
}
function testModalStopClose(event) {
   if (event.target.closest('.js-modal-stop-close') &&
      event.target.closest('.js-modal-close') !==
      event.target.closest('.js-modal-stop-close').querySelector('.js-modal-close')) {
      return
   }
   closeModal(event);
}
function closeModal(event) {
   event.target.closest('.js-modal-hidden').classList.remove('js-modal-visible');
   if (!document.querySelector('.js-modal-visible')) {
      document.body.classList.remove('body-overflow');
   }
}
class TabsOpen {
   constructor(element, hover) {
      this.tabsButtons = document.querySelectorAll(element);
      this.resizeHeightTab = this.throttle(this.resizeHeight, 16.7);
      this.isPC;
      this.hover = hover == false ? false : true;
   }
   tabsInit = () => {
      console.log(this.hover);
      document.body.classList.contains('_pc') ? this.isPC = true : this.isPC = false;
      !this.isPC && window.addEventListener('resize', this.resizeHeightTab);
      this.events();
   }
   open = (event) => {
      if (event.target.closest('.js-tab-body')) {
         this.tabsButtons.forEach(e => {
            if (event.target.closest('.js-tab-body') == e && (!this.isPC ? !e.classList.contains('js-tab-open') : true)) {
               e.classList.add('js-tab-open');
               e.querySelector('.js-tab-content').style.height = `${e.querySelector('.js-tab-content-text').clientHeight}px`;
            } else { this.close(e) }
         })
      } else { this.tabsButtons.forEach(e => { this.close(e) }) }
   }
   close = (e) => { e.classList.remove('js-tab-open'), e.querySelector('.js-tab-content').style.height = '' }
   events = () => { (this.isPC && this.hover) ? window.addEventListener('mouseover', this.open) : window.addEventListener('click', this.open) }
   resizeHeight = () => {
      this.tabsButtons.forEach(e => {
         if (e.classList.contains('js-tab-open')) {
            e.querySelector('.js-tab-content').style.height = `${e.querySelector('.js-tab-content-text').clientHeight}px`
         }
      })
   }
   throttle = (callee, timeout) => {
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
}
// new TabsOpen('.tab-item', true).tabsInit();
// второй параметр "false" отключает hover. Отсутствие или true - hover включен.
class TabsSwitching {
   constructor(body__buttons, button, tab, execute) {
      this.name_button = button;
      this.body__buttons = document.querySelector(body__buttons);
      this.button = document.querySelectorAll(button);
      this.tab = document.querySelectorAll(tab);
      this.execute = execute;
   }
   eventClick = () => {
      this.body__buttons.addEventListener('click', (event) => {
         if (event.target.closest(this.name_button)) {
            let n = event.target.closest(this.name_button).dataset.button;
            this.button.forEach((e) => { e.classList.toggle('active', e.dataset.button == n) });
            if (this.tab.length > 0) { this.tab.forEach((e) => { e.classList.toggle('active', e.dataset.tab == n) }) }
            if (this.execute) { this.execute() };
         }
      })
   }
}

/* инициализация конструктора для табов */
//new TabsSwitching('.tabs__buttons', '.tabs__button', '.tabs__page').eventClick();

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



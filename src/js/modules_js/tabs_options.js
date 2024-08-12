class TabsOpen {
   constructor(options) {
      this.pc = document.body.classList.contains('_pc'); // true если dasktop, иначе false. Работает в связке с isMobile
      this.parentTabs = document.querySelector(options.name);
      this.tabsList = this.parentTabs.querySelectorAll('.js-tab-body');
      this.hover = options.hover == false ? false : true; // реакция табов на hover
      this.closeAllTabs = options.closeAllTabs == true ? true : false; // закрывать все табы
      this.closeClickContent = options.closeClickContent == true ? true : false; // закрыть при клике в области контента таба
      this.externalFunction = options.externalFunction; // внешняя функция для события click
      this.externalFunctionResize = options.externalFunctionResize; // внешняя функция для события resize
   }
   init = () => {
      document.body.addEventListener('click', this.examinationClick);
      this.hover && this.pc && document.body.addEventListener('mouseover', this.examinationHover);
      this.resize();
   };
   examinationClick = (event) => {
      this.externalFunction && this.externalFunction(event);
      if (this.hover && this.pc) return;
      let eventElement = this.closeClickContent ? event.target.closest('.js-tab-body') : event.target.closest('.js-tab-button');
      if (eventElement && event.target.closest('.js-tab-body').classList.contains('active')) {
         this.close(event.target.closest('.js-tab-body'));
         return;
      }
      if (eventElement && !this.closeAllTabs) {
         this.open(event.target.closest('.js-tab-body'));
         return;
      }
      if (eventElement) {
         this.tabsList.forEach((element) => {
            element == event.target.closest('.js-tab-body') ? this.open(element) : this.close(element);
         });
         return;
      }
      if (!event.target.closest('.js-tab-content') && this.closeAllTabs) {
         this.tabsList.forEach(element => this.close(element));
      }
   }
   examinationHover = (event) => {
      if (event.target.closest('.js-tab-body')) {
         this.tabsList.forEach((element) => {
            element == event.target.closest('.js-tab-body') ? this.open(element) : this.close(element);
         });
      } else {
         this.tabsList.forEach(element => this.close(element));
      }
   }
   open = (element) => {
      element.querySelector('.js-tab-content').style.height = this.getSize(element) + 'px';
      element.classList.add('active');
   };
   close = (element) => {
      element.querySelector('.js-tab-content').style.height = '';
      element.classList.remove('active');
   };
   adjustment = () => {
      this.tabsList.forEach((e) => e.classList.contains('active') && this.open(e));
      this.externalFunctionResize && this.externalFunctionResize()
   };
   getSize = (element) => { return element.querySelector('.js-tab-content-inner').clientHeight };
   resize = () => window.addEventListener('resize', this.adjustment);
}

if (document.querySelector('.calculator')) {
   new TabsOpen({
      name: 'body',
      hover: false,
      closeAllTabs: true,
      closeClickContent: false,
      externalFunction: choise,
      // externalFunctionResize: outResize,
   }).init();
}

/* внешние функции */
function choise(event) {
   if (event.target.closest('.js-tabs-value')) {
      let tabBbody = event.target.closest('.js-tab-body');
      let tabSelect = tabBbody.querySelector('.js-tab-selected');
      let valueInput = event.target.closest('.js-tabs-value').querySelector('input').value;
      tabSelect.innerHTML = valueInput;
   }
}

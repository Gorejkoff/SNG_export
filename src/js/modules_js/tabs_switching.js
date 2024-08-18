class TabsSwitching {
   constructor(bodyTabs, bodyButtons, button, tab, execute) {
      this.bodyTabs = typeof bodyTabs == 'object' ? bodyTabs : document.body;
      this.bodyButtons = this.bodyTabs.querySelector(bodyButtons);
      this.listButtons = this.bodyTabs.querySelectorAll(button);
      this.nameButton = button;
      this.tab = this.bodyTabs.querySelectorAll(tab);
      this.execute = execute;
   }
   init = () => {
      this.bodyButtons.addEventListener('click', (event) => {
         if (event.target.closest(this.nameButton)) {
            let n = event.target.closest(this.nameButton).dataset.button;
            this.listButtons.forEach((e) => { e.classList.toggle('active', e.dataset.button == n) });
            if (this.tab.length > 0) { this.tab.forEach((e) => { e.classList.toggle('active', e.dataset.tab == n) }) }
            if (this.execute) { this.execute() };
         }
      })
   }
}

const CALCULATOR_LIST = document.querySelectorAll('.calculator__item');
if (CALCULATOR_LIST.length > 0) {
   CALCULATOR_LIST.forEach((e) => {
      new TabsSwitching(e, '.calculator__item-buttons', '.calculator__item-button', '.calculator__item-data').init();
   })
}

if (document.querySelector('.calculator__buttons-profile')) {
   new TabsSwitching(false, '.calculator__buttons-profile', '.calculator__proile-button', '.calculator__type').init();
}


if (document.querySelector('.product-card__tabs')) {
   new TabsSwitching('.product-card__content', '.product-card__content', '.js-product-tabs-button', '.product-card__tabs-content').init();
}



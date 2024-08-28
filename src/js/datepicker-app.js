let dayWeek = [
   "Понедельник",
   "Вторник",
   "Среда",
   "Четверг",
   "Пятница",
   "Суббота",
   "Воскресение",
];

let shortDayWeek = [
   "Пн",
   "Вт",
   "Ср",
   "Чт",
   "Пт",
   "Сб",
   "Вс",
];

let month = [
   "Январь",
   "Февраль",
   "Март",
   "Апрель",
   "Май",
   "Июнь",
   "Июль",
   "Август",
   "Сентябрь",
   "Октябрь",
   "Ноябрь",
   "Декабрь",
];
const DATA_ORDERS = [
   {
      date: '2024-7-13',
      status: 'shipped'
   },
   {
      date: '2024-7-30',
      status: 'shipped-payment'
   },
   {
      date: '2024-8-10',
      status: 'completed'
   },
   {
      date: '2024-8-17',
      status: 'ready-payment'
   },
   {
      date: '2024-9-11',
      status: 'finished'
   }
];

function Datepicker(name) {
   this.datepickerBody = document.querySelector(name);
   this.rangeDate = [];
   this.cellStart = ' dp-cell-start';
   this.cellEnd = ' dp-cell-end';
   this.buildDadepicker = () => {
      this.datepickerBody.insertAdjacentHTML(
         'afterbegin',
         `
      <div class="dp-wrapper-${name.replace('.', '')}">
         <div class="dp-body">
            <div class="dp-header">
               <div class="dp-block-date">
                  <div class="dp-month"></div>
                  <div class="dp-year"></div>
               </div>
               <button type="button" class="dp-button-prev">
               <svg aria-hidden="true" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M19 5.99991H3M6.5 1.09082L2 5.99991L6.5 10.909" stroke="#357AB8" stroke-width="2"/>
               </svg>
               </button>
               <button type="button" class="dp-button-next">
               <svg aria-hidden="true" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0 6H16M12.5 1.5L17 6L12.5 10.5" stroke="#357AB8" stroke-width="2"/>
               </svg>
               </button>
            </div>
            <div class="dp-week">
               <span class="dp-day-week" data-deyweek="1">${shortDayWeek[0]}</span>
		      	<span class="dp-day-week" data-deyweek="2">${shortDayWeek[1]}</span>
		      	<span class="dp-day-week" data-deyweek="3">${shortDayWeek[2]}</span>
		      	<span class="dp-day-week" data-deyweek="4">${shortDayWeek[3]}</span>
		      	<span class="dp-day-week" data-deyweek="5">${shortDayWeek[4]}</span>
		      	<span class="dp-day-week" data-deyweek="6">${shortDayWeek[5]}</span>
		      	<span class="dp-day-week" data-deyweek="7">${shortDayWeek[6]}</span>
            </div>
            <div class="dp-shell"></div>
         </div>
      </div>
      `
      )
   }
   this.buildDadepicker();
   this.nowDate = new Date();
   this.dbWrapper = document.querySelector(`.dp-wrapper-${name.replace('.', '')}`);
   this.datepickerRoot = this.dbWrapper.querySelector('.dp-body');
   this.buildCell = (numberYear, numberMonth, numberDate) => {
      numberYear = Number.isInteger(numberYear) ? numberYear : this.nowDate.getFullYear();
      //  numberMonth = numberMonth >= 0 && numberMonth <= 11 ? numberMonth : this.nowDate.getMonth();
      numberDate = Number.isInteger(numberDate) ? numberDate : this.nowDate.getDate();
      this.datepickerShell = this.datepickerRoot.querySelector('.dp-shell');
      this.createMonth = new Date(numberYear, numberMonth, numberDate);
      this.thisMonth = this.createMonth.getMonth();
      this.thisYear = this.createMonth.getFullYear();
      this.createMonth.setDate(1);
      /* запись названия месяца */
      this.datepickerRoot.querySelector('.dp-month').innerHTML = month[this.createMonth.getMonth()];
      this.datepickerRoot.querySelector('.dp-year').innerHTML = this.createMonth.getFullYear();
      this.datepickerShell.innerHTML = '';
      /* построение дней месяца */
      for (let i = this.createMonth.getMonth(), q = this.createMonth.getDate(); i == this.createMonth.getMonth(); this.createMonth.setDate(++q)) {
         let thisCellDate = Date.parse(new Date(this.createMonth.getFullYear(), this.createMonth.getMonth(), this.createMonth.getDate()));
         /* поиск совпадений меток статуса */
         let result = DATA_ORDERS.find(searchStatus, thisCellDate);
         if (this.nowDate.toDateString() !== this.createMonth.toDateString()) {
            this.datepickerShell.insertAdjacentHTML('beforeend',
               `<div class="dp-cell ${result && result.status}"
            data-date="${this.createMonth.getDate()}"
            data-month="${this.createMonth.getMonth()}"
            data-year="${this.createMonth.getFullYear()}">
            ${this.createMonth.getDate()}</div>`);
         } else {
            this.datepickerShell.insertAdjacentHTML('beforeend',
               `<div class="dp-cell dp-now-date" 
            data-date="${this.createMonth.getDate()}"
            data-month="${this.createMonth.getMonth()}"
            data-year="${this.createMonth.getFullYear()}">
            ${this.createMonth.getDate()}</div>`);
         }
      }
      /* построение дней следующего месяца */
      while (this.createMonth.getDay() !== 1) {
         let thisCellDate = Date.parse(new Date(this.createMonth.getFullYear(), this.createMonth.getMonth(), this.createMonth.getDate()));
         /* поиск совпадений меток статуса */
         let result = DATA_ORDERS.find(searchStatus, thisCellDate);
         this.datepickerShell.insertAdjacentHTML('beforeend',
            `<div class="dp-cell dp-cell-next ${result && result.status}" 
            data-date="${this.createMonth.getDate()}"
            data-month="${this.createMonth.getMonth()}"
            data-year="${this.createMonth.getFullYear()}">
            ${this.createMonth.getDate()}</div>`);
         this.createMonth.setDate(this.createMonth.getDate() + 1)
      }
      /* построение дней предыдущего месяца */
      this.createMonth = new Date(this.thisYear, this.thisMonth, 1);
      while (this.createMonth.getDay() !== 1) {
         this.createMonth.setDate(this.createMonth.getDate() - 1);
         let thisCellDate = Date.parse(new Date(this.createMonth.getFullYear(), this.createMonth.getMonth(), this.createMonth.getDate()));
         /* поиск совпадений меток статуса */
         let result = DATA_ORDERS.find(searchStatus, thisCellDate);
         this.datepickerShell.insertAdjacentHTML('afterbegin',
            `<div class="dp-cell dp-cell-prev ${result && result.status}" 
            data-date="${this.createMonth.getDate()}"
            data-month="${this.createMonth.getMonth()}"
            data-year="${this.createMonth.getFullYear()}">
            ${this.createMonth.getDate()}</div>`);
      }
      this.createMonth = new Date(this.thisYear, this.thisMonth, 1)
   }
   this.buildCell(this.nowDate.getFullYear(), this.nowDate.getMonth(), this.nowDate.getDate());

   this.dbWrapper.addEventListener('click', (event) => {
      /* листание следующий месяц */
      if (event.target.closest('.dp-button-next')) {
         this.buildCell(this.createMonth.getFullYear(), this.createMonth.getMonth() + 1);
      }
      /* листание предыдущий месяц */
      if (event.target.closest('.dp-button-prev')) {
         this.buildCell(this.createMonth.getFullYear(), this.createMonth.getMonth() - 1);
      }
   })

   /* событие клавиш стрелок впрерёд, назад, листание месяцев  */
   /*   document.addEventListener('keydown', (event) => {
        if (event.code == 'ArrowRight') {
           this.buildCell(this.createMonth.getFullYear(), this.createMonth.getMonth() + 1);
        }
        if (event.code == 'ArrowLeft') {
           this.buildCell(this.createMonth.getFullYear(), this.createMonth.getMonth() - 1);
        }
     }) */
}

function searchStatus(element) {
   return Date.parse(new Date(element.date)) == this;
}

let datepicker = new Datepicker('.datepicker');
/* === datepicker.rangeDate массив с предельными датами === */



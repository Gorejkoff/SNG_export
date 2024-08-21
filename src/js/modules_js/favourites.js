if (document.querySelector('.product-card__favourites-body')) {
   const CHECK_ALL = document.querySelectorAll('.check__all input');
   const CHECK_ITEM = document.querySelectorAll('.check__item input');
   const CHECK_DALETE = document.querySelectorAll('.check__delete input');

   CHECK_ALL.forEach((element) => {
      element.addEventListener('change', () => {
         changeCheckedAll(element, CHECK_ALL, CHECK_ITEM);
      })
   })

   CHECK_DALETE.forEach((element) => {
      element.addEventListener('change', () => {
         changeCheckedAll(element, CHECK_DALETE);
      })
   })

   function changeCheckedAll(element, list, sublist) {
      if (element.checked) {
         list && list.forEach((e) => { e.checked = true });
         sublist && sublist.forEach((e) => { e.checked = true });
      } else {
         list && list.forEach((e) => { e.checked = false });
         sublist && sublist.forEach((e) => { e.checked = false });
      }
   }



   /* document.addEventListener('change', (event) => {
      if (event.target.closest('.check__all')) {
         console.log(event.target);
      }
   }) */
}
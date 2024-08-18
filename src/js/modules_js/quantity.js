document.addEventListener('click', (event) => {
   // уменьшить количесво товара в корзине
   if (event.target.closest('.js-dicrement')) {
      dicrementQuantity(event);
   }
   // увеличить количесво товара в корзине
   if (event.target.closest('.js-increment')) {
      incrementQuantity(event);
   }

})

// проверка количесва в input при вводе
const QUANTITY_BASKET = document.querySelectorAll('.js-quantity input');
QUANTITY_BASKET.forEach((e) => {
   e.addEventListener('input', () => validationQuantityBasket(e))
})
// нельзя вводить меньше 1
function validationQuantityBasket(e) {
   if (e.value < 1) { e.value = 1; }
}
function dicrementQuantity(event) {
   const input = event.target.closest('.js-quantity').querySelector('input');
   input.value = Number(input.value) - 1;
   validationQuantityBasket(input);
}

function incrementQuantity(event) {
   const input = event.target.closest('.js-quantity').querySelector('input');
   input.value = Number(input.value) + 1;
}
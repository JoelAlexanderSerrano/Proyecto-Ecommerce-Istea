// main.js
import { initSearch } from './modules/search.js';
import { initCart } from './modules/cart.js';
import { initSlider } from './modules/slider.js';
import { initMenu } from './modules/menu.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM cargado");
  initSearch();
  initCart();
  initSlider({ interval: 5000 });
  initMenu();
});

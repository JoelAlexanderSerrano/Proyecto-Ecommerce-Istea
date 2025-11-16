// main.js
import { cargarProductos } from './modules/cards.js';
import { initSearch } from './modules/search.js';
import { initCart } from './modules/cart.js';
import { initSlider } from './modules/slider.js';
import { initMenu } from './modules/menu.js';
import { initDetails } from './modules/details.js'; // si lo usás

document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM cargado");

  // Primero renderizamos los productos dinámicos desde Airtable
  await cargarProductos();

  // Luego activamos las funciones que dependen de los productos
  initCart();
  initSearch();
  initDetails && initDetails();

  // Funciones generales
  initSlider({ interval: 5000 });
  initMenu();
});

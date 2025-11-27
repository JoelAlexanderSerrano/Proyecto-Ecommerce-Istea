import { cargarProductos } from './modules/cards.js';
import { initCartManager } from './modules/cart.js';
import { initMenu } from './modules/menu.js';
import { initSlider } from './modules/slider.js';   // ⬅️ ¡Nuevo Import!
import { initSearch } from './modules/search.js';   // ⬅️ ¡Nuevo Import!


document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicialización de Componentes
    initCartManager();
    initMenu();
    initSlider();  // ⬅️ ¡Inicializar el Slider!
    initSearch();  // ⬅️ ¡Inicializar la Búsqueda!

    // 2. Lógica de Filtrado y Búsqueda (SPA)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Leer ambos parámetros de la URL
    const categoriaFiltro = urlParams.get('categoria'); 
    const busquedaFiltro = urlParams.get('search'); // ⬅️ ¡Leer parámetro de búsqueda!
    
    // 3. Ejecutar la carga de productos con ambos filtros
    cargarProductos(categoriaFiltro, busquedaFiltro); // ⬅️ Pasar ambos parámetros
});
import { cargarProductos } from './modules/cards.js';
import { initCartManager } from './modules/cart.js';
import { initMenu } from './modules/menu.js';
import { initSlider } from './modules/slider.js';
import { initSearch } from './modules/search.js';
import { initMobileMenu } from './modules/mobile_menu.js';


document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicialización de Componentes Fijos
    // Estos módulos deben inicializarse primero
    initCartManager();
    initMenu();
    initSlider();
    initSearch();
    initMobileMenu();

    document.querySelectorAll('.dropdown > a').forEach(link => {
        link.addEventListener('click', function(e) {
            
            // Detiene la navegación (si href="#") para permitir el despliegue
            e.preventDefault(); 
            
            const parent = this.parentElement; // <li class="dropdown">
            const submenu = parent.querySelector(".dropdown-content");

            // Si el submenú existe, procedemos al toggle
  if (submenu.style.display === "block") {
      submenu.style.display = "none";
    } else {
      submenu.style.display = "block";
    }
  });
});

    // 3. Lógica de Filtrado y Búsqueda (SPA)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Leer ambos parámetros de la URL
    const categoriaFiltro = urlParams.get('categoria'); 
    const busquedaFiltro = urlParams.get('search');
    
    // 4. Ejecutar la carga de productos con ambos filtros
    cargarProductos(categoriaFiltro, busquedaFiltro); 
});
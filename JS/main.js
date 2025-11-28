import { cargarProductos } from './modules/cards.js';
import { initCartManager } from './modules/cart.js';
import { initMenu } from './modules/menu.js';
import { initSlider } from './modules/slider.js';
import { initSearch } from './modules/search.js';


document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicialización de Componentes
    initCartManager();
    initMenu();
    initSlider();
    initSearch();

    document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
        
        // Evita que el enlace # navegue
        e.preventDefault(); 
        
        const submenu = this.nextElementSibling;

        // Cierra cualquier otro submenú abierto
        document.querySelectorAll('.dropdown-content.open').forEach(openMenu => {
            if (openMenu !== submenu) {
                openMenu.classList.remove('open');
            }
        });
        
        // Alterna la clase 'open'
        if (submenu && submenu.classList.contains('dropdown-content')) {
            submenu.classList.toggle('open');
        }
    });
});

    // 2. Lógica de Filtrado y Búsqueda (SPA)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Leer ambos parámetros de la URL
    const categoriaFiltro = urlParams.get('categoria'); 
    const busquedaFiltro = urlParams.get('search');
    
    // 3. Ejecutar la carga de productos con ambos filtros
    cargarProductos(categoriaFiltro, busquedaFiltro); 
});
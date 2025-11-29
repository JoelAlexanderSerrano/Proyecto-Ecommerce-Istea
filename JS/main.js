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

    // 🚨 2. LÓGICA DEL DROPDOWN (SOLUCIÓN FINAL DE SELECCIÓN) 🚨
    document.querySelectorAll('.dropdown > a').forEach(link => {
        link.addEventListener('click', function(e) {
            
            // Detiene la navegación (si href="#") para permitir el despliegue
            e.preventDefault(); 
            
            // 🚨 CLAVE: Buscar el submenú navegando al LI padre y luego al UL hijo 🚨
            const parentLi = this.closest('.dropdown');
            const submenu = parentLi ? parentLi.querySelector('.dropdown-content') : null;

            // Si el submenú existe, procedemos al toggle
            if (submenu) {
                
                // Cierra cualquier otro submenú abierto
                document.querySelectorAll('.dropdown-content.open').forEach(openMenu => {
                    if (openMenu !== submenu) {
                        openMenu.classList.remove('open');
                    }
                });
                
                // Alterna la clase 'open' para desplegar/ocultar
                submenu.classList.toggle('open');
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
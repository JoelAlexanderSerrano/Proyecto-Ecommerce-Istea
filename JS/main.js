import { cargarProductos } from './modules/cards.js';
import { inicializarLocalStorage } from './modules/datos.js'; 

document.addEventListener('DOMContentLoaded', () => {
    
    
    inicializarLocalStorage();

    
    const path = window.location.pathname.toLowerCase();
    let categoriaFiltro = null;
    
    
    if (path.includes('nintendo.html')) {
        categoriaFiltro = 'Nintendo';
    } else if (path.includes('playstation.html')) {
        categoriaFiltro = 'Playstation'; 
    } else if (path.includes('xbox.html')) {
        categoriaFiltro = 'Xbox'; 
    }
    
    cargarProductos(categoriaFiltro);
    
});
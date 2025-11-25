import { cargarProductos } from './modules/cards.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica de Filtrado SPA (Single Page Application)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtiene el valor del parámetro 'categoria' de la URL (ej. 'Playstation')
    const categoriaFiltro = urlParams.get('categoria'); 
    
    // 2. Ejecutar la carga de productos con o sin filtro
    // La función cargarProductos ahora es responsable de llamar a la API y renderizar.
    cargarProductos(categoriaFiltro);
    
    // Aquí irán otras inicializaciones: slider, carrito, login, etc.
});
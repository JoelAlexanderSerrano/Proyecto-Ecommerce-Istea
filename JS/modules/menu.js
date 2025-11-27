// JS/modules/menu.js

export function initMenu() {
    console.log("Menú de categorías inicializado.");
    
    // Asume que los enlaces de categoría tienen la clase 'nav-link'
    const navLinks = document.querySelectorAll('.nav-link[data-categoria]'); 

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const categoria = e.currentTarget.dataset.categoria;
            
            if (categoria) {
                // Redirigir a la página principal con el filtro de categoría
                window.location.href = `index.html?categoria=${categoria}`;
            } else {
                // Si no tiene categoría (ej. un link de "Home" o "Todos")
                window.location.href = 'index.html';
            }
        });
    });
}
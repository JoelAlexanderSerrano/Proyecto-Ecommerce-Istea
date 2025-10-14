// modules/search.js
export function initSearch() {
  console.log("search.js cargado");  // Para verificar que se ejecuta el módulo

  const input = document.querySelector('.search-bar input');
  const boton = document.querySelector('.search-bar .btn-buscar');
  const productos = document.querySelectorAll('.producto');

  console.log("Elementos encontrados:", { input, boton, productos }); 
  // Esto muestra si realmente encontró el input, el botón y los productos

  if (!input) return;

  input.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();

    productos.forEach(prod => {
      const nombre = prod.querySelector('h3').textContent.toLowerCase();
      prod.style.display = nombre.includes(query) ? '' : 'none';
    });
  });
}

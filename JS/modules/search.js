// modules/search.js
export function initSearch() {
  const input = document.querySelector('.search-bar input');
  const boton = document.querySelector('.search-bar .btn-buscar');

  if (!input) return;

  input.addEventListener('input', filtrar);
  boton?.addEventListener('click', filtrar);

  function filtrar() {
    const query = input.value.toLowerCase();
    const productos = document.querySelectorAll('.producto');

    productos.forEach(prod => {
      const nombre = prod.querySelector('h3').textContent.toLowerCase();
      prod.style.display = nombre.includes(query) ? '' : 'none';
    });
  }
}


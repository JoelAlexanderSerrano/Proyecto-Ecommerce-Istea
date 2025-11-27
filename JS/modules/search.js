export function initSearch() {
  const input = document.querySelector('.search-bar input');
  const boton = document.querySelector('.search-bar .btn-buscar');

  if (!input) return;

  // 🚨 Función que manejará el envío de la consulta (query) 🚨
  function handleSearch(query) {
    if (!query || query.trim() === '') return;
    
    // Redirige al index.html con el parámetro de búsqueda
    // La función cargarProductos (cards.js) leerá este parámetro
    const encodedQuery = encodeURIComponent(query.trim());
    window.location.href = `index.html?search=${encodedQuery}`;
  }

  // Escuchar el evento 'Enter' en el input
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch(input.value);
      e.preventDefault(); // Previene el envío de formularios si existe
    }
  });
  
  // Escuchar el clic en el botón
  boton?.addEventListener('click', (e) => {
    e.preventDefault();
    handleSearch(input.value);
  });
}
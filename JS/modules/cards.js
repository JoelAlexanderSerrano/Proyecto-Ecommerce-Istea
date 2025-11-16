// modules/cards.js
export async function cargarProductos(filtroCategoria = null) {

  const API_URL =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "/data/productos.json"
      : "/api/productos";

  const res = await fetch(API_URL);
  const productos = await res.json();

  const contenedor = document.querySelector("#lista-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  let filtrados = filtroCategoria
    ? productos.filter(p => p.categoria === filtroCategoria)
    : productos;

  filtrados.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <span class="precio">$${p.precio}</span>

        <button class="btn-add-cart" data-id="${p.id}">
          Agregar al carrito
        </button>

        <a class="ver-detalle" href="./producto.html?id=${p.id}">
          Ver detalle
        </a>
      </div>
    `;
  });
}

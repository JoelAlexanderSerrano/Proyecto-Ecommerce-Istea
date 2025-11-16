// details.js
export function initDetails() {
  const contenedor = document.querySelector("#detalle");
  if (!contenedor) return; // No estamos en la página de detalles

  cargarDetalle();
}

async function cargarDetalle() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  if (!id) return;

  // Ruta dinámica según entorno (localhost / producción)
  const API_URL =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "/data/productos.json"
      : "/api/productos";

  const res = await fetch(API_URL);
  const productos = await res.json();
  const prod = productos.find((p) => p.id == id);

  if (!prod) {
    document.querySelector("#detalle").innerHTML =
      "<p>Producto no encontrado.</p>";
    return;
  }

  document.querySelector("#detalle").innerHTML = `
    <div class="detalle-producto">
      <h1>${prod.nombre}</h1>
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <p>${prod.descripcion}</p>
      <strong>$${prod.precio}</strong>

      <button class="btn-add-cart" data-id="${prod.id}">
        Agregar al carrito
      </button>
    </div>
  `;
}

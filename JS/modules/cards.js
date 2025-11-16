import { getProductos } from "./api.js"; // ⬅️ ¡Importa la función de api.js!

export async function cargarProductos(filtroCategoria = null) {
  
  // 1. Llama a la función getProductos() de api.js
  const productos = await getProductos(); 

  // 2. Comprobación de errores (opcional pero útil)
  if (!productos || productos.length === 0) {
      console.error("No se pudieron cargar los productos. Revisar logs de Vercel.");
      const contenedor = document.querySelector("#lista-productos");
      if(contenedor) contenedor.innerHTML = "<p>Error al cargar productos o no hay productos.</p>";
      return;
  }

  // A partir de aquí, el resto de tu código que maneja el DOM...
  const contenedor = document.querySelector("#lista-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  let filtrados = filtroCategoria
    ? productos.filter(p => p.categoria === filtroCategoria)
    : productos;
    
  // ... (el resto del código HTML para renderizar las cards)
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


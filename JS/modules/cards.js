import { getProductos } from "./api.js";

// Límite constante para productos destacados
const LIMITE_DESTACADOS = 5; 

export async function cargarProductos(filtroCategoria = null) {
  
  const productos = await getProductos(); 

  if (!productos || productos.length === 0) {
      console.error("No se pudieron cargar los productos.");
      const contenedor = document.querySelector("#lista-productos");
      if(contenedor) contenedor.innerHTML = "<p>Error al cargar productos o no hay productos.</p>";
      return;
  }

  const contenedor = document.querySelector("#lista-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  let filtrados = filtroCategoria
    ? productos.filter(p => p.categoria === filtroCategoria)
    : productos;
    
  // 🚨 1. Limitar el array a 5 elementos 🚨
  let destacados = filtrados.slice(0, LIMITE_DESTACADOS);
  
  let htmlContent = ''; 

  destacados.forEach(p => {
    // ⚠️ Fallback para la imagen: si Airtable no devuelve la URL, usa un placeholder local
    const imagenSrc = p.imagen.length > 0 ? p.imagen : './Images/placeholder.png'; 

    // 🚨 2. Usar la clase .producto y eliminar la descripción 🚨
    htmlContent += `
      <div class="producto"> 
        <img src="${imagenSrc}" alt="${p.nombre}"> 
        <h3>${p.nombre}</h3>
        
        <p class="precio">$${p.precio}</p> 

        <button class="btn-add-cart" data-id="${p.id}">
          Agregar al carrito
        </button>

        <a class="ver-detalle" href="./producto.html?id=${p.id}">
          Ver detalle
        </a>
      </div>
    `;
  });

  contenedor.innerHTML = htmlContent;
}
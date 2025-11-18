import { inicializarLocalStorage, getProductosLocal } from './datos.js'; 

const LIMITE_DESTACADOS = 5; 

export function cargarProductos(filtroCategoria = null) {
  
  
  const productos = getProductosLocal(); 
  const contenedor = document.querySelector("#lista-productos");

  if (!contenedor) return;
  contenedor.innerHTML = "";

  
  let productosAMostrar;

  if (filtroCategoria) {
      
      productosAMostrar = productos.filter(p => p.categoria === filtroCategoria);
  } else {
      
      productosAMostrar = productos.slice(0, LIMITE_DESTACADOS);
  }
  
  if (!productosAMostrar || productosAMostrar.length === 0) {
      contenedor.innerHTML = `<p>No se encontraron productos para ${filtroCategoria || 'Destacados'}.</p>`;
      return;
  }
  
  
  let htmlContent = productosAMostrar.map(p => {
    
    const imagenSrc = p.imagen.length > 0 ? p.imagen : './Images/placeholder.png'; 

    return `
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
  }).join("");

  contenedor.innerHTML = htmlContent;
}
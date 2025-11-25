// JS/modules/cards.js

import { getProductos } from './api.js'; // Asegúrate de que esta ruta sea correcta

const LIMITE_DESTACADOS = 5; 

export async function cargarProductos(filtroCategoria = null) {
  
  // 1. Obtener datos de la API (Netlify)
  let productos = [];
  try {
      productos = await getProductos(); 
  } catch (error) {
      console.error("Error al obtener productos de la API:", error);
      const contenedor = document.querySelector("#lista-productos");
      if(contenedor) contenedor.innerHTML = "<p>Error crítico al cargar los datos. Revisa la API.</p>";
      return;
  }

  const contenedor = document.querySelector("#lista-productos");
  if (!contenedor) return;

  contenedor.innerHTML = ""; // Limpiar antes de renderizar

  // 2. Aplicar el filtrado y límite de destacados
  let productosAMostrar;

  if (filtroCategoria) {
      productosAMostrar = productos.filter(p => 
          p.categoria === filtroCategoria
      );
  } else {
      productosAMostrar = productos.slice(0, LIMITE_DESTACADOS);
  }
  
  if (!productosAMostrar || productosAMostrar.length === 0) {
      contenedor.innerHTML = `<p>No se encontraron productos para ${filtroCategoria || 'Destacados'}.</p>`;
      return;
  }
  
  // 3. Renderizar y Formatear Precios
  
  let htmlContent = productosAMostrar.map(p => {
    
    // Convertir el precio de Airtable a número (usamos 0 si falla)
    const precioBase = parseFloat(p.precio) || 0; 
    
    // Simulación: Precio de Lista (+15% de ejemplo)
    const precioListaCalculado = (precioBase * 1.15); 
    const precioEfectivo = precioBase; 

    // 🚨 FORMATEO DE MONEDA 🚨
    const formatterOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const precioListaFormato = precioListaCalculado.toLocaleString('es-AR', formatterOptions);
    const precioEfectivoFormato = precioEfectivo.toLocaleString('es-AR', formatterOptions);
    
    const imagenSrc = p.imagen.length > 0 ? p.imagen : './Images/placeholder.png'; 

    return `
      <article class="producto"> 
        <img src="${imagenSrc}" alt="${p.nombre}"> 
        <h3>${p.nombre}</h3>
        
        <div class="price-box">
            <p class="list-price-label">Precio de Lista:</p>
            <p class="list-price">
                $${precioListaFormato}
            </p> 

            <p class="effective-price-label">Efectivo/Transferencia:</p>
            <p class="effective-price">
                $${precioEfectivoFormato}
            </p>
        </div>

        <button class="btn-add-cart" data-id="${p.id}">
          Agregar al carrito
        </button>

        <a class="ver-detalle" href="./producto.html?id=${p.id}">
          Ver detalle
        </a>
      </article>
    `;
  }).join("");

  contenedor.innerHTML = `<div class="grid">${htmlContent}</div>`;
}
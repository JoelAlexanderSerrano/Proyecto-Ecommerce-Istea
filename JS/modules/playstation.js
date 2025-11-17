import { getProductosByCategory } from "./api.js"; // Asegúrate que la ruta sea correcta

export async function initPlaystation() {
    const contenedor = document.querySelector("#lista-productos");

    
    if (!contenedor) return; 
    contenedor.innerHTML = ''; 

    const productos = await getProductosByCategory("Playstation"); 

    if (!productos || productos.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron productos para PlayStation.</p>";
        return;
    }

   
    const htmlContent = productos.map(p => {
        const imagenSrc = p.imagen && p.imagen.length > 0 ? p.imagen : '../Images/placeholder.png'; 
        
        return `
            <div class="producto"> 
                <img src="${imagenSrc}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                
                <p class="precio">$${p.precio}</p> <button class="btn-add-cart" data-id="${p.id}">
                    Agregar al carrito
                </button>

                <a class="ver-detalle" href="../producto.html?id=${p.id}">
                    Ver detalle
                </a>
            </div>
        `;
    }).join("");

    contenedor.innerHTML = htmlContent;
}
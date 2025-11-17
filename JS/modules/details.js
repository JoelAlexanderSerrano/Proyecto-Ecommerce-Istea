import { getProductoById } from "./api.js";

export async function initDetails() {
    
    const contenedor = document.querySelector("#detalle");
    if (!contenedor) {
        // Si no estamos en la página de detalle, salimos de la función sin error.
        return; 
    }
    // ----------------------------------------------------

    // --- Obtener ID de la URL ---
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        contenedor.innerHTML = "<p>Error: No se especificó un producto.</p>";
        return;
    }

    // --- Obtener producto desde API ---
    try {
        const producto = await getProductoById(id);

        // Si la API devuelve null/undefined o un objeto de error
        if (!producto || producto.error) {
            contenedor.innerHTML = "<p>Error: Producto no encontrado.</p>";
            return;
        }

        // 🚨 MEJORA: Fallback para la URL de la imagen 🚨
        const imagenSrc = producto.imagen && producto.imagen.length > 0 
            ? producto.imagen 
            : './Images/placeholder.png'; 

        // --- Render del detalle ---
        contenedor.innerHTML = `
            <div class="detalle-container">
                
                <div class="detalle-img">
                    <img src="${imagenSrc}" alt="${producto.nombre}">
                </div>

                <div class="detalle-info">
                    <h2>${producto.nombre}</h2>

                    <p class="detalle-precio">$${producto.precio}</p>

                    <p class="detalle-descripcion">
                        ${producto.descripcion}
                    </p>

                    <button class="btn agregar" data-id="${producto.id}">
                        Agregar al carrito
                    </button>

                    <a href="index.html" class="btn volver">Volver</a>
                </div>

            </div>
        `;

    } catch (error) {
        console.error("Error cargando producto:", error);
        contenedor.innerHTML = "<p>Error al cargar los datos del producto.</p>";
    }
}
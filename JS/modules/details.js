import { getProductoById } from "./api.js";

export async function initDetails() {
    const contenedor = document.querySelector("#detalle");

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

        if (!producto) {
            contenedor.innerHTML = "<p>Error: Producto no encontrado.</p>";
            return;
        }

        // --- Render del detalle ---
        contenedor.innerHTML = `
            <div class="detalle-container">
                
                <div class="detalle-img">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
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

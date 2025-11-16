import { getProductos } from "./api.js";

export async function initProductos() {
    const contenedor = document.querySelector("#productos");  // ← corregido

    const productos = await getProductos();

    contenedor.innerHTML = productos.map(p => `
        <div class="card">
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>$${p.precio}</p>

            <!-- Ruta correcta al detalle -->
            <a href="./details.html?id=${p.id}" class="btn">Ver detalle</a>

            <button class="btn agregar" data-id="${p.id}">Agregar al carrito</button>
        </div>
    `).join("");
}

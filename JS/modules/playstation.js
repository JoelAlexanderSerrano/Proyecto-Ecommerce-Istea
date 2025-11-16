import { getProductosByCategory } from "./api.js";

export async function initPlaystation() {
    const cont = document.querySelector("#lista-ps");
    const productos = await getProductosByCategory("PlayStation");

    cont.innerHTML = productos.map(p => `
        <div class="card">
            <img src="${p.imagen}">
            <h3>${p.nombre}</h3>
            <p>$${p.precio}</p>
            <a href="producto.html?id=${p.id}" class="btn">Ver detalle</a>
            <button class="btn agregar" data-id="${p.id}">Agregar al carrito</button>
        </div>
    `).join("");
}

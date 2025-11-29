import * as CartManager from './cart.js'; // Contiene getCartItems, eliminarProducto, etc.
import { getProductos } from './api.js'; // Contiene la función GET para obtener todos los productos

let allProductsMasterList = []; // Almacenará todos los productos para buscar nombres y precios

/**
 * Inicializa y carga la tabla del carrito.
 */
export async function initCartRender() {
    const tablaContainer = document.querySelector('#carrito-tabla-container');
    const resumenContainer = document.querySelector('#resumen-detalle');

    if (!tablaContainer || !resumenContainer) return;
    
    // 1. Obtener los detalles de TODOS los productos de Airtable/API
    // Esto es necesario para obtener el nombre, precio y stock de cada ID en el carrito.
    allProductsMasterList = await getProductos();

    // 2. Cargar y renderizar todo
    renderCart();
}

/**
 * Función principal para renderizar la tabla y el resumen.
 */
function renderCart() {
    const carritoItems = CartManager.getCartItems();
    const tablaContainer = document.querySelector('#carrito-tabla-container');
    const resumenContainer = document.querySelector('#resumen-detalle');

    if (carritoItems.length === 0) {
        tablaContainer.innerHTML = '<h2>Tu carrito está vacío.</h2><p>Añade algunos joysticks para continuar.</p>';
        resumenContainer.innerHTML = '';
        return;
    }

    let subtotal = 0;

    // 3. Generar las filas de la tabla
    const tablaHTML = `
        <table class="tabla-carrito">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${carritoItems.map(item => {
                    const productDetail = allProductsMasterList.find(p => p.id === item.id);
                    // Si no encuentra el detalle (ej. producto borrado), lo salta
                    if (!productDetail) return ''; 
                    
                    const precioUnitario = parseFloat(productDetail.precio) || 0;
                    const itemSubtotal = precioUnitario * item.cantidad;
                    subtotal += itemSubtotal;
                    
                    const precioUnitarioFormato = precioUnitario.toLocaleString('es-AR', { minimumFractionDigits: 2 });
                    const itemSubtotalFormato = itemSubtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 });

                    return `
                        <tr>
                            <td>${productDetail.nombre}</td>
                            <td>$${precioUnitarioFormato}</td>
                            <td>
                                <input type="number" 
                                       class="input-cantidad" 
                                       data-id="${item.id}" 
                                       value="${item.cantidad}" 
                                       min="1">
                            </td>
                            <td>$${itemSubtotalFormato}</td>
                            <td>
                                <button class="btn-quitar" data-id="${item.id}" title="Quitar">❌</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    // 4. Generar el resumen de totales
    const totalIVA = subtotal * 0.21; // Simular 21% de IVA
    const totalFinal = subtotal + totalIVA;
    
    const resumenHTML = `
        <div class="resumen-detalle">
            <p>Subtotal: <span>$${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></p>
            <p>IVA (21%): <span>$${totalIVA.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></p>
            <h4>Total Final: <span>$${totalFinal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span></h4>
        </div>
        <button id="btn-finalizar-compra" class="btn-guardar">Finalizar Compra</button>
        <button id="btn-vaciar-carrito" class="btn-cancelar">Vaciar Carrito</button>
    `;

    tablaContainer.innerHTML = tablaHTML;
    resumenContainer.innerHTML = resumenHTML;
    
    // 5. Inicializar listeners
    initCartEventListeners(); 
}

/**
 * Asigna listeners a la tabla (cambio de cantidad y eliminar).
 */
function initCartEventListeners() {
    // Escucha el botón "Eliminar" (DELETE)
    document.querySelectorAll('.btn-quitar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            CartManager.eliminarProducto(e.currentTarget.dataset.id);
            renderCart(); // Vuelve a renderizar la página
        });
    });

    // Escucha el cambio de cantidad
    document.querySelectorAll('.input-cantidad').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = e.currentTarget.dataset.id;
            const nuevaCantidad = e.currentTarget.value;
            CartManager.cambiarCantidad(id, nuevaCantidad);
            renderCart(); // Vuelve a renderizar
        });
    });
    
    // Escucha el botón "Vaciar Carrito"
    document.querySelector('#btn-vaciar-carrito')?.addEventListener('click', () => {
        if (confirm('¿Está seguro de que desea vaciar todo el carrito?')) {
            CartManager.vaciarCarrito();
            renderCart();
            window.location.href = '../index.html';
        }
    });
    
    // Escucha el botón "Finalizar Compra"
    document.querySelector('#btn-finalizar-compra')?.addEventListener('click', () => {
        alert("¡Compra finalizada! Gracias por elegirnos.");
        CartManager.vaciarCarrito();
        renderCart();
        window.location.href = '../index.html';
    });
}
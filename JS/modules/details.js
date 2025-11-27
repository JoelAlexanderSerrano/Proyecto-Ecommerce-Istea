import { getProductos } from './api.js'; // Función para obtener todos los productos

/**
 * Función principal para cargar y mostrar el detalle de un solo producto.
 */
export async function loadProductDetail() {
    // 1. Obtener el ID del producto desde la URL (ej: ?id=recQ...)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const mainContainer = document.querySelector('#detalle-producto-main');
    if (!mainContainer) return;

    // Si no hay ID, o si estamos en la página equivocada
    if (!productId) {
        mainContainer.innerHTML = '<h1>Producto no especificado.</h1>';
        return;
    }

    try {
        mainContainer.innerHTML = '<h2>Cargando detalle...</h2>';

        // 2. Obtener todos los productos de la API (para encontrar el ID)
        const allProducts = await getProductos();
        
        // 3. Buscar el producto específico
        const product = allProducts.find(p => p.id === productId);

        if (!product) {
            mainContainer.innerHTML = '<h1>Producto no encontrado.</h1>';
            return;
        }

        // 4. Formatear datos para la visualización
        const precioFormato = (product.precio * 1.15).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const precioEfectivo = product.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // 5. Renderizar el HTML del Detalle
        mainContainer.innerHTML = renderDetailHTML(product, precioFormato, precioEfectivo);

    } catch (error) {
        console.error("Fallo al cargar el detalle del producto:", error);
        mainContainer.innerHTML = '<h1>Error al conectar con la base de datos.</h1>';
    }
}

/**
 * Función auxiliar para generar el HTML del detalle.
 */
function renderDetailHTML(p, precioLista, precioEfectivo) {
    return `
        <div class="detalle-card">
            
            <div class="detalle-imagen">
                <img src="${p.imagen}" alt="${p.nombre}">
            </div>

            <div class="detalle-info">
                <h1>${p.nombre}</h1>
                <p class="descripcion-completa">${p.descripcion}</p>
                
                <div class="price-detail-box">
                    <p class="detalle-list-price">Precio de Lista: $${precioLista}</p>
                    <p class="detalle-precio">Efectivo/Transferencia: 
                        <span class="final-price">$${precioEfectivo}</span>
                    </p>
                </div>
                
                <button class="btn-comprar btn-add-cart" data-id="${p.id}">
                    Agregar al Carrito
                </button>
                
                <p class="stock-info">Stock disponible: ${p.stock > 0 ? p.stock : 'Agotado'}</p>
            </div>
            
        </div>
    `;
}
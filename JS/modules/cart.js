const STORAGE_KEY = "carrito";
let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// --------------------------------------------------
// LÓGICA DE GESTIÓN (Usada por otras páginas/módulos)
// --------------------------------------------------

/** Retorna el array de ítems del carrito. */
export function getCartItems() {
    return carrito;
}

/** Guarda el estado actual del array en localStorage. */
const saveCart = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    actualizarContador();
};

/**
 * Agrega o incrementa la cantidad de un producto.
 * (Tu lógica original, ahora exportada para uso externo)
 */
export function agregarProducto(id, cantidad = 1) {
    cantidad = parseInt(cantidad, 10) || 1; 
    const itemIndex = carrito.findIndex(p => p.id === id);

    if (itemIndex !== -1) {
      carrito[itemIndex].cantidad += cantidad;
    } else {
      carrito.push({ id, cantidad });
    }
    saveCart();
}

/**
 * Cambia la cantidad de un ítem (usado en la página de carrito).
 */
export function cambiarCantidad(id, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad, 10);

    if (cantidad <= 0) {
        eliminarProducto(id);
        return;
    }

    const itemIndex = carrito.findIndex(p => p.id === id);
    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad = cantidad;
        saveCart();
    }
}

/**
 * Elimina completamente un producto del carrito.
 */
export function eliminarProducto(id) {
    carrito = carrito.filter(p => p.id !== id);
    saveCart();
}

/**
 * Vacía todo el carrito (Usado en el checkout).
 */
export function vaciarCarrito() {
    carrito = [];
    saveCart();
}

// --------------------------------------------------
// LÓGICA DE INTERFAZ (UI - Usada solo al iniciar)
// --------------------------------------------------

/** Actualiza el contador visual en el header. */
function actualizarContador() {
    const contador = document.querySelector('.carrito .contador');
    if (!contador) return;
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contador.textContent = `(${total})`;
}

/** Inicializador: Configura el contador y los listeners del botón "Agregar". */
export function initCartManager() {
    console.log("Cart Manager inicializado");
    actualizarContador();

    // Delegación para botones dinámicos (Tu lógica original)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("agregar") || 
            e.target.classList.contains("btn-add-cart")) {
            
            const id = e.target.dataset.id;
            agregarProducto(id, 1); 

            // Efecto visual de "Agregado"
            const originalText = e.target.textContent;
            e.target.textContent = "Agregado ✓";
            setTimeout(() => e.target.textContent = originalText, 800);
        }
    });
}
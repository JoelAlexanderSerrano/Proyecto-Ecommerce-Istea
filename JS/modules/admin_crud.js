import { getProductos } from './api.js'; 

const STORAGE_KEY = 'admin_productos';
let allProductsData = []; 
let currentEditingId = null; 

// ----------------------------------------------------
// 1. UTILIDADES LOCALES
// ----------------------------------------------------

/** Guarda el array completo en localStorage. */
const saveProductsToLocal = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProductsData));
};

/**
 * Función que limpia un valor de formulario y garantiza un número o 0.
 */
const sanitizeNumber = (value) => {
    if (!value) return 0;
    // Limpia separadores de miles y reemplaza coma por punto (si aplica)
    const cleanedString = String(value).replace(/\./g, '').replace(',', '.'); 
    const number = parseFloat(cleanedString);
    return isNaN(number) ? 0 : number; 
};


// ----------------------------------------------------
// 2. LECTURA Y RENDERIZADO (READ)
// ----------------------------------------------------

export async function loadAdminProducts() {
    const tableBody = document.querySelector('#product-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5">Cargando productos...</td></tr>';

    try {
        // 1. Intentar cargar desde LocalStorage
        const localData = localStorage.getItem(STORAGE_KEY);
        let productos = localData ? JSON.parse(localData) : [];
        
        // 2. Si es la primera vez (no hay datos locales), cargar de Airtable (API)
        if (productos.length === 0) {
            console.log("Cargando datos iniciales desde Airtable API...");
            productos = await getProductos();
            
            // Guardar los datos de Airtable en el LocalStorage por primera vez
            allProductsData = productos;
            saveProductsToLocal(); 
        } else {
            // Si hay datos locales, usar esa fuente (el caché local)
            allProductsData = productos;
        }

        // 3. Renderizar la tabla 
        if (productos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay productos.</td></tr>';
            return;
        }

        const rows = productos.map(p => `
            <tr>
                <td>${p.id ? p.id.substring(0, 4) + '...' : 'Nuevo'}</td>
                <td>${p.nombre}</td>
                <td>$${sanitizeNumber(p.precio).toLocaleString('es-AR')}</td>
                <td>${Math.floor(sanitizeNumber(p.stock))}</td>
                <td>
                    <button class="action-btn btn-editar" data-id="${p.id}">Editar</button>
                    <button class="action-btn btn-eliminar" data-id="${p.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = rows;
        initActionButtons(); // Re-inicializar listeners

    } catch (error) {
        console.error("Fallo al cargar la tabla de administración:", error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error-message">Error al conectar con la API de Lectura (Airtable).</td></tr>';
    }
}


// ----------------------------------------------------
// 3. LÓGICA DE EDICIÓN Y ELIMINACIÓN (Local CRUD)
// ----------------------------------------------------

function loadProductForEdit(productId) {
    const product = allProductsData.find(p => p.id === productId);
    
    if (!product) {
        alert('Producto no encontrado en el caché local.');
        return;
    }
    
    currentEditingId = productId;
    
    // Llenar todos los campos del formulario
    document.querySelector('#product-id').value = product.id; 
    document.querySelector('#product-nombre').value = product.nombre;
    document.querySelector('#product-descripcion').value = product.descripcion;
    document.querySelector('#product-precio').value = product.precio;
    document.querySelector('#product-stock').value = product.stock;
    document.querySelector('#product-categoria').value = product.categoria;
    document.querySelector('#product-imagen').value = product.imagen;

    document.querySelector('#form-title').textContent = 'Editar';
}

async function handleDelete(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto? (Eliminación LOCAL)')) {
        try {
            // 🚨 OPERACIÓN DELETE (D) en localStorage
            allProductsData = allProductsData.filter(p => p.id !== id);
            saveProductsToLocal();
            
            await loadAdminProducts(); 
            alert('Producto eliminado localmente.');
        } catch (error) {
            alert(`Error al eliminar: ${error.message}`);
        }
    }
}


// ----------------------------------------------------
// 4. LÓGICA DEL FORMULARIO (Local CRUD)
// ----------------------------------------------------

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    
    // 1. Recolección de Datos Saneados
    const productData = {
        nombre: form.querySelector('#product-nombre').value,
        descripcion: form.querySelector('#product-descripcion').value,
        precio: sanitizeNumber(form.querySelector('#product-precio').value),
        stock: Math.floor(sanitizeNumber(form.querySelector('#product-stock').value)), 
        categoria: form.querySelector('#product-categoria').value,
        imagen: form.querySelector('#product-imagen').value
    };

    try {
        if (currentEditingId) {
            // 🚨 OPERACIÓN UPDATE (U) en localStorage
            const index = allProductsData.findIndex(p => p.id === currentEditingId);
            if (index !== -1) {
                // Actualiza el producto manteniendo el ID original
                allProductsData[index] = { ...allProductsData[index], ...productData }; 
            }
            alert('Producto actualizado localmente.');
        } else {
            // 🚨 OPERACIÓN CREATE (C) en localStorage
            productData.id = 'loc-' + Date.now(); // ID único para productos creados localmente
            allProductsData.push(productData);
            alert('Producto creado localmente.');
        }
        
        saveProductsToLocal();
        resetForm();
        await loadAdminProducts(); 

    } catch (error) {
        alert(`Error en CRUD local: ${error.message}`);
    }
}

function resetForm() {
    document.querySelector('#product-form').reset();
    document.querySelector('#product-id').value = ''; 
    document.querySelector('#form-title').textContent = 'Crear Nuevo';
    currentEditingId = null; 
}


// ----------------------------------------------------
// 5. INICIALIZADORES
// ----------------------------------------------------

function initActionButtons() {
    document.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', () => {
            loadProductForEdit(button.dataset.id);
        });
    });
    
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', () => {
            handleDelete(button.dataset.id);
        });
    });
}

export function initAdminCrud() {
    const productForm = document.querySelector('#product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleFormSubmit);
    }
    
    document.querySelector('#cancel-btn').addEventListener('click', resetForm);
    loadAdminProducts(); 
}
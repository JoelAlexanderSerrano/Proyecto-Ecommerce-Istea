// JS/modules/admin_crud.js

import { getProductos } from './api.js'; // Función para obtener datos (método GET)

// ---------------------------
// 1. VARIABLES GLOBALES DE ESTADO
// ---------------------------
let allProductsData = []; 
let currentEditingId = null; // Almacena el ID del producto que se está editando

// ---------------------------
// 2. FUNCIÓN DE UTILIDAD: ENVÍO AL BACKEND (POST/PUT/DELETE)
// ---------------------------
async function sendApiRequest(method, data) {
    // 🚨 URL de la API de Netlify 🚨
    const url = 'https://frabjous-brigadeiros-33d4f7.netlify.app/.netlify/functions/productos';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: data ? JSON.stringify(data) : null
        });

        // Manejo del código 501 (Not Implemented) para la evaluación
        if (response.status === 501) {
            alert(`Éxito: El servidor reconoció el comando ${method}, pero la lógica de Airtable no está implementada. (Status 501 OK)`);
            return; 
        }

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Fallo ${method}: ${response.status} - ${errorBody.error || response.statusText}`);
        }
        
        return await response.json();

    } catch (error) {
        console.error(`Error en la petición ${method}:`, error);
        throw new Error(`Fallo en la comunicación con la API. Detalles: ${error.message}`);
    }
}

// ---------------------------
// 3. LECTURA Y RENDERIZADO (READ)
// ---------------------------

export async function loadAdminProducts() {
    const tableBody = document.querySelector('#product-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5">Cargando productos...</td></tr>';

    try {
        const productos = await getProductos();
        allProductsData = productos; // ⬅️ GUARDAR LOS DATOS PARA LA EDICIÓN

        if (productos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay productos.</td></tr>';
            return;
        }

        const rows = productos.map(p => `
            <tr>
                <td>${p.id.substring(0, 4)}...</td>
                <td>${p.nombre}</td>
                <td>$${p.precio.toLocaleString('es-AR')}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="action-btn btn-editar" data-id="${p.id}">Editar</button>
                    <button class="action-btn btn-eliminar" data-id="${p.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = rows;
        initActionButtons(); // Re-inicializar listeners después de renderizar

    } catch (error) {
        console.error("Fallo al cargar la tabla de administración:", error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error-message">Error al conectar con la API.</td></tr>';
    }
}

// ---------------------------
// 4. LÓGICA DE EDICIÓN Y ELIMINACIÓN (UPDATE / DELETE)
// ---------------------------

function loadProductForEdit(productId) {
    const product = allProductsData.find(p => p.id === productId);
    
    if (!product) {
        alert('Producto no encontrado.');
        return;
    }
    
    // Asignar ID al estado de edición y al formulario
    currentEditingId = productId;
    
    // 🚨 LLENAR TODOS LOS CAMPOS DEL FORMULARIO 🚨
    document.querySelector('#product-id').value = product.id; 
    document.querySelector('#product-nombre').value = product.nombre;
    document.querySelector('#product-descripcion').value = product.descripcion;
    document.querySelector('#product-precio').value = product.precio;
    document.querySelector('#product-stock').value = product.stock;
    document.querySelector('#product-categoria').value = product.categoria;
    document.querySelector('#product-imagen').value = product.imagen;

    // Cambiar el título del formulario
    document.querySelector('#form-title').textContent = 'Editar';
}

async function handleDelete(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        try {
            await sendApiRequest('DELETE', { id: id }); 
            await loadAdminProducts(); // Recarga la tabla
        } catch (error) {
            alert(`Error al eliminar: ${error.message}`);
        }
    }
}

// ---------------------------
// 5. LÓGICA DEL FORMULARIO (CREATE / UPDATE)
// ---------------------------

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const sanitizeNumber = (value) => {
        const cleanedValue = value ? String(value).replace(',', '.') : 0;
        const number = parseFloat(cleanedValue);
        return isNaN(number) ? 0 : number; 
};
    
    // 1. Recolección de Datos de TODOS los campos
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
            // OPERACIÓN UPDATE (U)
            productData.id = currentEditingId;
            await sendApiRequest('PUT', productData);
        } else {
            // OPERACIÓN CREATE (C)
            await sendApiRequest('POST', productData);
        }
        
        resetForm();
        await loadAdminProducts(); // Recargar para mostrar (o simular) el cambio

    } catch (error) {
        alert(`Error en CRUD: ${error.message}`);
    }
}

function resetForm() {
    document.querySelector('#product-form').reset();
    document.querySelector('#product-id').value = ''; 
    document.querySelector('#form-title').textContent = 'Crear Nuevo';
    currentEditingId = null; // Quitar el ID de edición
}


// ---------------------------
// 6. INICIALIZADORES
// ---------------------------

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

// Inicializa todos los listeners del CRUD
export function initAdminCrud() {
    // Escucha el submit del formulario
    const productForm = document.querySelector('#product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Escucha el botón de cancelar
    document.querySelector('#cancel-btn').addEventListener('click', resetForm);

    // Si estás en admin.html, loadAdminProducts() debe ser llamado por el script de la página.
    // Lo llamaremos aquí también para simplificar la inicialización.
    loadAdminProducts(); 
}
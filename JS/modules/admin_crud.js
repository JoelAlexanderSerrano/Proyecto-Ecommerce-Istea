// Importa la función de la API para obtener productos (GET)
import { getProductos } from './api.js'; 

// Función principal para cargar la tabla de administración
export async function loadAdminProducts() {
    const tableBody = document.querySelector('#product-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5">Cargando productos...</td></tr>';

    try {
        // 1. Obtener los datos de la API (Netlify/Airtable)
        const productos = await getProductos();

        if (productos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">No hay productos en la base de datos.</td></tr>';
            return;
        }

        // 2. Mapear y Renderizar las filas de la tabla
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
        
        // 3. Inicializar los eventos de los botones (Editar/Eliminar)
        initActionButtons();

    } catch (error) {
        console.error("Fallo al cargar la tabla de administración:", error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error-message">Error al conectar con la API.</td></tr>';
    }
}

// Función stub para manejar los eventos de los botones (Se completará después)
function initActionButtons() {
    document.querySelectorAll('.btn-editar').forEach(button => {
        button.addEventListener('click', () => console.log('Editar:', button.dataset.id));
    });
    document.querySelectorAll('.btn-eliminar').forEach(button => {
        button.addEventListener('click', () => console.log('Eliminar:', button.dataset.id));
    });
}
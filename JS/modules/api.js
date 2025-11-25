// URL base de tu función API en Netlify
const API_BASE_URL = 'https://frabjous-brigadeiros-33d4f7.netlify.app/.netlify/functions/';

export async function getProductos() {
    const response = await fetch(`${API_BASE_URL}productos`);
    
    if (!response.ok) {
        // En caso de fallo (ej. 404, 500, etc.)
        throw new Error(`Fallo al cargar productos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Los datos vienen en un array, listos para usar
    return data; 
}
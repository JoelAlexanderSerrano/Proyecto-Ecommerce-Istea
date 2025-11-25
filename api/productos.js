// api/productos.js

// Usamos fetch nativo para la conexión directa y robusta
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Productos`;

// La función principal debe llamarse 'handler' para que Netlify la encuentre
const handler = async (event, context) => {
    
    // 1. CONSTRUCCIÓN DE ENCABEZADOS Y CORS
    const headers = {
        // Permite a tu frontend (Netlify/localhost) acceder a esta API
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    // Manejar la solicitud OPTIONS (preflight check)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers // Devuelve los permisos CORS y termina
        };
    }

    try {
        // 2. SWITCH para manejar los diferentes métodos HTTP
        switch (event.httpMethod) {
            
            // =======================================================
            // GET: Leer/Obtener todos los productos
            // =======================================================
            case 'GET':
                // Ejecutar la solicitud HTTP directa a Airtable
                const airtableResponse = await fetch(AIRTABLE_API_URL, {
                    headers: {
                        // Utiliza el PAT/API Key en el encabezado de autorización
                        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
                    }
                });

                // Manejo de errores de conexión (401, 404, etc.)
                if (!airtableResponse.ok) {
                    const errorText = await airtableResponse.text();
                    console.error("Airtable HTTP Error:", airtableResponse.status, errorText);
                    throw new Error(`Fallo de conexión: Airtable Status ${airtableResponse.status}.`);
                }

                const data = await airtableResponse.json();

                // Mapeo y Limpieza de los datos de Airtable
                const productos = data.records.map(record => {
                    const fields = record.fields;
                    
                    // Asume que URL_Imagen es un string directo (por tu última configuración)
                    const imageUrl = fields.URL_Imagen ? fields.URL_Imagen : 'URL_IMAGEN_FALLBACK_SI_NO_HAY'; 
                    
                    return {
                        id: record.id,
                        nombre: fields.Nombre || 'Sin Nombre',
                        descripcion: fields.Descripcion || 'Sin descripción.',
                        precio: fields.Precio || 0,
                        imagen: imageUrl,
                        stock: fields['# Stock'] || 0,
                        categoria: fields.Categoria || 'General'
                    };
                });

                // Respuesta final de éxito (200 OK)
                return { 
                    statusCode: 200, 
                    headers, 
                    body: JSON.stringify(productos) 
                };

            // =======================================================
            // POST / PUT / DELETE: Métodos de escritura/modificación
            // =======================================================
            case 'POST':
            case 'PUT':
            case 'DELETE':
                // Devolvemos 501 Not Implemented: Reconocemos la petición, 
                // pero la lógica de base de datos no está escrita aún.
                return {
                    statusCode: 501, 
                    headers,
                    body: JSON.stringify({ error: "Método reconocido pero la lógica CRUD aún no ha sido implementada." })
                };
            
            default:
                // Si el método no es compatible (ej. PATCH)
                return {
                    statusCode: 405, // Method Not Allowed
                    headers,
                    body: JSON.stringify({ error: 'Método HTTP no permitido.' })
                };
        }
    } catch (error) {
        // 3. MANEJO DE ERRORES CRÍTICOS
        console.error("Critical Server Error:", error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Error al cargar los datos del servidor. (Verificar log de Netlify).",
                details: error.message 
            })
        };
    }
};

// 🚨 LÍNEA CRÍTICA: Exportar la función 'handler' para Netlify 🚨
module.exports = { handler };
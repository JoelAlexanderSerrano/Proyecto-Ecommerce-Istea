// api/productos.js - Lógica CRUD COMPLETA con Airtable

const Airtable = require('airtable');

// 🚨 VARIABLES DE ENTORNO 🚨
// Airtable requiere tu Base ID y API Key. DEBEN configurarse en Netlify
// bajo Settings > Build & deploy > Environment variables.
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

// Validar que las variables estén presentes
if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('AIRTABLE_API_KEY o AIRTABLE_BASE_ID no están definidos en las variables de entorno.');
}

// Inicializar Airtable
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
const TABLE_NAME = 'Productos'; // Nombre de tu tabla

// Encabezados CORS para permitir la comunicación con el frontend
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
};

// Función principal de Netlify Serverless
exports.handler = async (event, context) => {
    // Manejo de la solicitud CORS Preflight (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Parsear el cuerpo de la solicitud (si existe)
        let bodyData = {};
        if (event.body) {
            try {
                bodyData = JSON.parse(event.body);
            } catch (e) {
                return { statusCode: 400, headers, body: JSON.stringify({ error: 'Cuerpo de solicitud JSON inválido' }) };
            }
        }

        switch (event.httpMethod) {
            
            // -----------------------------------------------------------------
            // 1. LECTURA (GET) - Ya funcional, optimizada.
            // -----------------------------------------------------------------
            case 'GET':
                const records = await base(TABLE_NAME).select({
                    view: "Grid view" // Asegúrate de que esta vista exista en Airtable
                }).firstPage();

                const productos = records.map(record => {
                    const fields = record.fields;
                    let stockValue = fields.Stock;
                    const stockLimpio = parseInt(stockValue) || 0;

                    return {
                        id: record.id,
                        nombre: fields.Nombre || 'Sin Nombre',
                        descripcion: fields.Descripcion || 'Sin descripción.',
                        precio: fields.Precio || 0,
                        imagen: fields.URL_Imagen || 'URL_IMAGEN_FALLBACK_SI_NO_HAY',
                        stock: stockLimpio,
                        categoria: fields.Categoria || 'General'
                    };
                });

                return { statusCode: 200, headers, body: JSON.stringify(productos) };

            // -----------------------------------------------------------------
            // 2. CREACIÓN (POST) - Inserta un nuevo producto.
            // -----------------------------------------------------------------
            case 'POST':
                // Mapear el JSON del frontend a la estructura de campos de Airtable
                const newRecord = {
                    "Nombre": bodyData.nombre,
                    "Descripcion": bodyData.descripcion,
                    "Precio": parseFloat(bodyData.precio),
                    "Stock": parseInt(bodyData.stock, 10),
                    "Categoria": bodyData.categoria,
                    "URL_Imagen": bodyData.imagen
                };

                const createdRecord = await base(TABLE_NAME).create([{ fields: newRecord }]);
                
                return { 
                    statusCode: 201, 
                    headers, 
                    body: JSON.stringify({ 
                        message: "Producto creado exitosamente", 
                        id: createdRecord[0].id 
                    }) 
                };

            // -----------------------------------------------------------------
            // 3. ACTUALIZACIÓN (PUT) - Modifica un producto existente.
            // -----------------------------------------------------------------
            case 'PUT':
                const recordId = bodyData.id;
                
                if (!recordId) {
                    return { statusCode: 400, headers, body: JSON.stringify({ error: "ID es requerido para actualizar." }) };
                }

                const updateFields = {
                    "Nombre": bodyData.nombre,
                    "Descripcion": bodyData.descripcion,
                    "Precio": parseFloat(bodyData.precio),
                    "Stock": parseInt(bodyData.stock, 10),
                    "Categoria": bodyData.categoria,
                    "URL_Imagen": bodyData.imagen
                };

                await base(TABLE_NAME).update([
                    { id: recordId, fields: updateFields }
                ]);
                
                return { 
                    statusCode: 200, 
                    headers, 
                    body: JSON.stringify({ 
                        message: "Producto actualizado exitosamente", 
                        id: recordId 
                    }) 
                };

            // -----------------------------------------------------------------
            // 4. ELIMINACIÓN (DELETE) - Elimina un producto.
            // -----------------------------------------------------------------
            case 'DELETE':
                const deleteId = bodyData.id;

                if (!deleteId) {
                    return { statusCode: 400, headers, body: JSON.stringify({ error: "ID es requerido para eliminar." }) };
                }
                
                await base(TABLE_NAME).destroy([deleteId]);

                return { 
                    statusCode: 200, 
                    headers, 
                    body: JSON.stringify({ 
                        message: "Producto eliminado exitosamente", 
                        id: deleteId 
                    }) 
                };

            // -----------------------------------------------------------------
            default:
                // Manejo de métodos no permitidos
                return {
                    statusCode: 405,
                    headers,
                    body: JSON.stringify({ error: 'Método no permitido' })
                };
        }
    } catch (error) {
        console.error("Error en la función serverless:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Error interno del servidor', 
                message: error.message 
            })
        };
    }
};
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Productos`;

// La función principal debe llamarse 'handler'
const handler = async (event, context) => {
    
    // 🚨 Netlify usa el formato (event, context). Tenemos que retornar un objeto de respuesta HTTP.

    // 1. Configuración de CORS (Devolvemos las cabeceras directamente en la respuesta)
    const headers = {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json' // Para la respuesta final
    };

    // Manejar la solicitud OPTIONS (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers // Devolver solo las cabeceras
        };
    }

    try {
        // 2. Ejecutar la solicitud HTTP directa a Airtable
        const airtableResponse = await fetch(AIRTABLE_API_URL, {
            headers: {
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
            }
        });

        if (!airtableResponse.ok) {
            // Si Airtable devuelve 401, lo loggeamos y devolvemos un 500
            const errorText = await airtableResponse.text();
            console.error("Airtable HTTP Error:", airtableResponse.status, errorText);
            throw new Error(`Airtable Status ${airtableResponse.status}.`);
        }

        const data = await airtableResponse.json();

        // 3. Mapeo de datos (Tu lógica de mapeo es correcta)
        const productos = data.records.map(record => {
            const fields = record.fields;
            
            const imageUrl = fields.URL_Imagen
                             ? fields.URL_Imagen 
                             : 'URL_IMAGEN_FALLBACK_SI_NO_HAY'; 
            
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

        // 4. Devolver la respuesta final en el formato de Netlify
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(productos)
        };

    } catch (error) {
        // Manejo del error 500
        console.error("Critical Server Error:", error.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: "Error al cargar los datos del servidor.",
                details: error.message 
            })
        };
    }
};


module.exports = { handler };
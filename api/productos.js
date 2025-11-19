// api/productos.js (Código optimizado para Netlify/Vercel)

// La URL se construye DENTRO de la función para mayor robustez
module.exports = async (req, res) => {
    
    // 🚨 1. Construcción de la URL de Airtable API con las variables de entorno 🚨
    const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Productos`;
    
    // 2. CONFIGURACIÓN CORS (Crucial para el desarrollo local)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // 3. FETCH de los datos
        const airtableResponse = await fetch(AIRTABLE_API_URL, {
            headers: {
                // Utiliza el PAT/API Key en el encabezado de autorización
                'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
            }
        });

        // 4. Manejo de errores HTTP (ej: 401, 404, 500)
        if (!airtableResponse.ok) {
            const errorText = await airtableResponse.text();
            console.error("Airtable HTTP Error:", airtableResponse.status, errorText);
            throw new Error(`Fallo de conexión: Airtable Status ${airtableResponse.status}.`);
        }

        const data = await airtableResponse.json();

        // 5. Mapeo y Limpieza de los datos de Airtable
        const productos = data.records.map(record => {
            const fields = record.fields;
            
            const imageUrl = (fields.Imagen && Array.isArray(fields.Imagen) && fields.Imagen.length > 0) 
                             ? fields.Imagen[0].url 
                             : 'URL_IMAGEN_FALLBACK_SI_NO_HAY'; // Cambia esto por un placeholder real.
            
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

        // 6. Devolver la respuesta JSON
        res.status(200).json(productos);

    } catch (error) {
        console.error("Critical Server Error:", error.message);
        res.status(500).json({ 
            error: "Error al cargar los datos del servidor.",
            details: error.message 
        });
    }
};
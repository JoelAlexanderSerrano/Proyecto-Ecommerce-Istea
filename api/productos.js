import Airtable from "airtable";

export default async function handler(req, res) {
    
    // 1. CORS & OPTIONS Handler (Correct)
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json'); 

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { id, categoria } = req.query; 

    try {
        // 2. Auth Check (The authentication error in logs means keys are missing/wrong in Vercel settings!)
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
            .base(process.env.AIRTABLE_BASE_ID);

        // 3. DETAIL LOOKUP
        if (id) {
            const record = await base('Productos').find(id); // Use the find method
            if (!record) {
                return res.status(404).json({ error: "Producto no encontrado." });
            }
            return res.json(mapRecordToProduct(record));
        }

        // 4. LISTA & CATEGORY FILTERING
        
        let queryOptions = {}; // Prepare the options object
        if (categoria) {
            // 🚨 FIX 1: Correct Syntax: filterByFormula goes inside select options 🚨
            queryOptions.filterByFormula = `{Categoria} = '${categoria}'`;
        }
        
        const records = await base('Productos').select(queryOptions).all(); // Pass options here

        const productos = records.map(mapRecordToProduct);

        res.json(productos);
        
    } catch (error) {
        // Log the error (crucial for checking the API Key issue!)
        console.error("FALLO CRÍTICO DE AIRTABLE/VARS:", error);
        res.status(500).json({ error: "Fallo interno de la API. Revisar logs por keys." });
    }
}

// Helper function to map Airtable record to a clean product object
function mapRecordToProduct(record) {
    // 🚨 FIX 2: More robust image extraction 🚨
    const images = record.fields.Imagen || record.fields.URL_Imagen; 

    return {
        id: record.id,
        nombre: record.fields.Nombre,
        descripcion: record.fields.Descripcion,
        precio: record.fields.Precio,
        // Check if images is an array, then get the URL
        imagen: (Array.isArray(images) && images.length > 0) 
            ? images[0].url 
            : "",
        categoria: record.fields.Categoria 
    };
}
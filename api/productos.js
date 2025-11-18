import Airtable from "airtable";

export default async function handler(req, res) {
    
    // 1. 🚨 ARREGLO CORS Y FALLO DE SERVIDOR 🚨
    // Los encabezados deben ir PRIMERO, incluso antes del try/catch.
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json'); 

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    // ----------------------------------------
    
    const { id, categoria } = req.query; 

    try {
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
            .base(process.env.AIRTABLE_BASE_ID);

        // 2. DETALLE
        if (id) {
            // Lógica de detalle...
            // Omitido para mantener la brevedad.
        }

        // 3. LISTA
        let query = base('Productos').select(); 

        if (categoria) {
            // Filtro de igualdad simple. {Categoria} debe ser el nombre del campo.
            query = query.filterByFormula(`{Categoria} = '${categoria}'`);
        }
        
        const records = await query.all();

        const productos = records.map(record => ({
            id: record.id,
            nombre: record.fields.Nombre,
            descripcion: record.fields.Descripcion,
            precio: record.fields.Precio,
            imagen: record.fields.URL_Imagen || record.fields.Imagen[0].url || "", 
            // Usamos OR para ser flexibles con el nombre del campo de imagen.
        }));

        res.json(productos);
        
    } catch (error) {
        // 🚨 Si llega aquí, el servidor crasheó. Devolvemos JSON de error (no HTML). 🚨
        console.error("FALLO CRÍTICO DE AIRTABLE/VARS:", error);
        res.status(500).json({ error: "Fallo interno de la API. Revisar logs por keys." });
    }
}
import Airtable from "airtable";

export default async function handler(req, res) {
    
    // ⬇️ SOLUCIÓN SIMPLIFICADA PARA CORS ⬇️
    // Esto debería ser suficiente para permitir el acceso desde tu Live Server
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // ⬆️ FIN DEL BLOQUE CORS ⬆️

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
        .base(process.env.AIRTABLE_BASE_ID);

    if (req.query.id) {
        // DETALLE
        try {
            const record = await base('Productos').find(req.query.id);
            return res.json({
                id: record.id,
                nombre: record.fields.Nombre,
                descripcion: record.fields.Descripcion,
                precio: record.fields.Precio,
                imagen: record.fields.URL_Imagen ? record.fields.URL_Imagen[0].url : ""
            });
        } catch (error) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
    }

    // LISTA
    try {
        const records = await base('Productos').select().all();

        const productos = records.map(record => ({
            id: record.id,
            nombre: record.fields.Nombre,
            descripcion: record.fields.Descripcion,
            precio: record.fields.Precio,
            imagen: record.fields.Imagen ? record.fields.Imagen[0].url : ""
        }));

        res.json(productos);
    } catch (error) {
        console.error("Error al obtener productos de Airtable:", error);
        res.status(500).json({ error: "Fallo al conectar con la base de datos." });
    }
}
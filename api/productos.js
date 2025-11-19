const Airtable = require('airtable');

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const TABLE_NAME = 'Productos';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }


    try {
        const records = await base(TABLE_NAME).select({

        }).all();

        const productos = records.map(record => {
            const fields = record.fields;

            const imageUrl = (fields.Imagen && fields.Imagen.length > 0)
                              ? fields.Imagen[0].url
                              : 'URL_IMAGEN_FALLBACK_SI_NO_HAY';  

            return {
                id: record.id,
                nombre: fields.Nombre || 'Sin Nombre',
                descripcion: fields.Descripcion || 'Sin descripcion.',
                precio: fields.Precio || 0,
                imagen: imageUrl,
                stock: fields['# Stock'] || 0,
                categoria: fields.Categoria || 'General'

            };

        });

        res.status(200).json(productos);

    } catch (error) {
        console.error("Error al cargar los datos de Airtable:", error);

        res.status(500).json({
            error: "Error al cargar los datos del servidor.",
            details: error.message
        });
    }    

};    
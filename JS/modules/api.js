import { AIRTABLE_CONFIG } from '../../config.js' 

const API_URL = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/Productos`;

export async function getProductos() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                // Usar la clave importada
                'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}` 
            }
        });

        if (!response.ok) {
            throw new Error(`Airtable Fallo: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Mapeo de datos (simplificado)
        return data.records.map(record => ({
            id: record.id,
            nombre: record.fields.Nombre || 'Sin Nombre',
            descripcion: record.fields.Descripcion || 'Sin descripción.',
            precio: record.fields.Precio || 0,
            imagen: record.fields.URL_Imagen || '',
            stock: parseInt(record.fields.Stock) || 0,
            categoria: record.fields.Categoria || 'General'
        }));

    } catch (error) {
        console.error("Error al conectar con Airtable:", error);
        throw new Error("No se pudo conectar a la base de datos de Airtable.");
    }
}
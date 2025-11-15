// Archivo: /api/productos.js

export default async function handler(req, res) {
  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME;

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Error al obtener datos de Airtable" });
    }

    const data = await response.json();

    // Normalizamos para el frontend
    const productos = data.records.map(record => ({
      id: record.id,
      nombre: record.fields.Nombre || "",
      descripcion: record.fields.Descripcion || "",
      precio: record.fields.Precio || 0,
      imagen: record.fields.Imagen?.[0]?.url || "",
    }));

    res.status(200).json(productos);

  } catch (error) {
    console.error("Error en API:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

const BASE_URL = "https://proyecto-ecommerce-istea.vercel.app";

export async function getProductos() {
    const res = await fetch(`${BASE_URL}/api/productos`);
    return await res.json();
}

export async function getProductoById(id) {
    const res = await fetch(`${BASE_URL}/api/productos?id=${id}`);
    return await res.json();
}

export async function getProductosByCategory(category) {
    
    const res = await fetch(`${BASE_URL}/api/productos?categoria=${category}`); 
    
    
    if (!res.ok) {
        console.error(`Error al filtrar productos: ${res.status}`);
        return [];
    }
    
    return await res.json();
}
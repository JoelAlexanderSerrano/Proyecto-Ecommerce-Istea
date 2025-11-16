const BASE_URL = "https://proyecto-ecommerce-istea.vercel.app";

export async function getProductos() {
    const res = await fetch(`${BASE_URL}/api/productos`);
    return await res.json();
}

export async function getProductoById(id) {
    const res = await fetch(`${BASE_URL}/api/productos?id=${id}`);
    return await res.json();
}

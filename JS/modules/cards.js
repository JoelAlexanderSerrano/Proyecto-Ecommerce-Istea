import { getProductos } from './api.js'; 

const LIMITE_DESTACADOS = 8; 

/**
 * Función que devuelve el HTML para la página "En Construcción".
 * Usa las clases que ya tienes definidas en styles.css.
 */
function renderEnConstruccion(categoria) {
    return `
        <div class="en-construccion">
            <div class="intro">
                <h1>🛠️ SECCIÓN ${categoria.toUpperCase()} EN CONSTRUCCIÓN 🛠️</h1>
            </div>
            <p class="mensaje">
                Estamos trabajando duro para traer los mejores productos de esta categoría. 
                Vuelve pronto.
            </p>
            <img src="./Images/en_construccion.png" alt="En construcción" class="imagen-construccion">
        </div>
    `;
}

// 🚨 La función ahora acepta el filtro de búsqueda 🚨
export async function cargarProductos(filtroCategoria = null, busquedaFiltro = null) {
  
    // 1. Obtener datos de la API (Airtable)
    let productos = [];
    try {
        productos = await getProductos(); 
    } catch (error) {
        console.error("Error al obtener productos de la API:", error);
        const contenedor = document.querySelector("#lista-productos");
        if(contenedor) contenedor.innerHTML = "<p>Error crítico al cargar los datos. Revisa la API.</p>";
        return;
    }

    const contenedor = document.querySelector("#lista-productos");
    const tituloH2 = document.querySelector('.productos h2');
    
    if (!contenedor) return;

    contenedor.innerHTML = ""; 

    // 2. Lógica de Filtrado (Aplicar Categoría y Búsqueda)
    let productosAMostrar = productos;
    let tituloFiltro = '';

    // --- A. Aplicar el Filtrado por Categoría ---
    if (filtroCategoria) {
        productosAMostrar = productosAMostrar.filter(p => p.categoria === filtroCategoria);
        tituloFiltro = `${filtroCategoria}s`; // Ejemplo: "Playstations"
    }
    
    // --- B. Aplicar la Búsqueda ---
    if (busquedaFiltro) {
        const query = busquedaFiltro.toLowerCase();
        productosAMostrar = productosAMostrar.filter(p => 
            p.nombre.toLowerCase().includes(query) || 
            p.descripcion.toLowerCase().includes(query)
        );
        tituloFiltro = `Resultados para: "${busquedaFiltro}"`;
    }

    // --- C. Aplicar el límite solo si no hay ningún filtro (Destacados) ---
    if (!filtroCategoria && !busquedaFiltro) {
        productosAMostrar = productos.slice(0, LIMITE_DESTACADOS);
        tituloFiltro = 'Productos Destacados';
    }

    // 3. Manejo de errores y LÓGICA DE 'EN CONSTRUCCIÓN' 🚨
    if (productosAMostrar.length === 0) {
        
        // 🚨 PRIORIDAD: Mostrar sección "En Construcción" para categorías específicas
        if (filtroCategoria === 'Retro' || filtroCategoria === 'Arcade') {
            contenedor.innerHTML = renderEnConstruccion(filtroCategoria); 
            if (tituloH2) tituloH2.textContent = `Sección ${filtroCategoria}`;
            return; 
        }

        // Si es una búsqueda o una categoría normal vacía, mostramos el mensaje simple
        const mensaje = `No se encontraron productos para ${tituloFiltro}.`;
        contenedor.innerHTML = `<p>${mensaje}</p>`;
        if (tituloH2) tituloH2.textContent = tituloFiltro;
        return;
    }

    // 4. Actualizar el título de la página (<h2>)
    if (tituloH2) {
        tituloH2.textContent = tituloFiltro;
    }
    
    // 5. Renderizar y Formatear Precios
    
    let htmlContent = productosAMostrar.map(p => {
        
        const precioBase = parseFloat(p.precio) || 0; 
        const precioListaCalculado = (precioBase * 1.15); 
        const precioEfectivo = precioBase; 

        // FORMATEO DE MONEDA
        const formatterOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
        const precioListaFormato = precioListaCalculado.toLocaleString('es-AR', formatterOptions);
        const precioEfectivoFormato = precioEfectivo.toLocaleString('es-AR', formatterOptions);
        
        const imagenSrc = p.imagen.length > 0 ? p.imagen : './Images/placeholder.png'; 

        return `
            <article class="producto"> 
                <img src="${imagenSrc}" alt="${p.nombre}"> 
                <h3>${p.nombre}</h3>
                
                <div class="price-box">
                    <p class="list-price-label">Precio de Lista:</p>
                    <p class="list-price">
                        $${precioListaFormato}
                    </p> 

                    <p class="effective-price-label">Efectivo/Transferencia:</p>
                    <p class="effective-price">
                        $${precioEfectivoFormato}
                    </p>
                </div>

                <button class="btn-add-cart" data-id="${p.id}">
                    Agregar al carrito
                </button>

                <a class="ver-detalle" href="Pages/producto.html?id=${p.id}">
                    Ver detalle
                </a>
            </article>
        `;
    }).join("");

    contenedor.innerHTML = `<div class="grid">${htmlContent}</div>`;
}
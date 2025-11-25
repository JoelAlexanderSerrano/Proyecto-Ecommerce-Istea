const ADMIN_KEY = 'isAuthenticated'; // Debe coincidir con la clave en JS/login.js

/**
 * 1. Verifica el estado de la sesión. Si no está autenticado, redirige.
 */
function checkAuth() {
    const isAuth = localStorage.getItem(ADMIN_KEY);
    
    // Si la clave no está, redirigimos al login (asumiendo que admin.html está en pages/)
    if (isAuth !== 'true') {
        alert('Acceso no autorizado. Por favor, inicie sesión.');
        window.location.href = 'login.html';
    }
}

/**
 * 2. Cierra la sesión y redirige al inicio.
 */
function handleLogout() {
    if (confirm('¿Está seguro que desea cerrar la sesión?')) {
        localStorage.removeItem(ADMIN_KEY);
        // Redirige a la página principal (index.html, asumiendo que está en el directorio raíz)
        window.location.href = '../index.html'; 
    }
}

/**
 * Inicializa la protección y los eventos.
 */
export function initAdminAuth() {
    // Ejecutar la verificación inmediatamente al cargar la página
    checkAuth(); 

    // Asignar el evento al botón de cerrar sesión
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}
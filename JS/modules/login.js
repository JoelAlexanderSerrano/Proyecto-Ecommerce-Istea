const ADMIN_EMAIL = 'admin@gamepad.com';
const ADMIN_PASSWORD = 'password123';
const ADMIN_KEY = 'isAuthenticated'; // Clave para localStorage

// Función que verifica las credenciales y almacena el estado de sesión
async function handleLogin(event) {
    event.preventDefault(); // Detiene el envío normal del formulario

    const emailInput = document.querySelector('#login-email');
    const passwordInput = document.querySelector('#login-password');
    const messageDiv = document.querySelector('#error-message');

    messageDiv.textContent = ''; // Limpia mensajes anteriores

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Autenticación exitosa: Almacena el estado en localStorage
        localStorage.setItem(ADMIN_KEY, 'true'); 
        
        // Redirige al panel de administración
        window.location.href = 'admin.html';
    } else {
        // Fallo de autenticación
        messageDiv.textContent = 'Credenciales inválidas. Intente de nuevo.';
        localStorage.removeItem(ADMIN_KEY);
    }
}

// Función para inicializar el módulo de login
export function initLogin() {
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        // Asocia la función handleLogin al evento submit del formulario
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener attached.');
        } else {
        console.error('Error: No se encontró el formulario #login-form.');
    }
}
document.addEventListener('DOMContentLoaded', initLogin);
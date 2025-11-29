export function initMobileMenu() {
    const menuToggle = document.querySelector('#menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (!menuToggle || !navbar) return;

    // 🚨 1. Lógica del Menú Hamburguesa (Controlador del Checkbox)
    menuToggle.addEventListener('change', () => {
        if (menuToggle.checked) {
            // Usa el estilo 'block' que definimos en CSS para mostrar
            navbar.style.display = 'block'; 
        } else {
            navbar.style.display = 'none';
        }
    });

    // 🚨 2. Lógica para Cerrar el Desplegable al hacer clic en móvil (el submenú)
    // Esto es para que el submenú de Joysticks funcione sin interferir con el CSS hover de escritorio.
    document.querySelectorAll('.dropdown > a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Solo activar en móvil o dispositivos táctiles
            if (window.innerWidth <= 768) {
                e.preventDefault(); 
                const submenu = this.nextElementSibling;
                
                // Toggle simple para el submenú
                if (submenu && submenu.classList.contains('dropdown-content')) {
                    submenu.classList.toggle('open');
                }
            }
        });
    });
}
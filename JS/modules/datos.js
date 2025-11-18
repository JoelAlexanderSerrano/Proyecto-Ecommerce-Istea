export const productosIniciales = [
    {
        id: "rec001", 
        nombre: "Joystick Nintendo Switch World of Kirby", 
        precio: 100000, 
        descripcion: "La misión de Nintendo es sacar sonrisas en los rostros de todas las personas. Desde 1889 nos comparten sus personajes...",
        imagen: "./Images/kirby_joystick.png",
        categoria: "Nintendo"
    },
    {
        id: "rec002", 
        nombre: "Joystick Dualsense Ps5 30 Aniversario", 
        precio: 150000, 
        descripcion: "Control preciso Este mando combina funciones revolucionarias mientras conserva precisión, comodidad y exactitud en cada movimiento...",
        imagen: "./Images/ps5_aniversario.png", 
        categoria: "Playstation"
    },
    {
        id: "rec003", 
        nombre: "Joystick Microsoft Xbox Robot White", 
        precio: 120000, 
        descripcion: "NO INCLUYE CABLE USB NI PILAS. Captura y comparte contenido sin problemas, como capturas de pantalla, grabaciones...",
        imagen: "./Images/xbox_white.png", 
        categoria: "Xbox"
    },
    // Añade el resto de tus 5 productos destacados aquí...
];


export function inicializarLocalStorage() {
    if (!localStorage.getItem('productos')) {
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
    }
}
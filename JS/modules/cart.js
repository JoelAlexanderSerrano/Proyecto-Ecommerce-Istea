// cart.js
export function initCart() {
  console.log("Cart inicializado");

  const contador = document.querySelector('.carrito .contador');
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  actualizarContador();

  // Delegación de eventos para detectar clicks en cualquier botón "Agregar al carrito"
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add-cart")) {
      const id = e.target.dataset.id;

      agregarProducto(id);
      actualizarContador();

      e.target.textContent = "Agregado ✓";
      setTimeout(() => e.target.textContent = "Agregar al carrito", 800);
    }
  });

  function agregarProducto(id) {
    const item = carrito.find(p => p.id == id);

    if (item) {
      item.cantidad++;
    } else {
      carrito.push({ id, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function actualizarContador() {
    if (!contador) return;
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contador.textContent = `(${total})`;
  }
}

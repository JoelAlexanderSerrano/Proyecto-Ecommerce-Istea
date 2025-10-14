// modules/cart.js
export function initCart() {
  const botones = document.querySelectorAll('.producto button');
  const contador = document.querySelector('.carrito .contador');
  let count = 0;

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      count++;
      contador.textContent = `(${count})`;
      boton.textContent = "Agregado ✅";
      setTimeout(() => boton.textContent = "Agregar al carrito", 1000);
    });
  });
}

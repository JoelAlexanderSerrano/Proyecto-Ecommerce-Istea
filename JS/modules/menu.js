// modules/menu.js
export function initMenu() {
  const menuIcon = document.querySelector('.menu-icon');
  const menu = document.querySelector('.navbar .menu');

  if (!menuIcon || !menu) return;

  menuIcon.addEventListener('click', () => {
    menu.classList.toggle('menu-open');
  });
}
// modules/slider.js
export function initSlider({ interval = 3000 } = {}) {
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const dots = document.querySelectorAll('.dot');

  if (!slides.length) return; // sale si no hay slides

  let current = 0;
  const total = slides.length;
  let slideInterval;

  // Mostrar la slide y actualizar dots
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      dots[i]?.classList.toggle('active', i === index);
    });
    current = index;
  }

  // Siguiente slide
  function nextSlide() {
    showSlide((current + 1) % total);
  }

  // Anterior slide
  function prevSlide() {
    showSlide((current - 1 + total) % total);
  }

  // Resetear intervalo al interactuar
  function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, interval);
  }

  // Botones
  nextBtn?.addEventListener('click', () => { nextSlide(); resetInterval(); });
  prevBtn?.addEventListener('click', () => { prevSlide(); resetInterval(); });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.slide));
      resetInterval();
    });
  });

  // Inicializar
  showSlide(0);
  slideInterval = setInterval(nextSlide, interval);
}

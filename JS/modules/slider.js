export function initSlider({ interval = 4000 } = {}) {
    console.log("Slider inicializado.");
    const slides = document.querySelectorAll('.banner .slide');
    const dots = document.querySelectorAll('.slider-controls .dot');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    // Si no hay slides o botones, salimos
    if (!slides.length || !nextButton || !prevButton) {
      console.error("Error: Slider no encontró los elementos clave (Slides o Botones).");
      return; 
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval; // Variable para controlar el autoplay

    // Mostrar la slide y actualizar dots
    function showSlide(index) {
        // Asegura que el índice esté dentro del rango
        index = (index + totalSlides) % totalSlides;
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    // Siguiente slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Resetear intervalo al interactuar
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, interval);
    }

    // Event Listeners para interacción
    nextButton.addEventListener('click', () => { 
        nextSlide(); 
        resetInterval(); // Reinicia el contador al presionar
    });
    
    prevButton.addEventListener('click', () => { 
        showSlide(currentSlide - 1); // Llama a showSlide con el índice anterior
        resetInterval(); // Reinicia el contador al presionar
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide);
            showSlide(slideIndex);
            resetInterval();
        });
    });
    
    if (slides.length > 0) {
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, interval); // Inicia el movimiento automático
    }
}
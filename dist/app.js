// ====== Año dinámico en footer ======
function updateYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ====== Carousel 3D - Interacción con mouse y touch ======
function initCarousel() {
  const ring = document.querySelector('.ring');
  if (!ring) return;

  // Estado
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;

  let rotationY = 0;
  let rotationX = 10;

  let velocityY = 0;
  let velocityX = 0;

  // Ajustes finos
  const friction = 0.92;
  const sensitivity = 0.35;      // sensibilidad general
  const velocityBoost = 0.18;    // cuánto “impulso” guardas al soltar
  const minX = -10;              // límites para evitar que se “vuelque”
  const maxX = 25;

  // Si quieres auto-spin por defecto, actívalo aquí:
  ring.classList.add('is-autospin');

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function applyTransform() {
    rotationX = clamp(rotationX, minX, maxX);
    ring.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }

  // Inercia
  function animate() {
    if (!isDragging) {
      rotationY += velocityY;
      rotationX += velocityX;

      velocityY *= friction;
      velocityX *= friction;

      // Evitar “micro-movimiento” infinito
      if (Math.abs(velocityY) < 0.001) velocityY = 0;
      if (Math.abs(velocityX) < 0.001) velocityX = 0;

      applyTransform();
    }
    requestAnimationFrame(animate);
  }
  animate();

  // Pointer Events (ratón + touch)
  ring.addEventListener('pointerdown', (e) => {
    // Solo botón principal en mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;

    // Pausar autospin al interactuar
    ring.classList.remove('is-autospin');
    ring.classList.add('is-dragging');

    // Capturar puntero para no perder el drag si sales del elemento
    ring.setPointerCapture(e.pointerId);

    // Cortar inercia anterior
    velocityY = 0;
    velocityX = 0;

    e.preventDefault();
  });

  ring.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    rotationY += dx * sensitivity;
    rotationX -= dy * (sensitivity * 0.75);

    // Guardar “impulso” para inercia
    velocityY = dx * velocityBoost;
    velocityX = -dy * (velocityBoost * 0.75);

    applyTransform();

    lastX = e.clientX;
    lastY = e.clientY;
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    ring.classList.remove('is-dragging');

    // Si quieres que vuelva el auto-spin al soltar, descomenta:
    // ring.classList.add('is-autospin');

    // Si estabas capturando, suelta la captura
    try {
      ring.releasePointerCapture(e.pointerId);
    } catch (_) {}
  }

  ring.addEventListener('pointerup', endDrag);
  ring.addEventListener('pointercancel', endDrag);
  ring.addEventListener('lostpointercapture', () => {
    isDragging = false;
    ring.classList.remove('is-dragging');
  });

  // Accesibilidad: al enfocar tarjetas, coloca el anillo
  const cards = ring.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.addEventListener('focus', () => {
      const angle = index * 60;
      rotationY = -angle;
      velocityY = 0;
      velocityX = 0;
      applyTransform();
    });
  });
}


// ====== Formulario de contacto ======
function initContactForm() {
  const apiBaseUrl = '/api/contact';
  const form = document.getElementById('contactForm');
  const emailInput = document.getElementById('email');
  const messageDiv = document.getElementById('formMessage');

  if (!form || !emailInput || !messageDiv) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Validación básica
    if (!email || !isValidEmail(email)) {
      showMessage('Por favor, introduce un correo electrónico válido.', 'error');
      return;
    }

    // Simular envío (aquí deberías conectar tu backend real)
    try {
      showMessage('Enviando...', 'success');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      
      const response = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Error al enviar');

      showMessage('¡Gracias! Me pondré en contacto contigo pronto.', 'success');
      form.reset();

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        hideMessage();
      }, 5000);

    } catch (error) {
      console.error('Error:', error);
      showMessage('Hubo un error al enviar. Por favor, inténtalo de nuevo.', 'error');
    }
  });

  // Validación en tiempo real
  emailInput.addEventListener('blur', () => {
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      emailInput.setAttribute('aria-invalid', 'true');
    } else {
      emailInput.setAttribute('aria-invalid', 'false');
    }
  });

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
  }

  function hideMessage() {
    messageDiv.textContent = '';
    messageDiv.className = 'form-message';
  }
}

// ====== Smooth scroll con offset para header fijo ======
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Ignorar si es solo "#"
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ====== Animación de entrada para elementos ======
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animar paneles
  document.querySelectorAll('.panel').forEach((panel, index) => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(30px)';
    panel.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(panel);
  });
}

// ====== Detección de reducción de movimiento ======
function respectMotionPreferences() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Deshabilitar animaciones automáticas
    const ring = document.querySelector('.ring');
    if (ring) {
      ring.style.animation = 'none';
    }
    
    console.log('Animaciones reducidas por preferencia del usuario');
  }
}

// ====== Performance: Lazy loading de imágenes ======
function initLazyLoading() {
  if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback para navegadores antiguos
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ====== Manejo de errores de carga de imagen ======
function handleImageErrors() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      console.error(`Error al cargar imagen: ${this.src}`);
      // Podrías poner una imagen placeholder aquí
      this.alt = 'Imagen no disponible';
      this.style.opacity = '0.3';
    });
  });
}

// ====== Inicialización cuando el DOM esté listo ======
function init() {
  updateYear();
  initCarousel();
  initContactForm();
  initSmoothScroll();
  initScrollAnimations();
  respectMotionPreferences();
  initLazyLoading();
  handleImageErrors();

  console.log('Portfolio inicializado correctamente ✨');
}

// Ejecutar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ====== Service Worker (opcional - para PWA) ======
// Descomentar si quiero convertirlo en PWA
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registrado:', registration))
      .catch(error => console.log('Error al registrar SW:', error));
  });
}
*/
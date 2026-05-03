/* ===================================================
   CONTADOR.JS
   Animación count-up cuando los contadores
   entran al viewport (Intersection Observer)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const elementosContador = document.querySelectorAll('.contador-numero');
  if (!elementosContador.length) return;

  /* Función que anima un número desde 0 hasta el valor objetivo */
  const animarContador = (elemento) => {
    const objetivo  = parseInt(elemento.getAttribute('data-target'), 10);
    const prefijo   = elemento.getAttribute('data-prefix')  || '';
    const sufijo    = elemento.getAttribute('data-suffix')  || '';
    const duracion  = 1800; /* ms */
    const inicio    = performance.now();

    /* Easing: ease-out cúbico */
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const paso = (ahora) => {
      const transcurrido = ahora - inicio;
      const progreso     = Math.min(transcurrido / duracion, 1);
      const valorActual  = Math.floor(easeOut(progreso) * objetivo);

      elemento.textContent = prefijo + valorActual + sufijo;

      if (progreso < 1) {
        requestAnimationFrame(paso);
      } else {
        elemento.textContent = prefijo + objetivo + sufijo;
        /* Brillo al terminar */
        elemento.style.textShadow = '0 0 20px rgba(212,168,67,0.6)';
        setTimeout(() => { elemento.style.textShadow = ''; }, 800);
      }
    };

    requestAnimationFrame(paso);
  };

  /* Usar Intersection Observer para disparar al entrar al viewport */
  const opciones = {
    root:       null,
    rootMargin: '0px 0px -80px 0px',
    threshold:  0.5
  };

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        animarContador(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  }, opciones);

  elementosContador.forEach(el => observador.observe(el));

});

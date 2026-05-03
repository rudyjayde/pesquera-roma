/* ===================================================
   ANIMACIONES.JS
   Intersection Observer: fade-in reveal al hacer scroll
   Efecto tilt 3D en tarjetas de productos
   Línea de progreso de proceso
   =================================================== */

/* Shared IntersectionObserver instance reused by dynamic content */
let _revealObserver = null;

function initReveal() {
  const elementosReveal = document.querySelectorAll('.reveal:not(.visible)');
  if (!elementosReveal.length) return;

  if (!_revealObserver) {
    _revealObserver = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          _revealObserver.unobserve(entrada.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.12 });
  }

  elementosReveal.forEach(el => _revealObserver.observe(el));
}
window.initReveal = initReveal;

function initTilt(container) {
  const tarjetasTilt = (container || document).querySelectorAll('.tilt-card');
  tarjetasTilt.forEach(tarjeta => {
    if (tarjeta._tiltInit) return;
    tarjeta._tiltInit = true;
    let bounds = null;

    const obtenerBounds = () => {
      bounds = tarjeta.getBoundingClientRect();
    };

    tarjeta.addEventListener('mouseenter', obtenerBounds);

    tarjeta.addEventListener('mousemove', (e) => {
      if (!bounds) obtenerBounds();

      /* Posición relativa dentro de la tarjeta, de -1 a 1 */
      const xRel = (e.clientX - bounds.left) / bounds.width  - 0.5;
      const yRel = (e.clientY - bounds.top)  / bounds.height - 0.5;

      /* Amplitud máxima de inclinación en grados */
      const amplitud = 10;
      const rotX = -yRel * amplitud;
      const rotY =  xRel * amplitud;

      tarjeta.style.transform = `
        perspective(700px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateZ(6px)
        scale(1.02)
      `;

      /* Brillo dinámico según posición del ratón */
      const brillo = tarjeta.querySelector('.producto-imagen');
      if (brillo) {
        const porcentajeX = Math.round(xRel * 100 + 50);
        const porcentajeY = Math.round(yRel * 100 + 50);
        brillo.style.backgroundImage =
          `radial-gradient(circle at ${porcentajeX}% ${porcentajeY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
      }
    });

    tarjeta.addEventListener('mouseleave', () => {
      bounds = null;
      tarjeta.style.transform = '';
      tarjeta.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease';

      const brillo = tarjeta.querySelector('.producto-imagen');
      if (brillo) brillo.style.backgroundImage = '';

      setTimeout(() => {
        tarjeta.style.transition = '';
      }, 500);
    });
  });
}
window.initTilt = initTilt;

document.addEventListener('DOMContentLoaded', () => {

  initReveal();
  initTilt();

  /* =============================================
     LÍNEA DE PROGRESO — Sección Proceso
     ============================================= */
  const lineaProgreso = document.getElementById('procesoLinea');
  const seccionProceso = document.getElementById('proceso');

  if (lineaProgreso && seccionProceso) {
    const opcionesLinea = {
      root:      null,
      threshold: 0.3
    };

    const observadorLinea = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          lineaProgreso.style.width = '100%';
          observadorLinea.unobserve(entrada.target);
        }
      });
    }, opcionesLinea);

    observadorLinea.observe(seccionProceso);
  }

  /* =============================================
     PARALLAX SUAVE — Imagen nosotros
     ============================================= */
  const imagenParallax = document.querySelector('.imagen-parallax img');

  if (imagenParallax) {
    let ticking = false;

    const calcularParallax = () => {
      const seccion = document.getElementById('nosotros');
      if (!seccion) return;

      const rect      = seccion.getBoundingClientRect();
      const centroVentana = window.innerHeight / 2;
      const centroSeccion = rect.top + rect.height / 2;
      const delta = (centroVentana - centroSeccion) * 0.1;
      const limitado = Math.max(-20, Math.min(20, delta));

      imagenParallax.style.transform = `translateY(${limitado}px) scale(1.06)`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(calcularParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* =============================================
     HIGHLIGHT NAV LINK ACTIVO
     ============================================= */
  /* Añadir estilos de link activo en el navbar */
  const estiloActivo = document.createElement('style');
  estiloActivo.textContent = `
    .nav-link.activo {
      color: var(--hielo) !important;
      background: rgba(46,134,193,0.15) !important;
    }
  `;
  document.head.appendChild(estiloActivo);

});

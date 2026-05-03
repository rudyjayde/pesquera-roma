/* ===================================================
   VIDEO-SCROLL.JS
   La animación de natación de la trucha corre en CSS puro
   (ver animaciones.css → nadarImg1 / nadarImg2).

   Este archivo solo agrega un efecto parallax suave al
   fondo del hero mientras el usuario hace scroll hacia
   la siguiente sección, dando profundidad al movimiento.
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const fondo = document.querySelector('.hero-fondo-scroll');
  if (!fondo) return;

  let frameId = null;

  const parallax = () => {
    /* Mueve el fondo hacia abajo un 40% de lo que el usuario scrolleó
       (efecto de profundidad al alejarse del hero) */
    const offset = Math.min(window.scrollY * 0.4, window.innerHeight * 0.4);
    fondo.style.transform = `translateY(${offset}px)`;
    frameId = null;
  };

  window.addEventListener('scroll', () => {
    if (!frameId) {
      frameId = requestAnimationFrame(parallax);
    }
  }, { passive: true });

});

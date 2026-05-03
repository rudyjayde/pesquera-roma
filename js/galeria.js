/* ===================================================
   GALERIA.JS — Pesquera La Pequeña Roma
   Lightbox functionality
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const lightbox       = document.getElementById('lightbox');
  const lightboxImagen = document.getElementById('lightboxImagen');
  const lightboxCerrar = document.getElementById('lightboxCerrar');

  if (!lightbox || !lightboxImagen || !lightboxCerrar) return;

  /* ── Abrir lightbox al hacer clic en una imagen de la galería ── */
  document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      if (!src) return;
      lightboxImagen.src = src;
      lightbox.classList.add('activo');
      document.body.style.overflow = 'hidden';
    });
  });

  /* ── Cerrar lightbox ── */
  const cerrarLightbox = () => {
    lightbox.classList.remove('activo');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImagen.src = ''; }, 300);
  };

  lightboxCerrar.addEventListener('click', cerrarLightbox);

  /* Clic fuera de la imagen */
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrarLightbox();
  });

  /* Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('activo')) {
      cerrarLightbox();
    }
  });

});

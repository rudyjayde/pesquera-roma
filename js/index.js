/* ===================================================
   INDEX.JS — Pesquera La Pequeña Roma
   Navbar scroll, hamburguesa, smooth scroll,
   nav link highlight
   (Cursor personalizado ELIMINADO)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar: transparente → sólida al scroll ── */
  const navbar = document.getElementById('navbar');

  const actualizarNavbar = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', actualizarNavbar, { passive: true });
  actualizarNavbar();

  /* ── Menú hamburguesa ── */
  const hamburguesa = document.getElementById('hamburguesa');
  const navbarMenu  = document.getElementById('navbarMenu');

  hamburguesa.addEventListener('click', () => {
    hamburguesa.classList.toggle('activo');
    navbarMenu.classList.toggle('abierto');
    document.body.style.overflow = navbarMenu.classList.contains('abierto') ? 'hidden' : '';
  });

  /* Cerrar menú al hacer clic en un enlace */
  navbarMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburguesa.classList.remove('activo');
      navbarMenu.classList.remove('abierto');
      document.body.style.overflow = '';
    });
  });

  /* Cerrar con Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbarMenu.classList.contains('abierto')) {
      hamburguesa.classList.remove('activo');
      navbarMenu.classList.remove('abierto');
      document.body.style.overflow = '';
    }
  });

  /* ── Smooth scroll para anclas ── */
  document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
      const href = enlace.getAttribute('href');
      if (href === '#') return;
      const destino = document.querySelector(href);
      if (!destino) return;
      e.preventDefault();
      const navbarAltura = navbar.offsetHeight;
      const posicion = destino.getBoundingClientRect().top + window.scrollY - navbarAltura - 10;
      window.scrollTo({ top: posicion, behavior: 'smooth' });
    });
  });

  /* ── Link activo en navbar al hacer scroll ── */
  const secciones = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const resaltarNavLink = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 60;
    secciones.forEach(seccion => {
      const top  = seccion.offsetTop;
      const alto = seccion.offsetHeight;
      const id   = seccion.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + alto) {
        navLinks.forEach(link => link.classList.remove('activo'));
        const linkActivo = document.querySelector(`.nav-link[href="#${id}"]`);
        if (linkActivo) linkActivo.classList.add('activo');
      }
    });
  };

  window.addEventListener('scroll', resaltarNavLink, { passive: true });

});

/* ===================================================
   MAIN.JS
   Navbar scroll, menú hamburguesa, smooth scroll,
   cursor personalizado, lightbox galería
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Cursor personalizado ----- */
  const cursorCirculo = document.querySelector('.cursor-circulo');
  const cursorPunto   = document.querySelector('.cursor-punto');

  if (cursorCirculo && cursorPunto) {
    let cursorX = 0, cursorY = 0;
    let circuloX = 0, circuloY = 0;

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorPunto.style.left = cursorX + 'px';
      cursorPunto.style.top  = cursorY + 'px';
    });

    /* Interpolación suave para el círculo */
    const animarCursor = () => {
      circuloX += (cursorX - circuloX) * 0.14;
      circuloY += (cursorY - circuloY) * 0.14;
      cursorCirculo.style.left = circuloX + 'px';
      cursorCirculo.style.top  = circuloY + 'px';
      requestAnimationFrame(animarCursor);
    };
    animarCursor();

    /* Agrandar cursor sobre elementos interactivos */
    const interactivos = document.querySelectorAll('a, button, .galeria-item, .producto-card, input, textarea');
    interactivos.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorCirculo.style.width  = '56px';
        cursorCirculo.style.height = '56px';
        cursorCirculo.style.borderColor = 'var(--dorado)';
      });
      el.addEventListener('mouseleave', () => {
        cursorCirculo.style.width  = '38px';
        cursorCirculo.style.height = '38px';
        cursorCirculo.style.borderColor = 'var(--cyan)';
      });
    });
  }

  /* ----- Navbar: transparente → sólida al scroll ----- */
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

  /* ----- Menú hamburguesa ----- */
  const hamburguesa  = document.getElementById('hamburguesa');
  const navbarMenu   = document.getElementById('navbarMenu');

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

  /* ----- Smooth scroll para anclas ----- */
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

  /* ----- Lightbox galería ----- */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImagen = document.getElementById('lightboxImagen');
  const lightboxCerrar = document.getElementById('lightboxCerrar');

  document.querySelectorAll('.galeria-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      lightboxImagen.src = src;
      lightbox.classList.add('activo');
      document.body.style.overflow = 'hidden';
    });
  });

  const cerrarLightbox = () => {
    lightbox.classList.remove('activo');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImagen.src = ''; }, 300);
  };

  lightboxCerrar.addEventListener('click', cerrarLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrarLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('activo')) cerrarLightbox();
  });

  /* ----- Formulario de contacto ----- */
  const formulario = document.getElementById('formularioContacto');
  if (formulario) {
    formulario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre   = formulario.querySelector('#nombre').value.trim();
      const correo   = formulario.querySelector('#correo').value.trim();
      const telefono = formulario.querySelector('#telefono').value.trim();
      const mensaje  = formulario.querySelector('#mensaje').value.trim();
      const msgDiv   = document.getElementById('contactoMsg');
      const btn      = document.getElementById('btnEnviarContacto');

      if (!nombre || !correo || !mensaje) return;

      btn.disabled   = true;
      btn.textContent = 'Enviando...';

      try {
        const res = await fetch('/api/contacts', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ nombre, correo, telefono, mensaje })
        });
        if (res.ok) {
          msgDiv.className   = 'form-mensaje success';
          msgDiv.textContent = '✅ Mensaje enviado correctamente. Te contactaremos pronto.';
          formulario.reset();
        } else {
          throw new Error();
        }
      } catch {
        /* fallback WhatsApp */
        const texto = encodeURIComponent(`Hola, soy ${nombre}.\nCorreo: ${correo}\n\n${mensaje}`);
        window.open(`https://wa.me/51936859812?text=${texto}`, '_blank');
        msgDiv.className   = 'form-mensaje success';
        msgDiv.textContent = '✅ Redirigido a WhatsApp. ¡Gracias por contactarnos!';
      } finally {
        msgDiv.style.display = 'block';
        btn.disabled   = false;
        btn.textContent = 'Enviar Mensaje';
      }
    });
  }

  /* ----- Link activo en navbar al hacer scroll (highlight) ----- */
  const secciones = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const resaltarNavLink = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 60;
    secciones.forEach(seccion => {
      const top    = seccion.offsetTop;
      const alto   = seccion.offsetHeight;
      const id     = seccion.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + alto) {
        navLinks.forEach(link => link.classList.remove('activo'));
        const linkActivo = document.querySelector(`.nav-link[href="#${id}"]`);
        if (linkActivo) linkActivo.classList.add('activo');
      }
    });
  };

  window.addEventListener('scroll', resaltarNavLink, { passive: true });

});

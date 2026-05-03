/* ===================================================
   COOKIES.JS — Pesquera La Pequeña Roma
   Cookie consent banner: show / accept / decline
   Uses localStorage so the decision persists
   =================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'ppr_cookies_consent';

  /* If already decided, do nothing */
  if (localStorage.getItem(STORAGE_KEY)) return;

  /* ── Create banner element ── */
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso de cookies');

  banner.innerHTML = `
    <div class="cookie-inner">
      <div class="cookie-texto-wrap">
        <span class="cookie-icon">🍪</span>
        <div class="cookie-texto">
          <p>
            Este sitio utiliza cookies para mejorar tu experiencia de navegación y analizar el uso del sitio.
            Al hacer clic en <strong>Aceptar</strong>, consientes el uso de cookies.
            <a href="terminos.html">Más información</a>
          </p>
        </div>
      </div>
      <div class="cookie-acciones">
        <button class="btn-cookie-rechazar" id="cookieRechazar" type="button">Rechazar</button>
        <button class="btn-cookie-aceptar" id="cookieAceptar" type="button">Aceptar</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  /* ── Show banner with a short delay (so CSS transition fires) ── */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add('visible');
    });
  });

  /* ── Hide helper ── */
  const hideBanner = () => {
    banner.classList.remove('visible');
    banner.classList.add('oculto');
    /* Remove from DOM after transition */
    banner.addEventListener('transitionend', () => {
      banner.remove();
    }, { once: true });
  };

  /* ── Accept ── */
  document.getElementById('cookieAceptar').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    hideBanner();
  });

  /* ── Decline ── */
  document.getElementById('cookieRechazar').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    hideBanner();
  });

})();

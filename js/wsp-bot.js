/* ===================================================
   WSP-BOT.JS — Pesquera La Pequeña Roma
   WhatsApp automation widget
   Appears after 4 seconds as a floating chat bubble
   =================================================== */

(function () {
  'use strict';

  const WSP_NUMBER  = '51936859812';
  const WSP_MESSAGE = encodeURIComponent(
    'Hola Pequeña Roma, estoy interesado en sus productos.'
  );
  const STORAGE_KEY = 'ppr_wsp_bot_dismissed';
  const DELAY_MS    = 4000;

  /* ── Don't show again if dismissed in this session ── */
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  /* ── Inject styles ── */
  const style = document.createElement('style');
  style.textContent = `
    #wsp-bot-widget {
      position: fixed;
      bottom: 100px;
      right: 28px;
      z-index: 8000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      opacity: 0;
      transform: translateY(20px) scale(0.92);
      transition: opacity 0.4s ease, transform 0.4s ease;
      pointer-events: none;
    }
    #wsp-bot-widget.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }
    #wsp-bot-bubble {
      background: #fff;
      border-radius: 18px 18px 4px 18px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: 16px 18px;
      max-width: 280px;
      position: relative;
      border: 1px solid rgba(37,211,102,0.25);
    }
    #wsp-bot-bubble::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 16px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 0 solid transparent;
      border-top: 10px solid #fff;
      filter: drop-shadow(0 2px 2px rgba(0,0,0,0.08));
    }
    #wsp-bot-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    #wsp-bot-logo {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #25d366;
      flex-shrink: 0;
      background: #e8f4fd;
    }
    #wsp-bot-logo-fallback {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #25d366;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 2px solid #128c4e;
    }
    #wsp-bot-logo-fallback svg {
      width: 22px;
      height: 22px;
    }
    #wsp-bot-name {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      color: #0a1f3d;
      line-height: 1.2;
    }
    #wsp-bot-status {
      font-size: 0.72rem;
      color: #25d366;
      font-weight: 500;
    }
    #wsp-bot-msg {
      font-family: 'Montserrat', sans-serif;
      font-size: 0.85rem;
      color: #2a3f54;
      line-height: 1.5;
      margin-bottom: 14px;
    }
    #wsp-bot-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 11px 16px;
      background: #25d366;
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s, transform 0.2s;
      box-shadow: 0 4px 14px rgba(37,211,102,0.35);
    }
    #wsp-bot-btn:hover {
      background: #128c4e;
      transform: translateY(-1px);
    }
    #wsp-bot-btn svg {
      width: 18px;
      height: 18px;
      fill: #fff;
    }
    #wsp-bot-close {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 22px;
      height: 22px;
      background: #e74c3c;
      color: #fff;
      border: none;
      border-radius: 50%;
      font-size: 0.75rem;
      line-height: 22px;
      text-align: center;
      cursor: pointer;
      font-weight: 700;
      transition: background 0.2s;
    }
    #wsp-bot-close:hover { background: #c0392b; }

    /* Fish logo trigger button */
    #wsp-bot-trigger {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #25d366;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37,211,102,0.45);
      transition: transform 0.25s, box-shadow 0.25s;
      flex-shrink: 0;
    }
    #wsp-bot-trigger:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 28px rgba(37,211,102,0.55);
    }
    #wsp-bot-trigger svg {
      width: 30px;
      height: 30px;
      fill: #fff;
    }

    @media (max-width: 480px) {
      #wsp-bot-widget { right: 14px; bottom: 90px; }
      #wsp-bot-bubble { max-width: calc(100vw - 56px); }
    }
  `;
  document.head.appendChild(style);

  /* ── Build widget HTML ── */
  const widget = document.createElement('div');
  widget.id = 'wsp-bot-widget';

  const wspIconSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  widget.innerHTML = `
    <div id="wsp-bot-bubble" role="dialog" aria-label="Chat de WhatsApp">
      <button id="wsp-bot-close" aria-label="Cerrar">&times;</button>
      <div id="wsp-bot-header">
        <div id="wsp-bot-logo-fallback">${wspIconSVG}</div>
        <div>
          <div id="wsp-bot-name">Pesquera Pequeña Roma</div>
          <div id="wsp-bot-status">● En línea ahora</div>
        </div>
      </div>
      <div id="wsp-bot-msg">¡Hola! Estoy interesado en sus productos de trucha. ¿Me pueden dar más información?</div>
      <a id="wsp-bot-btn"
         href="https://wa.me/${WSP_NUMBER}?text=${WSP_MESSAGE}"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="Abrir WhatsApp">
        ${wspIconSVG}
        Chatear por WhatsApp
      </a>
    </div>
    <button id="wsp-bot-trigger" aria-label="Abrir chat WhatsApp">
      ${wspIconSVG}
    </button>
  `;

  document.body.appendChild(widget);

  /* ── Show widget after delay ── */
  setTimeout(() => {
    widget.classList.add('visible');
  }, DELAY_MS);

  /* ── Close button ── */
  document.getElementById('wsp-bot-close').addEventListener('click', () => {
    const bubble = document.getElementById('wsp-bot-bubble');
    bubble.style.display = 'none';
    sessionStorage.setItem(STORAGE_KEY, '1');
  });

  /* ── Trigger button: toggle bubble ── */
  document.getElementById('wsp-bot-trigger').addEventListener('click', () => {
    const bubble = document.getElementById('wsp-bot-bubble');
    if (bubble.style.display === 'none') {
      bubble.style.display = 'block';
    } else {
      bubble.style.display = 'none';
      sessionStorage.setItem(STORAGE_KEY, '1');
    }
  });

})();

/* ===================================================
   PRODUCTOS — Pesquera La Pequeña Roma
   Renderiza catálogo estático con imágenes locales
   =================================================== */
(function () {
  const grid = document.getElementById('productosGrid');
  if (!grid) return;

  const WA = '51936859812';

  const productos = [
    {
      name: 'Filete de Trucha',
      img: 'img-galeria/filete-de-trucha.jpg',
      peso: 'Calibres de 250g a 1kg',
      badge: 'Más vendido',
      gold: true,
      tags: ['Fileteado', 'Sin espinas'],
    },
    {
      name: 'Trucha Deshuesada',
      img: 'img-galeria/trucha-deshuesada.png',
      peso: 'Calibres de 300g a 1kg',
      badge: 'Premium',
      gold: true,
      tags: ['Deshuesada', 'Lista para cocinar'],
    },
    {
      name: 'Trucha en Porciones',
      img: 'img-galeria/trucha-en-porciones.png',
      peso: 'Porciones de 150g a 250g',
      badge: null,
      gold: false,
      tags: ['En porciones', 'Porcionada'],
    },
    {
      name: 'Trucha Eviscerada',
      img: 'img-galeria/trucha-eviscerada.png',
      peso: 'Calibres de 300g a 5kg',
      badge: null,
      gold: false,
      tags: ['Eviscerada', 'Entera'],
    },
    {
      name: 'Trucha Entera Fresca',
      img: 'img-galeria/trucha-entera-fresca.png',
      peso: 'Calibres de 250g a 5kg',
      badge: null,
      gold: false,
      tags: ['Entera', 'Fresca'],
    },
    {
      name: 'Trucha Entera Eviscerada',
      img: 'img-galeria/trucha-entera-eviscerada.png',
      peso: 'Calibres de 300g a 5kg',
      badge: null,
      gold: false,
      tags: ['Entera', 'Eviscerada'],
    },
  ];

  const wspIcon  = `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  const zoomIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="28" height="28"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

  grid.innerHTML = productos.map((p, i) => {
    const waText = encodeURIComponent(`Hola, quisiera cotizar: *${p.name}*\nPeso: ${p.peso}`);
    const waUrl  = `https://wa.me/${WA}?text=${waText}`;
    const badge  = p.badge
      ? `<span class="prod-badge${p.gold ? ' prod-badge--gold' : ''}">${p.badge}</span>`
      : '';
    const tags = p.tags.map(t => `<span class="prod-tag">${t}</span>`).join('');

    return `
    <div class="prod-card reveal" style="animation-delay:${i * 60}ms">
      <div class="prod-img-wrap" data-src="${p.img}" style="cursor:zoom-in">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        <div class="prod-zoom-overlay">
          <div class="prod-zoom-btn">${zoomIcon}</div>
        </div>
        ${badge}
      </div>
      <div class="prod-body">
        <h3 class="prod-nombre">${p.name}</h3>
        <div class="prod-tags">${tags}</div>
        <p class="prod-peso">${p.peso}</p>
        <a href="${waUrl}" class="btn-cotizar-wsp" target="_blank" rel="noopener">
          ${wspIcon} Cotizar por WhatsApp
        </a>
      </div>
    </div>`;
  }).join('');

  if (window.initReveal) window.initReveal();

  /* ── Lightbox para imágenes de producto ── */
  grid.querySelectorAll('.prod-img-wrap[data-src]').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const src = wrap.getAttribute('data-src');
      const lb  = document.getElementById('lightbox');
      const img = document.getElementById('lightboxImagen');
      if (!lb || !img) return;
      img.src = src;
      lb.classList.add('activo');
      document.body.style.overflow = 'hidden';
    });
  });
})();

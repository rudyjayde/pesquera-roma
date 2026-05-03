/* ===================================================
   CONTACTO.JS — Pesquera La Pequeña Roma
   Contact form submission with WhatsApp fallback
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const formulario = document.getElementById('formularioContacto');
  if (!formulario) return;

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre   = formulario.querySelector('#nombre').value.trim();
    const correo   = formulario.querySelector('#correo').value.trim();
    const telefono = formulario.querySelector('#telefono').value.trim();
    const mensaje  = formulario.querySelector('#mensaje').value.trim();
    const msgDiv   = document.getElementById('contactoMsg');
    const btn      = document.getElementById('btnEnviarContacto');

    /* Validación básica */
    if (!nombre || !correo || !mensaje) {
      msgDiv.className   = 'form-msg error';
      msgDiv.textContent = '⚠️ Por favor completa los campos obligatorios.';
      msgDiv.style.display = 'block';
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Enviando...';
    msgDiv.style.display = 'none';

    try {
      const res = await fetch('/api/contacts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nombre, correo, telefono, mensaje })
      });

      if (res.ok) {
        msgDiv.className   = 'form-msg success';
        msgDiv.textContent = '✅ Mensaje enviado correctamente. Te contactaremos pronto.';
        formulario.reset();
      } else {
        throw new Error('server-error');
      }
    } catch {
      /* Fallback: abrir WhatsApp con el mensaje */
      const texto = encodeURIComponent(
        `Hola, soy *${nombre}*.\nCorreo: ${correo}${telefono ? '\nTeléfono: ' + telefono : ''}\n\n${mensaje}`
      );
      window.open(`https://wa.me/51936859812?text=${texto}`, '_blank');
      msgDiv.className   = 'form-msg success';
      msgDiv.textContent = '✅ Redirigido a WhatsApp. ¡Gracias por contactarnos!';
    } finally {
      msgDiv.style.display = 'block';
      btn.disabled    = false;
      btn.textContent = 'Enviar Mensaje';
    }
  });

});

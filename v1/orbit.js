/* =========================================================
   OrbitCX UI · v1 — núcleo compartido
   ---------------------------------------------------------
   Lo cargan todos los módulos de la suite, dentro del <head>:
     <script src="../orbitcx-ui/v1/orbit.js"></script>

   Hace tres cosas:
   1. Aplica el tema guardado (oscuro / claro) antes de que se
      pinte la página, para que no "parpadee".
   2. Inserta los dibujos de los planetas en la página. Después
      se usan así:
        <svg class="ox-planet"><use href="#p-nebula"/></svg>
      Dibujos disponibles: p-core, p-nebula, p-comet, p-mission,
      p-constellation y logo-orbit.
   3. Arma el menú lateral de la suite con OrbitCX.shell({...}).

   Todo queda disponible en el objeto global OrbitCX.
   ========================================================= */

(function () {

  /* =========================================================
     1. TEMA CLARO / OSCURO
     El tema elegido se guarda en el navegador (localStorage)
     para que se mantenga en todas las páginas de la suite.
     ========================================================= */

  const CLAVE_TEMA = 'orbitcx-theme';
  const html = document.documentElement;

  function leerTemaGuardado() {
    try {
      return localStorage.getItem(CLAVE_TEMA);
    } catch (error) {
      return null; // navegador sin localStorage: usamos el tema oscuro
    }
  }

  function aplicarTema(tema) {
    if (tema === 'light') html.setAttribute('data-theme', 'light');
    else html.removeAttribute('data-theme');

    // Todos los botones con data-ox-theme muestran el tema al que se puede cambiar
    document.querySelectorAll('[data-ox-theme]').forEach(boton => {
      boton.textContent = tema === 'light' ? '☾ Modo oscuro' : '☀ Modo claro';
    });
  }

  function temaActual() {
    return html.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function cambiarTema() {
    const nuevo = temaActual() === 'light' ? 'dark' : 'light';
    aplicarTema(nuevo);
    try { localStorage.setItem(CLAVE_TEMA, nuevo); } catch (error) { /* no se pudo guardar */ }
  }

  // Se ejecuta apenas carga el archivo, antes de pintar
  aplicarTema(leerTemaGuardado());


  /* =========================================================
     2. DIBUJOS DE LOS PLANETAS (SVG)
     Primero se definen los degradés (<radialGradient>) y después
     cada planeta como un <symbol> que se puede reutilizar.
     ========================================================= */

  const PLANETAS_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <!-- Degradés de color de cada planeta -->
      <radialGradient id="g-core" cx="35%" cy="35%" r="70%">
        <stop offset="0" stop-color="#ECFEFF"/><stop offset=".4" stop-color="#5EEAD4"/><stop offset="1" stop-color="#0284C7"/>
      </radialGradient>
      <radialGradient id="g-core-glow">
        <stop offset=".45" stop-color="#38BDF8" stop-opacity=".45"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g-neb" cx="35%" cy="30%" r="75%">
        <stop offset="0" stop-color="#EDE9FE"/><stop offset=".35" stop-color="#A78BFA"/><stop offset=".75" stop-color="#6D28D9"/><stop offset="1" stop-color="#2E1065"/>
      </radialGradient>
      <radialGradient id="g-neb-haze">
        <stop offset=".6" stop-color="#C084FC" stop-opacity=".35"/><stop offset="1" stop-color="#C084FC" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g-comet" cx="38%" cy="35%" r="70%">
        <stop offset="0" stop-color="#FFF7ED"/><stop offset=".35" stop-color="#FDBA74"/><stop offset=".8" stop-color="#EA580C"/><stop offset="1" stop-color="#7C2D12"/>
      </radialGradient>
      <linearGradient id="g-tail" x1="0.15" y1="0.85" x2="1" y2="0">
        <stop offset="0" stop-color="#FB923C" stop-opacity=".9"/><stop offset=".5" stop-color="#FDE68A" stop-opacity=".35"/><stop offset="1" stop-color="#FDE68A" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="g-mis" cx="35%" cy="32%" r="75%">
        <stop offset="0" stop-color="#E0F2FE"/><stop offset=".35" stop-color="#38BDF8"/><stop offset=".75" stop-color="#0369A1"/><stop offset="1" stop-color="#082F49"/>
      </radialGradient>
      <radialGradient id="g-con" cx="35%" cy="32%" r="75%">
        <stop offset="0" stop-color="#FEF9C3"/><stop offset=".35" stop-color="#FACC15"/><stop offset=".78" stop-color="#A16207"/><stop offset="1" stop-color="#422006"/>
      </radialGradient>

      <!-- Recortes: limitan las franjas al borde del planeta -->
      <clipPath id="clip-neb"><circle cx="50" cy="50" r="32"/></clipPath>
      <clipPath id="clip-mis"><circle cx="50" cy="50" r="27"/></clipPath>
      <clipPath id="clip-low"><rect x="0" y="50" width="100" height="50"/></clipPath>

      <!-- Centro de la suite: el cliente -->
      <symbol id="p-core" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="url(#g-core-glow)"/>
        <circle cx="50" cy="50" r="26" fill="url(#g-core)"/>
      </symbol>

      <!-- Nebula: planeta violeta con franjas de nube -->
      <symbol id="p-nebula" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="url(#g-neb-haze)"/>
        <circle cx="50" cy="50" r="32" fill="url(#g-neb)"/>
        <g clip-path="url(#clip-neb)" fill="#F0ABFC">
          <ellipse cx="44" cy="40" rx="30" ry="5" transform="rotate(-14 44 40)" opacity=".28"/>
          <ellipse cx="56" cy="58" rx="34" ry="6" transform="rotate(-10 56 58)" opacity=".22"/>
          <ellipse cx="50" cy="70" rx="26" ry="3.5" transform="rotate(-16 50 70)" opacity=".18"/>
        </g>
      </symbol>

      <!-- Comet: cometa naranja con cola -->
      <symbol id="p-comet" viewBox="0 0 100 100">
        <path d="M22 62 Q58 36 95 6 Q70 44 40 80 Z" fill="url(#g-tail)"/>
        <circle cx="31" cy="69" r="17" fill="url(#g-comet)"/>
        <circle cx="26" cy="64" r="3" fill="#7C2D12" opacity=".35"/>
        <circle cx="36" cy="74" r="2" fill="#7C2D12" opacity=".3"/>
      </symbol>

      <!-- Mission Control: planeta azul con anillo y satélite.
           El anillo se dibuja dos veces: detrás del planeta y,
           recortado, delante (para que parezca que lo rodea). -->
      <symbol id="p-mission" viewBox="0 0 100 100">
        <g transform="rotate(-18 50 50)">
          <ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke="#7DD3FC" stroke-width="3.5" opacity=".45"/>
        </g>
        <circle cx="50" cy="50" r="27" fill="url(#g-mis)"/>
        <g clip-path="url(#clip-mis)" fill="#BAE6FD" opacity=".25">
          <path d="M24 44 Q38 38 52 44 T80 42 L80 48 Q66 54 52 50 T24 50 Z"/>
          <path d="M24 60 Q40 56 56 62 T80 60 L80 64 Q64 68 50 66 T24 66 Z"/>
        </g>
        <g transform="rotate(-18 50 50)">
          <ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke="#7DD3FC" stroke-width="3.5" clip-path="url(#clip-low)"/>
        </g>
        <circle cx="88" cy="22" r="4" fill="#E0F2FE"/>
      </symbol>

      <!-- Constellation: planeta dorado con una constelación encima -->
      <symbol id="p-constellation" viewBox="0 0 100 100">
        <circle cx="50" cy="52" r="31" fill="url(#g-con)"/>
        <g stroke="#FFFBEB" stroke-width="1.3" fill="none" opacity=".85">
          <polyline points="30,46 43,36 57,47 70,40"/>
          <polyline points="43,36 49,61 64,67"/>
        </g>
        <g fill="#FFFFFF">
          <circle cx="30" cy="46" r="2.4"/><circle cx="43" cy="36" r="2.8"/><circle cx="57" cy="47" r="2.2"/>
          <circle cx="70" cy="40" r="2.4"/><circle cx="49" cy="61" r="2.2"/><circle cx="64" cy="67" r="2.6"/>
        </g>
        <path d="M84 10 L86 17 L93 19 L86 21 L84 28 L82 21 L75 19 L82 17 Z" fill="#FDE68A"/>
      </symbol>

      <!-- Logo de OrbitCX -->
      <symbol id="logo-orbit" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="6" fill="url(#g-core)"/>
        <ellipse cx="16" cy="16" rx="14" ry="6" fill="none" stroke="#38BDF8" stroke-width="1.6" transform="rotate(-25 16 16)"/>
        <circle cx="28" cy="10.5" r="2.2" fill="#34D399"/>
      </symbol>
    </defs>
  </svg>`;


  /* =========================================================
     3. MENÚ LATERAL DE LA SUITE
     ========================================================= */

  /* Los cuatro módulos de la suite. Los links son relativos
     porque los repos se publican uno al lado del otro:
     matias209.github.io/orbitcx-nebula/, .../orbitcx-comet/, etc. */
  const MODULOS = [
    { id: 'nebula',        nombre: 'Nebula',          link: '../orbitcx-nebula/index.html' },
    { id: 'comet',         nombre: 'Comet',           link: '../orbitcx-comet/index.html' },
    { id: 'mission',       nombre: 'Mission Control', link: '../orbitcx-mission-control/index.html' },
    { id: 'constellation', nombre: 'Constellation',   link: '../orbitcx-constellation/index.html' }
  ];

  /* Escapa el texto para que no se interprete como HTML. */
  function esc(texto) {
    const reemplazos = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(texto == null ? '' : texto).replace(/[&<>"']/g, letra => reemplazos[letra]);
  }

  /* Nombre del archivo de la página actual, ej: "guiones.html". */
  function paginaActual() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  /* Arma el menú lateral.
     opciones:
       module: 'nebula' | 'comet' | 'mission' | 'constellation'
       title:  nombre del módulo, arriba de sus secciones
       nav:    [{ icon, label, href, count }]  (href: null = sección en gris)
       org:    texto del pie del menú
       home:   página de inicio del módulo (por defecto index.html) */
  function shell(opciones) {
    const menu = document.getElementById('ox-side');
    if (!menu) return;

    // Pinta todo con el color del módulo (ver :root[data-module] en orbit.css)
    html.setAttribute('data-module', opciones.module);

    const inicio = opciones.home || 'index.html';
    const pagina = paginaActual();

    const secciones = (opciones.nav || []).map(item => {
      const activa = item.href && item.href.split('#')[0] === pagina;
      const clases = ['ox-nav-item', activa ? 'is-active' : '', item.href ? '' : 'is-off'].join(' ');
      const contador = item.count ? `<span class="ox-count">${esc(item.count)}</span>` : '';
      return `<a class="${clases}" href="${esc(item.href || '#')}"><span class="ox-ic">${esc(item.icon || '•')}</span>${esc(item.label)}${contador}</a>`;
    }).join('');

    const modulos = MODULOS.map(modulo => {
      const esEste = modulo.id === opciones.module;
      return `<a class="ox-nav-item ${esEste ? 'is-active' : ''}" style="--c:var(--ox-${modulo.id})" href="${esEste ? esc(inicio) : modulo.link}">
        <svg><use href="#p-${modulo.id}"/></svg>${esc(modulo.nombre)}</a>`;
    }).join('');

    menu.innerHTML = `
      <a class="ox-logo" href="${esc(inicio)}"><svg><use href="#logo-orbit"/></svg>OrbitCX</a>
      <div class="ox-side-label">${esc(opciones.title || '')}</div>
      ${secciones}
      <div class="ox-side-label">Suite</div>
      ${modulos}
      <div class="ox-side-foot">
        <button class="ox-theme-btn" type="button" data-ox-theme></button>
        <small>${esc(opciones.org || 'Big Tower')}</small>
      </div>`;

    aplicarTema(temaActual()); // para que el botón nuevo muestre el texto correcto
  }

  /* En pantallas chicas el menú se esconde y se abre con
     cualquier botón que tenga el atributo data-ox-menu.
     Se escucha en todo el documento (una sola vez), así sigue
     funcionando aunque la página vuelva a dibujar el botón. */
  function manejarMenuCelular(evento) {
    const app = document.querySelector('.ox-app');
    if (!app) return;

    if (evento.target.closest('[data-ox-menu]')) {
      app.classList.toggle('is-menu-open');
      return;
    }
    // Un clic afuera del menú lo cierra
    if (app.classList.contains('is-menu-open') && !evento.target.closest('.ox-side')) {
      app.classList.remove('is-menu-open');
    }
  }


  /* =========================================================
     ARRANQUE
     ========================================================= */

  function iniciar() {
    // Inserta los planetas una sola vez
    if (!document.getElementById('g-core')) {
      document.body.insertAdjacentHTML('afterbegin', PLANETAS_SVG);
    }

    // Cualquier botón con data-ox-theme cambia el tema
    document.addEventListener('click', evento => {
      if (evento.target.closest('[data-ox-theme]')) cambiarTema();
    });
    document.addEventListener('click', manejarMenuCelular);

    aplicarTema(temaActual());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  // Lo que pueden usar los módulos
  window.OrbitCX = { shell, cambiarTema, esc, modulos: MODULOS };
})();

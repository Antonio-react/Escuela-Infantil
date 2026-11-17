import { Link } from 'react-router'
import rotuloNubes from '../assets/logo-rotulo-nubes.webp'
import { paginas, paginasLegales, paginasMenu } from '../data/paginas'
import { direccionCompleta, enlaceMapa } from '../data/mapa'
import { site } from '../data/site'
import { enlaceTel, enlaceWhatsApp, formatoPantalla, telefonoWhatsApp } from '../data/telefonos'
import { textos } from '../data/textos'
import { IconoEmail, IconoTelefono, IconoWhatsApp } from './Iconos'
import { SocialLinks } from './SocialLinks'

// Cada título con un color del árbol del logo (idea de Antonio), el de su página en el menú cuando la hay:
// Contacto morado y Horario azul, como sus páginas. Páginas en naranja (en verde se confundía con el logo, que
// está al lado). Síguenos en verde: ni rojo ni azul, que chocarían con los iconos de Instagram y Facebook de
// debajo. Información legal en tinta, sin color: en rojo parecía un aviso de peligro. Versiones oscuras
// (-texto) para que se lean sobre el verde del footer.
const claseTitulo = 'font-titulo text-lg font-semibold'
const claseEnlace = 'underline-offset-4 hover:underline'
// Enlaces de contacto con su icono delante (teléfonos, WhatsApp y email). El icono, al tamaño de la letra.
const claseConIcono = 'inline-flex items-center gap-1.5'
const claseIcono = 'size-[1.1em] shrink-0'

// Color de cada página (paginas.ts) → la misma clase con "hover:". Escritas enteras para que Tailwind
// las encuentre (no genera clases montadas con variables).
const hoverPorColor: Record<string, string> = {
  'bg-arbol-naranja': 'hover:bg-arbol-naranja',
  'bg-arbol-azul': 'hover:bg-arbol-azul',
  'bg-arbol-verde': 'hover:bg-arbol-verde',
  'bg-arbol-rojo': 'hover:bg-arbol-rojo',
  'bg-arbol-morado': 'hover:bg-arbol-morado',
}

export function Footer() {
  const anio = new Date().getFullYear()
  const { direccion, horario } = site

  return (
    // Las raíces del árbol de fondo (ArbolFondo.tsx) se dibujan sobre este footer.
    <footer className="bg-verde-suave">
      {/* Móvil (Antonio): el logo y la dirección arriba, centrados a todo lo ancho, y el resto en dos columnas (antes
          iba todo seguido y el footer quedaba larguísimo). Las columnas miden lo que su contenido (auto) y se centran
          como bloque (justify-center): el mismo espacio a la izquierda que a la derecha. Dos columnas también en tablet pequeña, tres en tablet y
          portátil, y cinco desde 1280 px (con la de contacto algo más ancha para que el email quepa entero). Alto
          vertical en proporción a la pantalla. */}
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_auto] justify-center gap-x-10 gap-y-10 px-4 py-[clamp(2.5rem,7svh,3.5rem)] sm:grid-cols-2 sm:justify-normal sm:gap-10 sm:px-6 md:grid-cols-3 xl:grid-cols-[1fr_0.9fr_1.4fr_0.9fr_1.1fr]">
        <div className="col-span-2 flex flex-col items-center gap-3 text-center sm:col-span-1 sm:items-start sm:text-left">
          {/* El logo lleva a Inicio, igual que el del header. */}
          <Link to={paginas.inicio.ruta} className="rounded-lg sm:self-start">
            <img src={rotuloNubes} alt={textos.menu.irInicio} width={1100} height={269} loading="lazy" className="h-10 w-auto" />
          </Link>
          {/* La dirección abre Google Maps (solo un enlace: no carga mapas ni pone cookies). */}
          <address className="not-italic">
            <a
              href={enlaceMapa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${direccionCompleta}, ${textos.footer.verMapa}`}
              className={claseEnlace}
            >
              {direccion.calle}
              <br />
              {direccion.codigoPostal} {direccion.municipio} ({direccion.provincia})
            </a>
          </address>
        </div>

        {/* Enlaces a las páginas del menú. aria-label propio: no se confunde con el menú principal.
            Al pasar el ratón, cada página se rodea de su mancha de color, como en el menú. */}
        <nav aria-label={textos.footer.paginasAria} className="flex flex-col gap-3">
          <h2 className={`${claseTitulo} text-arbol-naranja-texto`}>{textos.footer.paginas}</h2>
          <ul className="-ml-3 flex flex-col gap-0.5">
            {paginasMenu.map((p) => (
              <li key={p.ruta}>
                <Link
                  to={p.ruta}
                  className={`inline-block rounded-[1rem_1.4rem_1.1rem_1.5rem/1.2rem_0.9rem_1.3rem_1rem] px-3 py-0.5 transition-colors duration-200 ${hoverPorColor[p.colorActivo] ?? ''}`}
                >
                  {p.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className={`${claseTitulo} text-arbol-morado-intenso`}>{textos.footer.contacto}</h2>
          <ul className="flex flex-col gap-1.5">
            {site.telefonos.map((t) => (
              <li key={t.numero}>
                <a href={enlaceTel(t.numero)} className={`${claseEnlace} ${claseConIcono}`}>
                  <IconoTelefono className={claseIcono} />
                  {formatoPantalla(t.numero)}
                </a>
              </li>
            ))}
            <li>
              <a
                href={enlaceWhatsApp(telefonoWhatsApp.numero)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={textos.whatsapp.aria}
                className={`${claseEnlace} ${claseConIcono}`}
              >
                <IconoWhatsApp className={claseIcono} />
                {textos.whatsapp.texto}
              </a>
            </li>
            <li>
              {/* overflow-wrap: anywhere → solo parte el email si de verdad no cabe (pantallas muy estrechas). */}
              <a href={`mailto:${site.email}`} className={`${claseEnlace} ${claseConIcono} wrap-anywhere`}>
                <IconoEmail className={claseIcono} />
                {/* Si no cabe, se parte por la arroba (<wbr>), no por cualquier letra (se veía "…gmail.co / m"). */}
                <span className="min-w-0">
                  {site.email.split('@')[0]}@<wbr />
                  {/* En móvil, siempre en dos líneas: así su columna mide lo que mide de verdad y las dos columnas del
                      footer quedan centradas (en una línea, la columna se reservaba el ancho entero del email). */}
                  <br className="sm:hidden" />
                  {site.email.split('@')[1]}
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className={`${claseTitulo} text-arbol-azul-texto`}>{textos.footer.horario}</h2>
          <p>
            {horario.apertura} – {horario.cierre}
          </p>
          <h2 className={`${claseTitulo} mt-3 text-verde`}>{textos.footer.redes}</h2>
          <SocialLinks className="-ml-2" />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className={`${claseTitulo} text-tinta`}>{textos.footer.legal}</h2>
          <ul className="flex flex-col gap-1.5">
            {paginasLegales.map((p) => (
              <li key={p.ruta}>
                <Link to={p.ruta} className={claseEnlace}>
                  {p.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* data-raices-hasta: las raíces del árbol de fondo (ArbolFondo.tsx) llegan casi hasta esta línea. */}
      <div data-raices-hasta className="border-t border-verde/15">
        {/* Los datos de la autorización de centro van en el Aviso legal (no hace falta repetirlos aquí).
            El año sale de new Date(): se actualiza solo cada año. */}
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-6 text-center text-sm text-tinta/80 sm:px-6">
          <p>
            © {anio} {site.razonSocial}
          </p>
        </div>
      </div>
    </footer>
  )
}

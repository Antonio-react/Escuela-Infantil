import { useRef, type CSSProperties } from 'react'
import { calendario } from '../../data/calendario'
import { textos } from '../../data/textos'
import { Asoma } from '../Asoma'
import { IconoAmpliar, IconoCerrar, IconoDescargar, IconoDocumento } from '../Iconos'
import { Reloj } from '../Juguetes'
import { Seccion } from '../Seccion'

const t = textos.secciones.calendario

// El color de cada categoría, el mismo que lleva en el calendario de la escuela (rojo, morado y verde), en la
// versión suave del árbol del logo. En el mismo orden que calendario.categorias.
const colorCategoria = ['bg-arbol-rojo', 'bg-arbol-morado', 'bg-arbol-verde'] as const

// "2026-10-12" → "lunes, 12 de octubre". Se crea la fecha con año, mes y día por separado: new Date("2026-10-12")
// la tomaría como medianoche en UTC y, en un huso horario por detrás, saldría el día 11.
const formatoFecha = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' })
function fechaLegible(iso: string): string {
  const [anio, mes, dia] = iso.split('-').map(Number)
  return formatoFecha.format(new Date(anio, mes - 1, dia))
}

// Lo de dentro del recuadro "Tenedlo siempre a mano": título, frase y las dos
// acciones. Colores: azul en tonos (el de esta página en el menú), elegido por Antonio entre tres combinaciones:
// franja azul pastel, y título, botón y enlace en azul oscuro (blanco sobre él, 6:1). El reloj naranja, de acento.
function ContenidoAMano() {
  return (
    <>
      <div>
        <p className="font-titulo text-2xl font-semibold text-arbol-azul-texto">{t.aManoTitulo}</p>
        <p className="mt-1 text-tinta/80">{t.aManoTexto}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* download: el navegador guarda la imagen en vez de abrirla (en el móvil, a Descargas o a la galería). */}
        {/* Con un ratoncito asomando por arriba (Asoma.tsx; Antonio, 2026-11-16). */}
        <Asoma animal="raton">
          <a href={calendario.jpg.src} download={`calendario-escolar-${calendario.curso}.jpg`} aria-label={t.descargarAria} className="boton bg-arbol-azul-texto text-white">
            <IconoDescargar className="size-5" />
            {t.descargar}
          </a>
        </Asoma>
        <a
          href={calendario.pdf}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.verPdfAria}
          className="inline-flex min-h-12 items-center gap-2 font-titulo font-semibold text-arbol-azul-texto underline-offset-4 hover:underline"
        >
          <IconoDocumento className="size-5" />
          {t.verPdf}
        </a>
      </div>
    </>
  )
}

// "Tenedlo siempre a mano" como una hoja de taco de calendario. Franja de color arriba (como la cabecera de cada mes en el
// calendario de la escuela; azul pastel, el color de esta página en el menú), anillas de espiral que la atraviesan, la hoja un poco girada y el reloj de juguete
// sentado en la esquina de abajo. Todo decorativo (aria-hidden); el contenido es el mismo.
const ANILLAS = 7
// Reloj en naranja (con las variables de Juguetes.tsx): el único acento; en su azul de siempre se fundía con la hoja.
const RELOJ_NARANJA = {
  '--juguete': 'var(--color-arbol-naranja-intenso)',
  '--juguete-claro': 'var(--color-arbol-naranja)',
} as CSSProperties

function HojaTaco() {
  return (
    <div className="relative mt-4 -rotate-1 rounded-[0.75rem_0.75rem_1.5rem_1.5rem] bg-white shadow-[0_0.75rem_1.75rem_rgb(43_40_48/0.12)] ring-1 ring-tinta/5">
      <div aria-hidden="true" className="h-9 rounded-t-xl bg-arbol-azul" />
      {/* Anillas: cada una, un aro con el borde oscuro que asoma por encima de la hoja. */}
      <div aria-hidden="true" className="absolute inset-x-8 -top-3.5 flex justify-between">
        {Array.from({ length: ANILLAS }, (_, i) => (
          <span key={i} className="h-8 w-3 rounded-full border-[3px] border-tinta/65 bg-crema" />
        ))}
      </div>
      <div className="flex flex-col gap-5 p-6 pb-8 sm:p-7 sm:pb-9">
        <ContenidoAMano />
      </div>
      {/* En móvil, dentro de la hoja: asomando por fuera se salía de la pantalla (scroll horizontal). */}
      <Reloj style={RELOJ_NARANJA} className="absolute right-2 -bottom-5 size-16 rotate-12 sm:-right-3" />
    </div>
  )
}


// Horario y calendario: la imagen del calendario (al pulsarla se amplía, como una foto) y, al lado, los festivos y
// días sin clase en texto HTML real (se leen con lector de pantalla, se pueden buscar y Google los entiende).
// Debajo, el aviso y un recuadro para llevárselo: guardar la imagen en el móvil o abrir el PDF.
export function Calendario() {
  const visorRef = useRef<HTMLDialogElement>(null)
  const cerrarVisor = () => visorRef.current?.close()

  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'circulo', color: 'naranja' }} colorTitulo="text-ciruela">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        {/* La imagen es un botón que abre el visor. Su nombre accesible: el alt de la imagen + "Ampliar".
            width/height reales (sin saltos al cargar, CLS) y lazy: está lejos del principio. */}
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => visorRef.current?.showModal()}
          className="folio group relative mx-auto block w-full max-w-md cursor-zoom-in transition-transform duration-300 ease-salida hover:-translate-y-1 lg:max-w-none"
        >
          {/* Un folio de papel con la esquina de abajo a la derecha un poco levantada (idea de Antonio): clases
              .folio y .folio-papel de index.css. span y no div: dentro de un <button> solo vale contenido "de línea". */}
          <span className="folio-papel">
            <img
              src={calendario.imagen.src}
              alt={t.alt}
              width={calendario.imagen.ancho}
              height={calendario.imagen.alto}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </span>
          {/* La lupa dice "esto se amplía" (en móvil no hay cursor que lo diga). Centrada en el borde de abajo, medio
              fuera del papel: dentro tapaba el texto del calendario, y a la derecha está la esquina levantada. */}
          <span className="absolute -bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-tinta/80 px-3.5 py-2 font-titulo text-sm font-medium text-white">
            <IconoAmpliar className="size-4" />
            {t.ampliar}
          </span>
        </button>

        <div className="flex flex-col gap-8">
          {/* Los festivos y días sin clase en texto, solo desde lg (al lado del calendario). Por debajo irían DEBAJO
              de la imagen y alargaban mucho la página; ya se ven en el calendario (Antonio, 2026-11-16). El alt de la
              imagen dice qué colores tiene cada tipo de día. */}
          {calendario.categorias.map((categoria, i) => (
            <div key={categoria.nombre} className="hidden lg:block">
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                <span aria-hidden="true" className={`size-4 shrink-0 rounded-full ${colorCategoria[i % colorCategoria.length]}`} />
                {categoria.nombre}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categoria.fechas.map((fecha) => (
                  <li key={fecha}>
                    <time dateTime={fecha} className={`inline-block rounded-full px-3.5 py-1.5 first-letter:uppercase ${colorCategoria[i % colorCategoria.length]}`}>
                      {fechaLegible(fecha)}
                    </time>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="text-tinta/75">{calendario.aviso}</p>

          {/* "Tenedlo siempre a mano" como una hoja de taco de calendario (elegida por Antonio frente a la nota pegada). */}
          <HojaTaco />
        </div>
      </div>

      {/* Visor: <dialog> nativo con showModal(). Atrapa el foco, se cierra con Esc y, al cerrar, el foco vuelve
          al botón de la imagen. Pulsar fuera de la imagen (en el fondo oscuro) también cierra.
          open:flex y no flex: con "flex" a secas el diálogo cerrado se vería (pisa el display: none del navegador).
          Imagen grande (el JPG de 1600 px, nítido) que ocupa el ancho hasta 52rem; si es más alta que la pantalla,
          se desplaza dentro del visor. lazy: no se descarga hasta que se abre. */}
      <dialog
        ref={visorRef}
        aria-label={t.titulo}
        onClick={(evento) => {
          if (evento.target === evento.currentTarget) cerrarVisor()
        }}
        className="visor fixed inset-0 m-0 h-full max-h-none w-full max-w-none flex-col items-center overflow-y-auto bg-transparent p-4 backdrop:bg-tinta/85 open:flex sm:p-8"
      >
        <button
          type="button"
          onClick={cerrarVisor}
          aria-label={t.cerrarVisor}
          className="fixed top-3 right-3 z-10 grid size-12 place-items-center rounded-full bg-white text-tinta shadow-lg transition-transform duration-150 active:scale-95 sm:top-5 sm:right-5"
        >
          <IconoCerrar />
        </button>
        <img
          src={calendario.jpg.src}
          alt={t.alt}
          width={calendario.jpg.ancho}
          height={calendario.jpg.alto}
          loading="lazy"
          decoding="async"
          className="my-auto h-auto w-full max-w-208 rounded-2xl bg-white"
        />
      </dialog>
    </Seccion>
  )
}

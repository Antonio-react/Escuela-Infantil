import { faqs } from '../../data/faqs'
import { site } from '../../data/site'
import { textos } from '../../data/textos'
import { Patito } from '../Juguetes'
import { Seccion } from '../Seccion'

// "Preguntas de las familias": acordeón NATIVO (<details> y <summary>). Sin JavaScript: se abre y se cierra con
// el ratón, el dedo o el teclado (Intro o espacio), y el lector de pantalla anuncia si está abierto o cerrado.
// Cada pregunta con su número en un círculo de un color del árbol. El "+" pierde su raya vertical al abrir y
// queda un "−". La respuesta entra con un fundido corto (.pregunta, en index.css).
// A la izquierda (escritorio), la familia de patos de Familias (mamá y dos patitos, como en la pizarra del menú)
// y la paloma mensajera con el email (EscribidnosPaloma). En móvil: los patos pequeños y centrados encima de las
// preguntas y la paloma debajo (ver el comentario de la columna).

const coloresNumero = ['bg-arbol-naranja', 'bg-arbol-verde', 'bg-arbol-rojo', 'bg-arbol-azul', 'bg-arbol-morado'] as const

// "+" que se convierte en "−": la raya vertical se encoge a 0 (scale) cuando el <details> está abierto.
function MasMenos() {
  return (
    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-tinta/10">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" className="origin-center transition-transform duration-200 ease-salida group-open:scale-y-0" />
      </svg>
    </span>
  )
}

// Mamá pata y sus dos patitos, en fila (decorativo). Pequeños en móvil, grandes en escritorio.
function FamiliaPatos({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-end gap-1 ${className}`}>
      <Patito className="size-14 -scale-x-100 lg:size-24" />
      <Patito className="size-9 -scale-x-100 lg:size-14" />
      <Patito className="size-8 -scale-x-100 lg:size-12" />
    </div>
  )
}

// Paloma mensajera (idea de Antonio) volando con una carta en el pico. Dibujo propio, plano, en los azules de la
// marca. Al pasar el ratón por el bloque, bate el ala (gira desde donde nace). Decorativa (aria-hidden).
function PalomaMensajera({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 68 48" className={className} aria-hidden="true" focusable="false">
      {/* Cola */}
      <path d="M12 27 2 20.5l2.5 11z" fill="var(--color-azul)" />
      {/* Cuerpo */}
      <ellipse cx="27" cy="29" rx="16" ry="9.5" fill="var(--color-azul)" />
      {/* Cabeza, ojo y pico */}
      <circle cx="43" cy="21" r="7" fill="var(--color-azul)" />
      <circle cx="45.2" cy="19.4" r="1.3" fill="var(--color-tinta)" />
      <path d="M49.6 20.6 54 22l-4.4 1.6z" fill="var(--color-arbol-naranja-intenso)" />
      {/* La carta, sujeta con el pico */}
      <rect x="53" y="19" width="13" height="9" rx="1.2" fill="var(--color-white)" stroke="var(--color-coral)" strokeWidth="1.2" />
      <path d="m53.6 19.6 5.9 4.6 5.9-4.6" fill="none" stroke="var(--color-coral)" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Ala levantada: gira desde donde nace (30, 25) al pasar el ratón. */}
      <path
        d="M30 25C25 15 30 4 41 3c-3 6-4 13-6 20z"
        fill="var(--color-azul-suave)"
        stroke="var(--color-azul)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        className="origin-[30px_25px] transition-transform duration-300 ease-salida group-hover:rotate-[-18deg]"
      />
    </svg>
  )
}

// "Si os queda alguna duda, escribidnos": la paloma y, al lado, la frase y el email como enlace (se ve a dónde se
// escribe; mailto: abre el correo). min-h-11: el enlace mide al menos 44 px de alto, fácil de pulsar.
// Entre lg y xl (tablet en horizontal, portátil pequeño) la columna es estrecha y el email se partía
// ("…@gmai / l.com"): ahí la paloma va ENCIMA del texto, y el email tiene toda la columna.
function EscribidnosPaloma() {
  const t = textos.secciones.preguntas
  return (
    <div className="group flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
      <PalomaMensajera className="w-24 shrink-0 -rotate-6" />
      <div>
        <p className="font-titulo text-xl leading-snug font-semibold text-ciruela">{t.escribenos}</p>
        <a
          href={`mailto:${site.email}`}
          aria-label={t.escribenosAria}
          className="inline-flex min-h-11 items-center text-lg text-tinta/85 underline decoration-coral/40 decoration-2 underline-offset-4 wrap-anywhere transition-colors hover:decoration-coral"
        >
          {site.email}
        </a>
      </div>
    </div>
  )
}

export function PreguntasFrecuentes() {
  const t = textos.secciones.preguntas
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'subrayado', color: 'azul' }} colorTitulo="text-ciruela">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_2fr] lg:gap-14">
        {/* Columna de la izquierda. En móvil es "contents": la caja desaparece y los patos y la paloma pasan a ser
            piezas sueltas de la rejilla, que se ordenan solas (patos arriba y centrados, order-first; paloma abajo,
            order-last; las preguntas en medio). En escritorio es una columna de verdad (lg:flex): los patos arriba y la
            paloma abajo (justify-between); lg:pb-24 la sube hasta la altura de la pregunta 7, más o menos. */}
        <div className="contents lg:flex lg:flex-col lg:justify-between lg:self-stretch lg:pb-24">
          <FamiliaPatos className="order-first justify-self-center lg:order-0 lg:justify-self-auto" />
          <div className="order-last lg:order-0">
            <EscribidnosPaloma />
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <li key={faq.pregunta}>
              <details className="pregunta group rounded-3xl bg-white ring-1 ring-tinta/5 transition-shadow duration-200 open:shadow-[0_0.75rem_1.75rem_rgb(43_40_48/0.08)]">
                {/* list-none + el ::-webkit-details-marker de index.css: sin el triángulo del navegador. */}
                <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 rounded-3xl p-4 sm:px-6">
                  <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-full font-titulo font-semibold ${coloresNumero[i % coloresNumero.length]}`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 font-titulo text-lg leading-snug font-semibold sm:text-xl">{faq.pregunta}</span>
                  <MasMenos />
                </summary>
                <p className="pregunta-respuesta px-4 pb-6 text-lg leading-relaxed text-tinta/80 sm:pr-20 sm:pl-19">{faq.respuesta}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  )
}

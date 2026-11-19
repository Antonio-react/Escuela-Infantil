import { useInView } from 'motion/react'
import { useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode, type SVGProps } from 'react'
import { Link } from 'react-router'
import { paginas, type Pagina } from '../../data/paginas'
import { textos } from '../../data/textos'
import { Bloque, Osito, Patito, Reloj, TelefonoJuguete } from '../Juguetes'
import { FONDO, PiezaPuzzle, type Lados } from '../PiezaPuzzle'
import { Seccion } from '../Seccion'
import type { EstiloConVariables } from '../Tiza'

// Inicio, "Conoce la escuela": las cuatro páginas como PIEZAS DE PUZZLE encajadas (idea de Antonio, 2026-11-16;
// antes eran tarjetas y la de La escuela quedaba alta y vacía). Cada pieza, del color y con el juguete que su página
// tiene en el menú, y su descripción (de paginas.ts: no hay textos nuevos); sin recuadro dentro, solo el texto. Toda
// la pieza es el enlace; al pasar el ratón se levanta un poco, como si se cogiera. Al verse, el puzzle se monta
// (PiezaQueLlega, más abajo).
// - Desde lg: 2 × 2, encajadas (cada saliente casa con el entrante de la vecina).
// - Móvil: una debajo de otra, encajadas, con los salientes desplazados a un lado y a otro (no simétrico).
// La forma, en PiezaPuzzle.tsx.

const juguetes: Record<NonNullable<Pagina['juguete']>, ComponentType<SVGProps<SVGSVGElement>>> = {
  osito: Osito,
  bloque: Bloque,
  reloj: Reloj,
  patito: Patito,
  telefono: TelefonoJuguete,
}

// Pinta el juguete con el color intenso de su página (los juguetes leen estas variables, ver Juguetes.tsx).
function coloresJuguete(color: string): EstiloConVariables {
  return {
    '--juguete': color,
    '--juguete-claro': `color-mix(in oklab, ${color} 45%, white)`,
    '--juguete-pico': 'var(--color-arbol-naranja-intenso)',
  }
}

const piezas: readonly Pagina[] = [paginas.laEscuela, paginas.horarioCalendario, paginas.familias, paginas.contacto]

// Encajes en 2 × 2 (orden: arriba izquierda, arriba derecha, abajo izquierda, abajo derecha). Cada lado que da a una
// vecina tiene un saliente (+1) y la vecina, en ese lado, su entrante (-1), en el mismo sitio.
// OJO con "en": cada lado se recorre en el sentido de las agujas del reloj (arriba de izquierda a derecha, derecha de
// arriba abajo, abajo de derecha a izquierda, izquierda de abajo arriba). Por eso, en dos lados que casan, uno mide
// desde un extremo y el otro desde el contrario: en = 1 − en de la vecina.

// Como el puzzle montado de la referencia de Antonio (2026-11-16): salientes centrados y también en los bordes de
// fuera (arriba, derecha y abajo salen; a la izquierda solo entrantes). Los que salen por fuera necesitan sitio: el
// padding de la lista (lg:p-18 = FONDO; también a la izquierda, para que quede centrado).
const SALE = { tipo: 1 } as const
const ENTRA = { tipo: -1 } as const
const encajesRejilla: readonly Lados[] = [
  { arriba: SALE, derecha: SALE, abajo: SALE, izquierda: ENTRA },
  { arriba: ENTRA, derecha: SALE, abajo: ENTRA, izquierda: ENTRA },
  { arriba: ENTRA, derecha: SALE, abajo: ENTRA, izquierda: ENTRA },
  { arriba: SALE, derecha: ENTRA, abajo: SALE, izquierda: ENTRA },
]
// En columna (cuando ya no cabe el 2 × 2): la misma forma, una debajo de otra. A la derecha salen si hay sitio;
// si no (móvil), entrante también a la derecha, para no comer ancho de pantalla.
const encajesColumna = (derecha: typeof SALE | typeof ENTRA): readonly Lados[] => [
  { arriba: SALE, derecha, abajo: SALE, izquierda: ENTRA },
  { arriba: ENTRA, derecha, abajo: ENTRA, izquierda: ENTRA },
  { arriba: SALE, derecha, abajo: SALE, izquierda: ENTRA },
  { arriba: ENTRA, derecha, abajo: SALE, izquierda: ENTRA },
]

// Cómo se coloca, según el ancho de la lista (A): se busca que el texto de cada pieza tenga al menos TEXTO_MIN px,
// con salientes lo más grandes posible (escala 1 = escritorio). En cada pieza el texto deja F + 8 px por lado (F =
// FONDO × escala: lo que entra un entrante) y la lista deja F por lado para los salientes de fuera.
// 1) 2 × 2 (Antonio, 2026-11-16: en escritorio "perfecto"; que siga así mientras quepa).
// 2) Columna con salientes a la derecha. 3) Columna con entrantes a los dos lados (móvil).
const TEXTO_MIN = 240
const ESCALAS = [1, 0.9, 0.8, 0.7] as const
type Colocacion = { rejilla: boolean; escala: number; salenDerecha: boolean }
function colocacion(A: number): Colocacion {
  const hueco = (e: number) => 2 * (FONDO * e + 8) // lo que la pieza quita al texto
  for (const e of ESCALAS) if ((A - 2 * FONDO * e) / 2 - hueco(e) >= TEXTO_MIN) return { rejilla: true, escala: e, salenDerecha: true }
  for (const e of ESCALAS) if (A - 2 * FONDO * e - hueco(e) >= TEXTO_MIN) return { rejilla: false, escala: e, salenDerecha: true }
  for (const e of [0.8, 0.7]) if (A - hueco(e) >= TEXTO_MIN) return { rejilla: false, escala: e, salenDerecha: false }
  return { rejilla: false, escala: 0.6, salenDerecha: false }
}

// El color de la pieza: el del enlace activo de su página en el menú (colorActivo es "bg-arbol-…").
const colorDe = (pagina: Pagina) => `var(--color-${pagina.colorActivo.replace('bg-', '')})`

// EL PUZZLE SE MONTA (Antonio, 2026-11-16): al verse, cada pieza llega desde fuera, un poco girada, y encaja
// (.pieza-llega en index.css). Una sola vez, no atado al scroll (a mitad quedaría medio montado y sin leerse).
// - 2 × 2: todas a la vez al verse el puzzle, una tras otra, cada una desde su esquina.
// - Columna: cada pieza al entrar en pantalla, alternando desde la izquierda y la derecha.
const LLEGADA_REJILLA = [
  { x: '-3.5rem', y: '-2.5rem', giro: '-8deg' },
  { x: '3.5rem', y: '-2.5rem', giro: '7deg' },
  { x: '-3.5rem', y: '2.5rem', giro: '6deg' },
  { x: '3.5rem', y: '2.5rem', giro: '-7deg' },
] as const
const LLEGADA_COLUMNA = [
  { x: '-2.5rem', y: '1.5rem', giro: '-6deg' },
  { x: '2.5rem', y: '1.5rem', giro: '6deg' },
] as const
const RETRASO_ENTRE_PIEZAS = 170 // ms, en 2 × 2

function PiezaQueLlega({ i, rejilla, puzzleVisto, children }: { i: number; rejilla: boolean; puzzleVisto: boolean; children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null)
  const piezaVista = useInView(ref, { once: true, amount: 0.4 })
  const llegada = rejilla ? LLEGADA_REJILLA[i] : LLEGADA_COLUMNA[i % 2]
  const estilo = {
    '--desde-x': llegada.x,
    '--desde-y': llegada.y,
    '--desde-giro': llegada.giro,
    '--retraso': `${rejilla ? i * RETRASO_ENTRE_PIEZAS : 0}ms`,
  } as CSSProperties
  return (
    // hover:z-10: la pieza que se levanta, por encima de las demás.
    <li ref={ref} data-visto={rejilla ? puzzleVisto : piezaVista} className="pieza-llega group relative hover:z-10" style={estilo}>
      {children}
    </li>
  )
}

export function ResumenPaginas() {
  const t = textos.secciones.resumen
  const lista = useRef<HTMLUListElement>(null)
  const [{ rejilla, escala, salenDerecha }, setColocacion] = useState<Colocacion>(() => colocacion(0))
  useLayoutEffect(() => {
    const el = lista.current
    if (!el) return
    const medir = () => setColocacion(colocacion(el.offsetWidth))
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [])
  const puzzleVisto = useInView(lista, { once: true, amount: 0.3 })
  const encajes = rejilla ? encajesRejilla : encajesColumna(salenDerecha ? SALE : ENTRA)
  const F = FONDO * escala
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'chispas', color: 'naranja' }} entradilla={t.entradilla}>
      {/* Sin hueco entre piezas (gap-0): van pegadas y los salientes entran en los entrantes. El padding, para los
          salientes de fuera (arriba, abajo y, si salen, derecha; a la izquierda igual, para que quede centrado). */}
      <ul
        ref={lista}
        className={`grid ${rejilla ? 'grid-cols-2' : ''}`}
        style={{ padding: salenDerecha ? `${F}px` : `${F}px 0` }}
      >
        {piezas.map((pagina, i) => {
          const Juguete = pagina.juguete ? juguetes[pagina.juguete] : null
          return (
            <PiezaQueLlega key={pagina.ruta} i={i} rejilla={rejilla} puzzleVisto={puzzleVisto}>
              <PiezaPuzzle
                lados={encajes[i]}
                color={colorDe(pagina)}
                escala={escala}
                className="h-full transition-[translate,filter] duration-300 ease-salida group-hover:-translate-y-1.5 group-hover:drop-shadow-[0_0.6rem_0.8rem_rgb(43_40_48/0.18)]"
              >
                {/* F + 8 px: deja sitio a los entrantes para que nunca corten el texto. */}
                <Link
                  to={pagina.ruta}
                  className="flex h-full flex-col transition-transform duration-150 active:scale-[0.98]"
                  style={{ padding: `${F + 8}px` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-semibold text-tinta sm:text-3xl">{pagina.nombre}</h3>
                    {Juguete && pagina.colorIntenso && (
                      <Juguete
                        className="size-14 shrink-0 transition-transform duration-300 ease-salida group-hover:-translate-y-1 group-hover:-rotate-6 sm:size-16"
                        // Subido hacia la esquina de arriba a la derecha (Antonio, 2026-11-16): las esquinas no tienen
                        // salientes ni entrantes (van en el centro de cada lado), así que ahí hay sitio.
                        style={{ ...coloresJuguete(pagina.colorIntenso), margin: `${-F * 0.55}px ${-F * 0.55}px 0 0` }}
                      />
                    )}
                  </div>
                  <p className="mt-3 max-w-md text-tinta/80">{pagina.resumen ?? pagina.descripcion}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-titulo font-semibold text-tinta">
                    {t.verMas}
                    {/* Flecha decorativa: el texto del enlace ya es el nombre de la página. */}
                    <span aria-hidden="true" className="transition-transform duration-200 ease-salida group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </PiezaPuzzle>
            </PiezaQueLlega>
          )
        })}
      </ul>
    </Seccion>
  )
}

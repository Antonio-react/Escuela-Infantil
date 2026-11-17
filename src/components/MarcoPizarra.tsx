import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { textos } from '../data/textos'
import { usePizarraPintable } from '../hooks/usePizarraPintable'
import type { EstiloConVariables } from './Tiza'
import { tizas } from './utilidadesTiza'

// Pizarra de aula "de las de antes" (404 y cierre de las páginas): marco de madera, la pizarra dentro y, abajo,
// el pollete con las tizas de colores y el borrador. Lo de dentro lo pone quien la usa (children).
//
// SE PUEDE PINTAR (idea de Antonio, 2026-11-16; la lógica, en usePizarraPintable):
// - Las tizas del pollete y el borrador son botones. Tocar una tiza o el borrador lo "coge" (sale del pollete: está en
//   la mano); tocarlo otra vez lo deja. Con una tiza se pinta de su color; con el borrador, se borra por donde se pasa
//   (Antonio: que el borrador se coja y se borre a mano, no que borre todo de golpe).
// - Ordenador: dentro de la pizarra el puntero es lo que se tiene en la mano (la tiza blanca si no hay nada) y se
//   pinta arrastrando con el ratón.
// - Móvil: sin nada en la mano, arrastrar de lado o en diagonal pinta con tiza blanca (Antonio: la gente no sabrá
//   que hay que coger una tiza) y en vertical hace scroll (touch-action: pan-y). Con algo en la mano, el dedo pinta o
//   borra en cualquier dirección (touch-action: none). Bajo el dedo se ve la tiza o el borrador.
// - Lo pintado queda DEBAJO de lo escrito (el canvas va detrás) y tocar un enlace o un botón no pinta.
// - Una pista a tiza en una esquina: cómo pintar, hasta que se pinta; y, con algo en la mano, cómo soltarlo.

// Tizas del pollete: los colores que se usan en la pizarra, cada una con su largo y un poco girada,
// como cuando se dejan en la bandeja (posición y ancho en % del pollete: así se adapta al tamaño).
const TIZAS_POLLETE = [
  { clave: 'morada', color: tizas.morada, izquierda: '6%', ancho: '9%', giro: '-4deg' },
  { clave: 'blanca', color: tizas.blanca, izquierda: '17%', ancho: '11%', giro: '2deg' },
  { clave: 'verde', color: tizas.verde, izquierda: '30%', ancho: '7%', giro: '-2deg' },
  { clave: 'naranja', color: tizas.naranja, izquierda: '39%', ancho: '9%', giro: '5deg' },
  { clave: 'azul', color: tizas.azul, izquierda: '50%', ancho: '8%', giro: '-3deg' },
] as const
const BLANCA = 1 // la tiza con la que se pinta con el ratón si no se ha cogido ninguna

// Puntero de tiza (ordenador): un palito de tiza en diagonal, del color elegido, con la punta abajo a la izquierda
// (el punto que pinta: 3, 29).
function cursorDeTiza(rgb: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g transform="rotate(-45 16 16)"><rect x="4" y="12.5" width="24" height="7" rx="3.5" fill="${rgb}" stroke="rgba(0,0,0,0.55)" stroke-width="1.2"/><rect x="4" y="12.5" width="5" height="7" rx="3" fill="rgba(255,255,255,0.35)"/></g></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 3 29, crosshair`
}
// Puntero de borrador (ordenador): un borrador visto de lado, con el centro en el punto que borra.
const CURSOR_BORRADOR = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" viewBox="0 0 40 24"><rect x="2" y="2" width="36" height="12" rx="2.5" fill="#6b4423" stroke="rgba(0,0,0,0.5)"/><rect x="2" y="13" width="36" height="9" rx="1.5" fill="#3a3d3b" stroke="rgba(0,0,0,0.5)"/><rect x="6" y="15" width="12" height="3" rx="1.5" fill="rgba(255,255,255,0.3)"/></svg>',
)}") 20 12, cell`

// Lo que hay en la mano: el número de una tiza, el borrador o nada.
type EnMano = number | 'borrador' | null

type MarcoPizarraProps = {
  children: ReactNode
  claseMarco?: string // tamaño del conjunto (por ejemplo, 'w-full max-w-3xl')
  clasePizarra?: string // márgenes interiores y alineación de lo escrito
}

export function MarcoPizarra({ children, claseMarco = '', clasePizarra = '' }: MarcoPizarraProps) {
  const t = textos.pizarra
  const [enMano, setEnMano] = useState<EnMano>(null)
  // Qué pista se enseña (Antonio: si se pinta con la blanca, nadie se entera de que hay más colores y borrador):
  //   'inicio': antes de pintar, cómo pintar. 'otros': después de pintar con la blanca sin haber cogido nada, que se
  //   puede elegir otro color o borrar. 'nada': en cuanto se ha cogido una tiza o el borrador, ya lo saben.
  const [pista, setPista] = useState<'inicio' | 'otros' | 'nada'>('inicio')
  const [dedo, setDedo] = useState<{ x: number; y: number } | null>(null)
  const borrador = enMano === 'borrador'
  // La tiza con la que se pinta: la de la mano o, si no hay ninguna, la blanca.
  const tiza = typeof enMano === 'number' ? enMano : BLANCA
  const { contenedor, lienzo, eventos } = usePizarraPintable({
    color: TIZAS_POLLETE[tiza].color,
    borrador,
    // La primera vez que se pinta: con la blanca (sin nada en la mano), la pista de otros colores; con una de color,
    // ya han descubierto las tizas.
    alPintar: () => setPista(enMano === null ? 'otros' : 'nada'),
    alMoverDedo: setDedo,
    // Puntero (solo se ve con ratón): el borrador o la tiza del color con el que se pinta (lo pone el hook).
    cursorTiza: cursorDeTiza,
    cursorBorrador: CURSOR_BORRADOR,
  })

  // Tocar algo del pollete: si ya está en la mano, se deja; si no, se coge (y se deja lo que hubiera).
  const alTocar = (cosa: number | 'borrador') => {
    setEnMano((actual) => (actual === cosa ? null : cosa))
    setPista('nada') // ya saben que las tizas y el borrador se cogen
  }
  // Con el dedo se reacciona al LEVANTARLO (pointerup), no al clic: justo después de pintar, el navegador toma el
  // primer toque como "parar el desplazamiento" y no genera clic (la tiza o el borrador no se cogían). Con ratón y
  // teclado, el clic de siempre; el clic que llega detrás de un toque ya atendido se ignora.
  const ultimoToque = useRef(0)
  const alPulsar = (cosa: number | 'borrador') => ({
    onPointerUp: (evento: ReactPointerEvent) => {
      if (evento.pointerType === 'mouse') return
      ultimoToque.current = Date.now()
      alTocar(cosa)
    },
    onClick: () => {
      if (Date.now() - ultimoToque.current < 700) return
      alTocar(cosa)
    },
  })

  return (
    <div className={`marco-pizarra ${claseMarco}`}>
      {/* touch-none: en el móvil, el dedo pinta siempre (como el ratón) y la página no se mueve al pintar; el scroll se
          hace tocando fuera de la pizarra (Antonio). */}
      <div ref={contenedor} {...eventos} className={`pizarra @container relative isolate touch-none overflow-hidden font-tiza ${clasePizarra}`}>
        <canvas ref={lienzo} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 size-full" />
        {children}
        {/* Bajo el dedo, mientras se pinta o se borra con el dedo (con el ratón ya está el puntero): la tiza o el
            borrador. */}
        {dedo &&
          (borrador ? (
            <span aria-hidden="true" className="borrador pointer-events-none absolute z-10 h-6 w-16 -translate-x-1/2 -translate-y-1/2 -rotate-6" style={{ left: dedo.x, top: dedo.y }}>
              <span className="borrador-esponja" />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="tiza-palo pointer-events-none absolute z-10 h-2.5 w-12 origin-left -rotate-45"
              style={{ left: dedo.x, top: dedo.y, '--tiza-color': TIZAS_POLLETE[tiza].color } as EstiloConVariables}
            />
          ))}
        {/* La pista: cómo pintar, hasta que se pinta; con algo en la mano, cómo soltarlo (en el móvil, mientras se tiene,
            el dedo pinta y no hace scroll: así nadie se queda "atrapado"). */}
        {(enMano !== null || pista !== 'nada') && (
          <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 left-4 text-sm text-tiza/70 sm:left-6">
            {borrador ? t.pistaSoltarBorrador : enMano !== null ? t.pistaSoltar : pista === 'otros' ? t.pistaOtrosColores : t.pista}
          </span>
        )}
      </div>
      {/* Pollete: las tizas y, a la derecha, el borrador (botones: cogerlo o dejarlo). Cada botón ocupa todo el alto del
          pollete y algo más que su dibujo, para que se pueda tocar bien con el dedo. */}
      {/* --alto-pollete: para colocar cada palito donde estaba (a un 38 % del alto del pollete, desde abajo).
          touch-manipulation: sin el doble toque de zoom, que se comía el toque en una tiza o el borrador si se daba
          justo después de pintar. */}
      <div className="pollete relative mt-2 h-7 touch-manipulation [--alto-pollete:1.75rem] sm:h-8 sm:[--alto-pollete:2rem]">
        {TIZAS_POLLETE.map(({ clave, color, izquierda, ancho, giro }, i) => {
          const enLaMano = enMano === i
          const nombre = t.colores[clave]
          return (
            <button
              key={clave}
              type="button"
              aria-pressed={enLaMano}
              aria-label={enLaMano ? t.soltar(nombre) : t.tiza(nombre)}
              {...alPulsar(i)}
              // El botón: 0,5rem más por arriba y por abajo (-inset-y-2) y 0,375rem más por cada lado que el palito.
              className="group absolute -inset-y-2 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-tiza"
              style={{ left: `calc(${izquierda} - 0.375rem)`, width: `calc(${ancho} + 0.75rem)` }}
            >
              {/* El palito, donde estaba antes: mismo ancho y a un 38 % del alto del pollete desde abajo (más los 0,5rem
                  que el botón baja de más). Cogido, sube un poco y se queda casi transparente (está en la mano). */}
              <span
                className={`tiza-palo absolute inset-x-1.5 block h-[0.45rem] transition-[translate,opacity] duration-200 ease-salida group-hover:-translate-y-0.5 sm:h-2 ${enLaMano ? '-translate-y-2 opacity-30' : ''}`}
                style={{ '--tiza-color': color, rotate: giro, bottom: 'calc(0.5rem + 0.38 * var(--alto-pollete))' } as EstiloConVariables}
              />
            </button>
          )
        })}
        {/* El borrador: se coge y se borra a mano (cogido, sube y se queda casi transparente, como las tizas). */}
        <button
          type="button"
          aria-pressed={borrador}
          aria-label={borrador ? t.soltarBorrador : t.cogerBorrador}
          {...alPulsar('borrador')}
          className={`borrador absolute right-[7%] bottom-[22%] h-6 w-[19%] max-w-24 cursor-pointer transition-[translate,opacity] duration-200 ease-salida hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tiza sm:h-7 ${borrador ? '-translate-y-2 opacity-30' : ''}`}
        >
          <span className="borrador-esponja" />
        </button>
      </div>
    </div>
  )
}

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

// Pieza de puzzle (idea de Antonio, 2026-11-16: "Conoce la escuela" como 4 piezas de puzzle encajadas). La forma se
// dibuja en SVG con el tamaño REAL de la pieza en píxeles (se mide con ResizeObserver), no estirada: así los
// salientes son siempre redondos, sea cual sea el ancho de la pieza.
// Cada lado (arriba, derecha, abajo, izquierda) puede ser:
//    0  liso (borde de fuera del puzzle)
//   +1  saliente (sale hacia fuera y entra en el hueco de la pieza vecina)
//   -1  entrante (el hueco donde encaja el saliente de la vecina)
// y su posición a lo largo del lado (0-1: 0,5 en el centro). Las piezas vecinas van pegadas (sin hueco entre ellas):
// el saliente de una se dibuja por encima del entrante de la otra, y casan. Las esquinas de fuera del puzzle (las
// que tienen sus dos lados lisos), redondeadas; las de dentro, rectas.
// Un trazo del color del fondo marca el corte entre piezas.

type Lado = { tipo: -1 | 0 | 1; en?: number }
export type Lados = { arriba: Lado; derecha: Lado; abajo: Lado; izquierda: Lado }

// Saliente de puzzle CLÁSICO (referencia de Antonio, 2026-11-16: los primeros, con cuello recto y esquinas en ángulo,
// no parecían de puzzle): cabeza redonda grande, cuello estrecho y hombros curvos (el borde se dobla en curva suave
// hacia el cuello, no en esquina).
// Medidas a tamaño 1 (escritorio); en pantallas más estrechas se usan a escala (prop "escala"), con la misma forma.
export const FONDO = 72 // lo que sale (o entra) un saliente, en px
const RADIO = 33 // radio de la cabeza del saliente
const CUELLO = 17 // medio ancho del cuello (en su parte más estrecha)
const HOMBRO = 10 // radio de la curva con la que el borde se dobla hacia el cuello
const ESQUINA = 22 // radio de las esquinas de fuera

type Punto = [number, number]

// Un lado de la pieza, de "desde" a "hasta", recorrido en el sentido de las agujas del reloj (en pantalla, con la y
// hacia abajo). "Fuera" es hacia la izquierda del sentido de avance: (u.y, -u.x).
function lado(desde: Punto, hasta: Punto, { tipo, en = 0.5 }: Lado, largoTotal: number, inicioEnLado: number, e: number): string {
  if (tipo === 0) return `L${hasta[0]} ${hasta[1]}`
  const largo = Math.hypot(hasta[0] - desde[0], hasta[1] - desde[1])
  const u: Punto = [(hasta[0] - desde[0]) / largo, (hasta[1] - desde[1]) / largo]
  const fuera: Punto = [u[1], -u[0]]
  const punto = (t: number, h: number): string => `${desde[0] + u[0] * t + fuera[0] * h} ${desde[1] + u[1] * t + fuera[1] * h}`
  // Centro del saliente: en "en" del lado ENTERO (desde la esquina, no desde donde empieza el tramo recto).
  const centro = largoTotal * en - inicioEnLado
  const s = tipo
  const [fondo, radio, cuello, ancho] = [FONDO * e, RADIO * e, CUELLO * e, HOMBRO * e]
  const k = fondo - radio - Math.sqrt(radio * radio - cuello * cuello) // altura a la que el cuello se une a la cabeza
  const barrido = s > 0 ? 1 : 0 // la cabeza gira hacia un lado...
  const hombro = 1 - barrido // ...y los hombros hacia el contrario
  return [
    `L${punto(centro - cuello - ancho, 0)}`,
    `A${ancho} ${ancho} 0 0 ${hombro} ${punto(centro - cuello, s * ancho)}`,
    `L${punto(centro - cuello, s * k)}`,
    `A${radio} ${radio} 0 1 ${barrido} ${punto(centro + cuello, s * k)}`,
    `L${punto(centro + cuello, s * ancho)}`,
    `A${ancho} ${ancho} 0 0 ${hombro} ${punto(centro + cuello + ancho, 0)}`,
    `L${hasta[0]} ${hasta[1]}`,
  ].join(' ')
}

function caminoPieza(ancho: number, alto: number, l: Lados, e: number): string {
  // Radio de cada esquina: redondeada solo si sus dos lados son lisos (esquina de fuera del puzzle).
  const r = (a: Lado, b: Lado) => (a.tipo === 0 && b.tipo === 0 ? ESQUINA : 0)
  const rAI = r(l.arriba, l.izquierda)
  const rAD = r(l.arriba, l.derecha)
  const rBD = r(l.abajo, l.derecha)
  const rBI = r(l.abajo, l.izquierda)
  const esquina = (rad: number, x: number, y: number) => (rad ? `A${rad} ${rad} 0 0 1 ${x} ${y}` : `L${x} ${y}`)
  return [
    `M${rAI} 0`,
    lado([rAI, 0], [ancho - rAD, 0], l.arriba, ancho, rAI, e),
    esquina(rAD, ancho, rAD),
    lado([ancho, rAD], [ancho, alto - rBD], l.derecha, alto, rAD, e),
    esquina(rBD, ancho - rBD, alto),
    lado([ancho - rBD, alto], [rBI, alto], l.abajo, ancho, rBD, e),
    esquina(rBI, 0, alto - rBI),
    lado([0, alto - rBI], [0, rAI], l.izquierda, alto, rBI, e),
    esquina(rAI, rAI, 0),
    'Z',
  ].join(' ')
}

type PiezaPuzzleProps = {
  lados: Lados
  color: string // relleno (un var(--color-…))
  escala?: number // tamaño de salientes y entrantes (1 = FONDO px, el de escritorio)
  className?: string // del contenedor (la pieza ocupa todo su tamaño)
  children: ReactNode
}

export function PiezaPuzzle({ lados, color, escala = 1, className = '', children }: PiezaPuzzleProps) {
  const caja = useRef<HTMLDivElement>(null)
  const [tamano, setTamano] = useState<{ ancho: number; alto: number } | null>(null)

  useLayoutEffect(() => {
    const el = caja.current
    if (!el) return
    const medir = () => setTamano({ ancho: el.offsetWidth, alto: el.offsetHeight })
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  return (
    // isolate: la forma (-z-10) queda detrás del contenido pero dentro de la pieza (no detrás de la página).
    <div ref={caja} className={`relative isolate ${className}`}>
      {/* Sin tamaño todavía (o 0, un instante al recargar en caliente), no se dibuja: el camino saldría con NaN. */}
      {tamano && tamano.ancho > 0 && tamano.alto > 0 && (
        // overflow-visible: los salientes se salen de la caja (entran en la pieza vecina).
        <svg
          aria-hidden="true"
          focusable="false"
          width={tamano.ancho}
          height={tamano.alto}
          className="pieza-forma pointer-events-none absolute inset-0 -z-10 overflow-visible"
        >
          <path d={caminoPieza(tamano.ancho, tamano.alto, lados, escala)} fill={color} stroke="var(--color-crema)" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      )}
      {children}
    </div>
  )
}

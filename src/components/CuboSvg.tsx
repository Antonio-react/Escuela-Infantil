import { useId, type ReactNode } from 'react'

// Cubo de letras de juguete DIBUJADO en SVG (idea de Antonio; referencias: una ilustración de cubos ABC apilados y
// una foto de cubos de madera, 2026-11-16). Es fijo. Cómo se ve:
//   - La cara de delante, casi DE FRENTE (un cuadrado, no un trapecio): es la que se lee.
//   - Detrás asoman el lado DERECHO (más oscuro) y la cara de ARRIBA (más clara), lisos, sin letra: con la letra
//     deformada se veía peor (Antonio).
//   - Cantos gordos y redondeados: el lado y la cara de arriba llevan un contorno grueso del mismo color con
//     puntas redondas, y la cara de delante es un rectángulo con esquinas redondeadas que monta encima.
//   - Luces y sombras con degradados suaves (la luz viene de arriba) y, delante, un cuadrado crema con su borde suave.
//   - giro: un poco torcido, como colocado a mano.
// Medidas en unidades del viewBox de quien lo usa (la pila de cubos). Lo de delante va en un espacio 0-100.

export type Punto = readonly [number, number]

const R = 9 // radio de los cantos
const CREMA = '#fdf4e3' // el cuadrado de delante: crema cálido, como la madera pintada (más que el fondo de la web)

type CuboSvgProps = {
  x: number // esquina de arriba a la izquierda de la cara de delante
  y: number
  lado: number // la cara de delante es un cuadrado de lado × lado
  fondo: Punto // hacia dónde se va el cubo por detrás (a la derecha y arriba): da el lado y la cara de arriba
  giro?: number // grados
  marco: string // color vivo del cubo (un var(--color-…))
  children: ReactNode // lo de la cara de delante, en el espacio 0-100
}

export function CuboSvg({ x, y, lado, fondo, giro = 0, marco, children }: CuboSvgProps) {
  const [dx, dy] = fondo
  // Esquinas de la cara de delante y, sumándoles el fondo, las de atrás (solo hacen falta las de arriba y la derecha).
  const f0: Punto = [x, y]
  const f1: Punto = [x + lado, y]
  const f2: Punto = [x + lado, y + lado]
  const b0: Punto = [x + dx, y + dy]
  const b1: Punto = [x + lado + dx, y + dy]
  const b2: Punto = [x + lado + dx, y + lado + dy]
  const pts = (...p: Punto[]) => p.map((q) => q.join(',')).join(' ')

  // Ids únicos para los degradados de este cubo.
  const id = useId()
  const idLado = `${id}-lado`
  const idArriba = `${id}-arriba`
  const idDelante = `${id}-delante`

  // Sombras y luces SUAVES (Antonio, 2026-11-16: la sombra del lado, más difuminada; las rayas de brillo chocaban
  // con las curvas): todo con degradados, sin rayas.
  //   - Lado: algo más oscuro junto a la cara de delante y se aclara hacia atrás.
  //   - Arriba: clara, más aún junto a la arista de delante (por donde le da la luz).
  //   - Delante: el color vivo, apenas más claro arriba y apenas más oscuro abajo.
  const ladoCerca = `color-mix(in oklab, ${marco} 84%, black)`
  const ladoLejos = `color-mix(in oklab, ${marco} 93%, black)`
  const arribaCerca = `color-mix(in oklab, ${marco} 70%, white)`
  const arribaLejos = `color-mix(in oklab, ${marco} 85%, white)`
  const delanteArriba = `color-mix(in oklab, ${marco} 90%, white)`
  const delanteAbajo = `color-mix(in oklab, ${marco} 94%, black)`
  const borde = `color-mix(in oklab, ${marco} 70%, black)`
  const cx = x + lado / 2 + dx / 2
  const cy = y + lado / 2 + dy / 2

  // El cuadrado crema de delante (en el espacio 0-100): margen del 9 %, esquinas redondeadas.
  return (
    <g transform={giro ? `rotate(${giro} ${cx} ${cy})` : undefined}>
      <defs>
        {/* En coordenadas del dibujo: el lado va de la arista de delante (f1) hacia atrás (b1); arriba, de f0 a b0. */}
        <linearGradient id={idLado} gradientUnits="userSpaceOnUse" x1={f1[0]} y1={f1[1]} x2={b1[0]} y2={b1[1]}>
          <stop offset="0" style={{ stopColor: ladoCerca }} />
          <stop offset="1" style={{ stopColor: ladoLejos }} />
        </linearGradient>
        <linearGradient id={idArriba} gradientUnits="userSpaceOnUse" x1={f0[0]} y1={f0[1]} x2={b0[0]} y2={b0[1]}>
          <stop offset="0" style={{ stopColor: arribaCerca }} />
          <stop offset="1" style={{ stopColor: arribaLejos }} />
        </linearGradient>
        <linearGradient id={idDelante} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: delanteArriba }} />
          <stop offset="0.25" style={{ stopColor: marco }} />
          <stop offset="0.85" style={{ stopColor: marco }} />
          <stop offset="1" style={{ stopColor: delanteAbajo }} />
        </linearGradient>
      </defs>
      {/* Lado derecho y cara de arriba: rellenos y con contorno grueso redondeado (cantos redondos). */}
      <polygon points={pts(f1, b1, b2, f2)} strokeWidth={R * 2} strokeLinejoin="round" fill={`url(#${idLado})`} stroke={`url(#${idLado})`} />
      <polygon points={pts(f0, b0, b1, f1)} strokeWidth={R * 2} strokeLinejoin="round" fill={`url(#${idArriba})`} stroke={`url(#${idArriba})`} />
      {/* Cara de delante: algo más grande que el cuadrado (lo que ocupa el contorno de las otras) y redondeada. */}
      <rect x={x - R} y={y - R} width={lado + R * 2} height={lado + R * 2} rx={R * 1.6} fill={`url(#${idDelante})`} />
      <g transform={`translate(${x} ${y}) scale(${lado / 100})`}>
        <rect x="9" y="9" width="82" height="82" rx="7" strokeWidth="1.6" style={{ fill: CREMA, stroke: borde, strokeOpacity: 0.3 }} />
        {children}
      </g>
    </g>
  )
}

import { useInView } from 'motion/react'
import { useRef } from 'react'
import { site } from '../data/site'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { colorTiza } from './utilidadesTiza'

// Tren de las aulas (La escuela): una locomotora y un vagón por aula, con su edad. Llega UNA sola vez,
// cuando se ve en pantalla: entra por la izquierda con las ruedas girando y echando humo, frena y se queda
// aparcado (no se mueve más: sin bucle, así no necesita botón de pausa). Con movimiento reducido, ya aparcado.
// Decorativo (aria-hidden): las aulas ya están en las tarjetas de arriba.
// Dos estilos para comparar: "normal" (plano, con los colores de las tarjetas) y "tiza" (sobre una pizarra).

// Mismos colores que las tarjetas de las aulas (Aulas.tsx), en el mismo orden que site.aulas.
const coloresVagon = ['var(--color-arbol-naranja)', 'var(--color-arbol-morado)', 'var(--color-arbol-verde)'] as const
const coloresVagonTiza = [
  colorTiza('var(--color-arbol-naranja-intenso)'),
  colorTiza('var(--color-arbol-morado-intenso)'),
  colorTiza('var(--color-arbol-verde-intenso)'),
] as const

// Rueda con radios (así se ve girar). El giro va en la clase .tren-rueda (index.css).
function Rueda({ cx, r, trazo, relleno }: { cx: number; r: number; trazo: string; relleno: string }) {
  return (
    <g className="tren-rueda" style={{ transformOrigin: `${cx}px 100px` }}>
      <circle cx={cx} cy={100} r={r} fill={relleno} stroke={trazo} strokeWidth="3" />
      <path d={`M${cx - r + 3} 100h${2 * r - 6}M${cx} ${100 - r + 3}v${2 * r - 6}`} stroke={trazo} strokeWidth="2" />
    </g>
  )
}

export function Tren({ estilo = 'normal' }: { estilo?: 'normal' | 'tiza' }) {
  const ref = useRef<HTMLDivElement>(null)
  // once: true → solo la primera vez que se ve. amount: 0.5 → cuando ya se ve la mitad.
  const visto = useInView(ref, { once: true, amount: 0.5 })
  const reducido = usePrefersReducedMotion()
  const tiza = estilo === 'tiza'

  // Colores según el estilo: plano (tinta y colores pastel) o tiza (contornos de colores sobre la pizarra).
  const trazo = tiza ? 'var(--color-tiza)' : 'var(--color-tinta)'
  const loco = tiza ? 'none' : 'var(--color-verde)'
  const relleno = (i: number) => (tiza ? 'none' : coloresVagon[i % coloresVagon.length])
  const trazoVagon = (i: number) => (tiza ? coloresVagonTiza[i % coloresVagonTiza.length] : 'var(--color-tinta)')
  const rellenoRueda = tiza ? 'none' : 'var(--color-white)'

  // Estado de la animación: "esperando" (fuera de pantalla), "llegando" (al verse) o quieto (reducido).
  const estado = reducido ? '' : visto ? 'tren-llega' : 'tren-espera'

  return (
    <div
      ref={ref}
      aria-hidden="true"
      // pt-8: deja sitio al humo, que sale por encima de la locomotora (overflow-hidden lo cortaría).
      className={`mt-[clamp(2rem,5svh,3rem)] overflow-hidden pt-8 ${tiza ? 'pizarra rounded-[1.5rem] px-4 pb-2 font-tiza' : 'font-titulo'}`}
    >
      <svg viewBox="0 0 520 120" className={`mx-auto block w-full max-w-2xl overflow-visible ${tiza ? 'tiza' : ''} ${estado}`}>
        {/* Las vías: de lado a lado. */}
        <path d="M-200 113H720" stroke={trazo} strokeOpacity={tiza ? 0.7 : 0.35} strokeWidth="3" strokeLinecap="round" />
        <g className="tren-cuerpo">
          {/* Vagones: uno por aula, de izquierda a derecha (0-1, 1-2, 2-3), con su edad. */}
          {site.aulas.map((aula, i) => {
            const x = 20 + i * 122
            return (
              <g key={aula.nombre}>
                <rect x={x} y={44} width={104} height={50} rx={10} fill={relleno(i)} stroke={trazoVagon(i)} strokeWidth="3" />
                <text x={x + 52} y={78} textAnchor="middle" fontSize="24" fontWeight={tiza ? 400 : 600} fill={tiza ? trazoVagon(i) : 'var(--color-tinta)'}>
                  {aula.edades.split(' ')[0]}
                </text>
                {/* Enganche con el siguiente vagón (o con la locomotora). */}
                <path d={`M${x + 104} 84h18`} stroke={trazo} strokeWidth="3" />
                <Rueda cx={x + 24} r={11} trazo={trazo} relleno={rellenoRueda} />
                <Rueda cx={x + 80} r={11} trazo={trazo} relleno={rellenoRueda} />
              </g>
            )
          })}
          {/* Locomotora (tira de los vagones, mirando a la derecha): caldera, cabina, chimenea y quitapiedras. */}
          <g>
            <rect x={386} y={52} width={96} height={42} rx={10} fill={loco} stroke={trazo} strokeWidth="3" />
            <rect x={386} y={18} width={46} height={40} rx={6} fill={loco} stroke={trazo} strokeWidth="3" />
            <rect x={394} y={26} width={30} height={18} rx={4} fill={tiza ? 'none' : 'var(--color-arbol-azul)'} stroke={trazo} strokeWidth="2.5" />
            <path d="M448 52V30h18v22" fill={loco} stroke={trazo} strokeWidth="3" strokeLinejoin="round" />
            <path d="M482 70l18 24h-18" fill={loco} stroke={trazo} strokeWidth="3" strokeLinejoin="round" />
            <Rueda cx={412} r={13} trazo={trazo} relleno={rellenoRueda} />
            <Rueda cx={460} r={13} trazo={trazo} relleno={rellenoRueda} />
          </g>
          {/* Humo: tres bocanadas que salen de la chimenea mientras llega. */}
          <g className="tren-humo" fill={tiza ? 'none' : 'var(--color-azul-suave)'} stroke={tiza ? 'var(--color-tiza)' : 'none'} strokeWidth="2">
            <circle cx={457} cy={16} r={7} />
            <circle cx={470} cy={6} r={9} />
            <circle cx={486} cy={-4} r={11} />
          </g>
        </g>
      </svg>
    </div>
  )
}

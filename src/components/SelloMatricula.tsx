import { useId } from 'react'
import { textos } from '../data/textos'
import { Osito } from './Juguetes'

const RADIO_TEXTO = 54
// Longitud de la circunferencia por la que va el texto: así el texto la rodea entera, sin huecos.
const LONGITUD_TEXTO = 2 * Math.PI * RADIO_TEXTO - 4

// Sello redondo tipo pegatina con "Matrícula abierta todo el año" alrededor del osito.
// El lector de pantalla lee el texto oculto (sr-only); el dibujo es decorativo (aria-hidden).
export function SelloMatricula({ className = '' }: { className?: string }) {
  const idCirculo = useId() // id único para el <path> por el que corre el texto
  const { estado, cuando } = textos.hero.matricula

  return (
    <p className={className}>
      <span className="sr-only">{textos.hero.badge}</span>
      <svg
        viewBox="0 0 160 160"
        aria-hidden="true"
        focusable="false"
        className="size-full -rotate-12 transition-transform duration-500 ease-salida hover:rotate-0"
      >
        <circle cx="80" cy="80" r="78" fill="var(--color-coral-suave)" />
        <circle cx="80" cy="80" r="71" fill="none" stroke="var(--color-coral)" strokeWidth="1.5" strokeDasharray="3 5" />
        <defs>
          {/* Círculo de radio 54 dibujado con dos arcos: es el camino que sigue el texto. */}
          <path id={idCirculo} d={`M80 80m-${RADIO_TEXTO} 0a${RADIO_TEXTO} ${RADIO_TEXTO} 0 1 1 ${RADIO_TEXTO * 2} 0a${RADIO_TEXTO} ${RADIO_TEXTO} 0 1 1 -${RADIO_TEXTO * 2} 0`} />
        </defs>
        <text fontFamily="var(--font-titulo)" fontWeight="600" fontSize="14">
          <textPath href={`#${idCirculo}`} textLength={LONGITUD_TEXTO} lengthAdjust="spacing">
            {/* Dos colores para que se lean como dos ideas: qué (ciruela) y cuándo (verde). */}
            <tspan fill="var(--color-ciruela)">{estado.toUpperCase()} · </tspan>
            <tspan fill="var(--color-verde)">{cuando.toUpperCase()} · </tspan>
          </textPath>
        </text>
        <circle cx="80" cy="80" r="35" fill="var(--color-white)" />
        <Osito x="54" y="52" width="52" height="52" />
      </svg>
    </p>
  )
}

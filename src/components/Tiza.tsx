import { Fragment, useId, type CSSProperties, type ReactNode, type SVGProps } from 'react'
import type { Pagina } from '../data/paginas'
import { CONTORNO_NUBE } from './formas'
import { conTiempo } from './utilidadesTiza'

// Piezas "dibujadas a tiza" para la pizarra (menú de móvil y, más adelante, la 404).
//
// Cómo se dibujan (clases de src/index.css):
//   .tiza          filtro SVG #filtro-tiza: bordes irregulares y huecos, como la tiza de verdad.
//   .tiza-traza    el trazo se dibuja de principio a fin (stroke-dashoffset). Los <path> llevan pathLength={1}:
//                  así el recorrido mide siempre 1, sea cual sea la forma, y la animación sirve para todos.
//   .tiza-aparece  puntos (ojos, picos...): aparecen con un fundido.
// Cada pieza recibe cuándo empieza y cuánto dura con las variables --retraso y --duracion.
// Todas son decorativas (aria-hidden); el texto que acompañan es lo que se anuncia.

// CSSProperties no admite variables CSS propias (--retraso...): este tipo lo amplía sin recurrir a "any".
export type EstiloConVariables = CSSProperties & Record<`--${string}`, string>

// Filtro de tiza compartido. Se pinta una sola vez en toda la web (Layout.tsx); las piezas lo usan por su id.
export function FiltrosTiza() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {/* 1) Ondula un poco los bordes (feDisplacementMap). 2) Abre huecos con un ruido fino: donde el ruido
            es claro, la tiza "no ha pintado" (feColorMatrix convierte el ruido en transparencia).
            Probado y descartado (2026-11-17): el ruido ya hecho en una imagen (feImage + feTile). En Safari del
            iPhone, el texto con ese filtro desaparecía (solo se veían los dibujos SVG). */}
        <filter id="filtro-tiza" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="2" result="ondulado" />
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="7" result="grano" />
          <feColorMatrix in="grano" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.9" result="huecos" />
          <feComposite in="ondulado" in2="huecos" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}

type TrazoProps = SVGProps<SVGPathElement>

// Un trazo de tiza que se dibuja solo.
function Trazo(props: TrazoProps) {
  return <path pathLength={1} className="tiza-traza" {...props} />
}

type DibujoProps = {
  children: ReactNode
  viewBox: string
  className?: string
  style?: EstiloConVariables
  grosor?: number
  preserveAspectRatio?: string
}

// Lienzo común: trazo redondeado del color del texto (currentColor) y filtro de tiza.
function Dibujo({ children, viewBox, className = '', style, grosor = 1.6, preserveAspectRatio }: DibujoProps) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`tiza overflow-visible ${className}`}
      style={style}
    >
      {children}
    </svg>
  )
}

// --- Juguetes del menú, a tiza (mismas formas que los de Juguetes.tsx, en contorno) ---

const circulo = (cx: number, cy: number, r: number, ry = r) =>
  `M${cx - r} ${cy}a${r} ${ry} 0 1 0 ${2 * r} 0a${r} ${ry} 0 1 0 ${-2 * r} 0`

// Un dibujo por cada juguete de paginas.ts: si se añade uno allí, TypeScript avisa de que falta aquí.
const dibujosJuguetes: Record<NonNullable<Pagina['juguete']>, ReactNode> = {
  osito: (
    <>
      {/* Orejas: solo el trozo de círculo que queda fuera de la cabeza. */}
      <Trazo d="M6.3 12.8A4.5 4.5 0 1 1 11.9 7.8" />
      <Trazo d="M20.1 7.8A4.5 4.5 0 1 1 25.7 12.8" />
      {/* Interior de las orejas: un arquito en cada una. */}
      <Trazo d="M8.2 11.6a2.3 2.3 0 0 1 2.4-2.6M23.8 11.6a2.3 2.3 0 0 0-2.4-2.6" strokeWidth={1.1} />
      <Trazo d={circulo(16, 18, 11)} />
      {/* Hocico ancho y de trazo fino (si es pequeño y con la nariz ovalada dentro, parece un morro de cerdo). */}
      <Trazo d={circulo(16, 22.2, 5.6, 4.2)} strokeWidth={1.1} />
      {/* Boca de oso en forma de "ω", bajo la nariz. */}
      <Trazo d="M16 22.9v1.1M13.7 24.2c.8 1 2.3 1 2.3-.2 0 1.2 1.5 1.2 2.3.2" strokeWidth={1.1} />
      {/* Ojos y nariz en tiza blanca (del color del juguete no se distinguirían). La nariz, un triángulo
          redondeado hacia abajo, como la de un oso. */}
      <g fill="var(--color-tiza)" stroke="none" className="tiza-aparece">
        <circle cx="12" cy="15.6" r="1.2" />
        <circle cx="20" cy="15.6" r="1.2" />
        <path d="M13.9 19.4h4.2c.7 0 1 .7.6 1.2l-1.9 2c-.4.4-1 .4-1.4 0l-1.9-2c-.4-.5-.1-1.2.6-1.2z" />
      </g>
    </>
  ),
  bloque: (
    <>
      <Trazo d="M8.5 3.5h15a5 5 0 0 1 5 5v15a5 5 0 0 1-5 5h-15a5 5 0 0 1-5-5v-15a5 5 0 0 1 5-5z" />
      <Trazo d="M10.5 7.5h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3z" strokeWidth={1.2} />
      <Trazo d="M12.6 22l3.4-11 3.4 11M13.7 18.4h4.6" strokeWidth={1.8} />
    </>
  ),
  reloj: (
    <>
      <Trazo d="M4.2 9.6a4.6 4.6 0 0 1 6.6-6.2" />
      <Trazo d="M27.8 9.6a4.6 4.6 0 0 0-6.6-6.2" />
      <Trazo d="M9.5 26.5l-2 2.5M22.5 26.5l2 2.5" strokeWidth={2} />
      <Trazo d={circulo(16, 17, 11.5)} />
      <Trazo d="M16 17v-5M16 17h4" strokeWidth={1.8} />
    </>
  ),
  // Familia de patos (Familias), mirando de frente: mamá pata en el centro y un patito a cada lado.
  // Lo que los hace "patos" y no muñecos de nieve: el copete, el pico ancho y las patas (en tiza naranja,
  // --tiza-pico, que pone el menú) y las alas marcadas en el cuerpo. Ojos en tiza blanca.
  patito: (
    <>
      {/* Mamá: cabeza con copete, cuerpo de pera y alas. */}
      <Trazo d={circulo(16, 8.4, 4.6)} />
      <Trazo d="M15.4 3.9c-.5-1.5.4-2.8 1.9-2.7" strokeWidth={1.3} />
      <Trazo d="M16 13.4c-4.3 0-7 3.7-7 7.8 0 3.9 3.1 6.6 7 6.6s7-2.7 7-6.6c0-4.1-2.7-7.8-7-7.8z" />
      <Trazo d="M11.8 18.6c-1.3 1.8-1.2 4 .3 5.6M20.2 18.6c1.3 1.8 1.2 4-.3 5.6" strokeWidth={1.2} />
      {/* Patitos, con su copete. */}
      <Trazo d={circulo(4.6, 20.6, 2.4)} strokeWidth={1.3} />
      <Trazo d="M4.3 18.2c-.2-.9.4-1.6 1.2-1.5" strokeWidth={1} />
      <Trazo d={circulo(4.6, 26.2, 3.1, 2.8)} strokeWidth={1.3} />
      <Trazo d={circulo(27.4, 20.6, 2.4)} strokeWidth={1.3} />
      <Trazo d="M27.1 18.2c-.2-.9.4-1.6 1.2-1.5" strokeWidth={1} />
      <Trazo d={circulo(27.4, 26.2, 3.1, 2.8)} strokeWidth={1.3} />
      <g fill="var(--color-tiza)" stroke="none" className="tiza-aparece">
        <circle cx="14.3" cy="7.4" r="0.95" />
        <circle cx="17.7" cy="7.4" r="0.95" />
        <circle cx="3.7" cy="20" r="0.55" />
        <circle cx="5.5" cy="20" r="0.55" />
        <circle cx="26.5" cy="20" r="0.55" />
        <circle cx="28.3" cy="20" r="0.55" />
      </g>
      {/* Picos de frente (óvalo ancho bajo los ojos) y patas. */}
      <g fill="var(--tiza-pico, currentColor)" stroke="none" className="tiza-aparece">
        <ellipse cx="16" cy="10.4" rx="3.1" ry="1.35" />
        <ellipse cx="4.6" cy="21.5" rx="1.5" ry="0.75" />
        <ellipse cx="27.4" cy="21.5" rx="1.5" ry="0.75" />
      </g>
      <path
        d="M12.8 28.6h2.6M16.6 28.6h2.6M2.8 29.4h1.4M5 29.4h1.4M25.6 29.4h1.4M27.8 29.4h1.4"
        stroke="var(--tiza-pico, currentColor)"
        strokeWidth={1.3}
        className="tiza-aparece"
      />
    </>
  ),
  telefono: (
    <>
      <Trazo d="M4.5 9.2C4.5 7 7.5 5 16 5s11.5 2 11.5 4.2v1.5c0 1-1 1.6-2 1.3l-3-1c-.8-.3-1.2-1-1.2-1.8v-.8C19.8 8 18 7.9 16 7.9s-3.8.1-5.3.5v.8c0 .8-.4 1.5-1.2 1.8l-3 1c-1 .3-2-.3-2-1.3z" />
      <Trazo d="M8.5 13.5h15l3.3 11.2c.4 1.4-.6 2.8-2 2.8H7.2c-1.4 0-2.4-1.4-2-2.8z" />
      <Trazo d={circulo(16, 20.5, 4.4)} strokeWidth={1.3} />
      <circle cx="16" cy="20.5" r="1.2" fill="currentColor" stroke="none" className="tiza-aparece" />
    </>
  ),
}

export function JugueteTiza({ tipo, className, style }: { tipo: NonNullable<Pagina['juguete']>; className?: string; style?: EstiloConVariables }) {
  return (
    <Dibujo viewBox="0 0 32 32" className={className} style={style}>
      {dibujosJuguetes[tipo]}
    </Dibujo>
  )
}

// --- Trazos sueltos ---

// Subrayado del título: un trazo grueso que sigue fino hasta el final, como cuando la tiza se levanta.
// estirar: el subrayado ocupa todo el ancho que se le dé (preserveAspectRatio="none"), por ejemplo el de un título
// entero. Como el trazo es casi horizontal, al estirarlo a lo ancho no cambia su grosor.
export function SubrayadoTiza({ className, style, estirar = false }: { className?: string; style?: EstiloConVariables; estirar?: boolean }) {
  return (
    <Dibujo viewBox="0 0 260 14" className={className} style={style} grosor={3.2} preserveAspectRatio={estirar ? 'none' : undefined}>
      <Trazo d="M3 10C60 4 130 3 196 4.4" />
      <Trazo d="M192 4.4C216 4.6 238 5.6 257 8" strokeWidth={1.6} />
    </Dibujo>
  )
}

// La X de cerrar, en dos trazos.
export function CruzTiza({ className, style }: { className?: string; style?: EstiloConVariables }) {
  return (
    <Dibujo viewBox="0 0 24 24" className={className} style={style} grosor={2.2}>
      <Trazo d="M5 5.5l14 13" />
      <Trazo d="M19 5l-13.5 14" />
    </Dibujo>
  )
}

// Las dos nubes de abajo imitan una nube pintada a mano de verdad (referencia de Antonio):
//  - forma irregular, con bultos de distinto tamaño (no simétrica);
//  - el contorno repasado dos veces: el segundo trazo, más fino y algo desplazado, se dibuja después;
//  - polvo de tiza alrededor del trazo: el mismo trazo, muy ancho y casi transparente, por debajo.
// Retraso del repaso: empieza cuando el trazo principal va por el 60 %.
const RETRASO_REPASO: CSSProperties = { animationDelay: 'calc((var(--retraso, 0ms) + var(--duracion, 300ms) * 0.6) * var(--escala-tiza, 1))' }

// Nube "Solicitar visita": con bultos también por debajo (no la base plana del botón de escritorio). Además, sombreado de tiza azul frotada abajo por dentro, que se difumina
// hacia arriba (degradado), y un poco de polvo blanco en el centro.
// (CONTORNO_NUBE vive en formas.ts: lo comparte con la nube rellena de Decoracion.tsx.)
export function NubeTiza({ className, style }: { className?: string; style?: EstiloConVariables }) {
  // useId: cada nube su propio degradado (si hubiera dos en pantalla, los id no chocarían).
  const idSombra = useId()
  const idPolvo = useId()
  return (
    <Dibujo viewBox="0 0 240 110" className={className} style={style} grosor={3.4}>
      <defs>
        <linearGradient id={idSombra} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.5" />
        </linearGradient>
        {/* Polvo blanco: se difumina hacia fuera, sin borde (un óvalo liso parecería una pegatina). */}
        <radialGradient id={idPolvo}>
          <stop offset="0" stopColor="var(--color-tiza)" stopOpacity="0.1" />
          <stop offset="1" stopColor="var(--color-tiza)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="tiza-aparece" stroke="none">
        <path d={CONTORNO_NUBE} fill={`url(#${idSombra})`} />
        <ellipse cx="128" cy="56" rx="80" ry="30" fill={`url(#${idPolvo})`} />
      </g>
      {/* Frotado de la tiza de lado, a lo largo de la base. */}
      <path d="M44 86C92 94 164 94 208 84" strokeWidth={9} opacity="0.22" className="tiza-aparece" />
      <path d={CONTORNO_NUBE} strokeWidth={12} opacity="0.07" className="tiza-aparece" />
      <Trazo d={CONTORNO_NUBE} />
      <Trazo d={CONTORNO_NUBE} transform="translate(2.4 -2.6)" strokeWidth={1.6} opacity="0.7" style={RETRASO_REPASO} />
    </Dibujo>
  )
}

// Suelo de nubes (blanco): bultos grandes de distinto tamaño y una bajada más honda, como en la referencia.
const PERFIL_SUELO =
  'M-6 72C8 40 72 34 90 62C98 26 176 16 200 56C204 66 208 74 214 78C222 46 286 40 302 62C314 34 386 32 406 66'
export function SueloTiza({ className, style }: { className?: string; style?: EstiloConVariables }) {
  return (
    <Dibujo viewBox="0 0 400 120" preserveAspectRatio="none" className={className} style={style} grosor={3}>
      <path d={PERFIL_SUELO} strokeWidth={16} opacity="0.05" className="tiza-aparece" />
      <path d={PERFIL_SUELO} strokeWidth={7} opacity="0.08" className="tiza-aparece" />
      <Trazo d={PERFIL_SUELO} />
      <Trazo d={PERFIL_SUELO} transform="translate(2.5 4)" strokeWidth={1.5} opacity="0.6" style={RETRASO_REPASO} />
    </Dibujo>
  )
}

// Decoración de la esquina (en vez de las rayas y estrellas de la referencia): pájaros y una nubecita.
export function PajaroTiza({ className, style }: { className?: string; style?: EstiloConVariables }) {
  return (
    <Dibujo viewBox="0 0 40 20" className={className} style={style} grosor={2.4}>
      <Trazo d="M3 9c5-5 11-5 17 3 6-8 12-8 17-3" />
    </Dibujo>
  )
}
export function NubecitaTiza({ className, style }: { className?: string; style?: EstiloConVariables }) {
  return (
    // Misma forma que las demás nubes (CONTORNO_NUBE, con bultos también por debajo; Antonio, 2026-11-16: aún tenía
    // la antigua de base plana). Grosor 10: es pequeña (unos 50 px en móvil) y la forma tiene más bultos que la de
    // antes; con trazo fino se perdía. El margen del viewBox deja sitio a la mitad del trazo.
    <Dibujo viewBox="2 -6 240 120" className={className} style={style} grosor={10}>
      <Trazo d={CONTORNO_NUBE} />
    </Dibujo>
  )
}

// Texto escrito a tiza palabra a palabra, en orden de lectura. Sirve para textos que pueden ocupar varias
// líneas (en el móvil se parten): descubrir el bloque entero de izquierda a derecha escribiría todas las líneas
// a la vez; palabra a palabra, siempre va de arriba abajo y de izquierda a derecha.
// Cada palabra tarda según sus letras (msPorLetra), y el espacio cuenta como una letra más.
// Los espacios son texto normal: así las líneas se parten donde toca y un lector de pantalla lo lee seguido.
type TextoTizaProps = { texto: string; retraso: number; msPorLetra: number }
export function TextoTiza({ texto, retraso, msPorLetra }: TextoTizaProps) {
  const palabras = texto.split(' ')
  let cursor = retraso
  return palabras.map((palabra, i) => {
    const tiempo = { retraso: cursor, duracion: palabra.length * msPorLetra }
    cursor += (palabra.length + 1) * msPorLetra
    return (
      <Fragment key={i}>
        <span className="tiza tiza-escribe inline-block" style={conTiempo(tiempo)}>
          {palabra}
        </span>
        {i < palabras.length - 1 && ' '}
      </Fragment>
    )
  })
}

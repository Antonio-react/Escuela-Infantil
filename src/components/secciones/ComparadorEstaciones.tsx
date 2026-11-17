import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { textos } from '../../data/textos'
import { Pelota } from '../Juguetes'

// Comparador invierno / verano (Instalaciones; idea de Antonio a partir de un "antes y después" que le gustaba,
// sin copiarlo): la ventana de un aula, dibujada. Fuera, en invierno nieva y en verano hace sol; DENTRO, en el
// alféizar, todo igual (el bebé, sentado tan a gusto jugando con su cubo): eso es lo que
// se quiere contar.
//
// Tres capas de dibujo, una encima de otra:
//   1. el exterior en invierno (entero);
//   2. el exterior en verano, recortado (clip-path) desde la línea hacia la derecha;
//   3. el interior (marco, alféizar y bebé), que no se recorta nunca.
// Encima, fijo arriba en el centro, el termómetro, que cambia de color y nivel según la línea (Termometro).
// La línea se arrastra con el ratón o el dedo (pointer events; touch-pan-y: en móvil se sigue pudiendo hacer
// scroll en vertical). Para el teclado y el lector de pantalla hay un <input type="range"> invisible: se mueve con
// las flechas y, cuando tiene el foco, el tirador enseña el anillo de foco (peer-focus-visible).
// El recorte sigue a la mano: no es una animación, así que no le afecta el movimiento reducido.

const t = textos.secciones.instalaciones
// El dibujo acaba justo bajo el alféizar (y = 250): sin una franja de pared vacía abajo. Proporción 8:5.
const VISTA = '0 0 400 250'

// Copos de nieve y flores: posiciones fijas (siempre igual, sin azar).
const copos = [
  [30, 30], [80, 70], [140, 25], [190, 90], [250, 40], [300, 100], [360, 30], [50, 130], [120, 150], [230, 140],
  [340, 150], [380, 90], [170, 55], [280, 75], [20, 95], [210, 20],
] as const
const flores = [
  [40, 210, 'var(--color-arbol-rojo-intenso)'], [130, 200, 'var(--color-arbol-naranja-intenso)'], [250, 205, 'var(--color-white)'],
  [330, 196, 'var(--color-arbol-morado-intenso)'], [375, 210, 'var(--color-arbol-rojo-intenso)'],
] as const

function Invierno() {
  return (
    <>
      <rect width="400" height="300" fill="var(--color-azul-suave)" />
      {/* Nubes grises de nieve */}
      <g fill="var(--color-azul)" opacity="0.3">
        <ellipse cx="90" cy="45" rx="70" ry="18" />
        <ellipse cx="300" cy="35" rx="90" ry="20" />
      </g>
      {/* Colinas nevadas */}
      <path d="M0 175c70-35 150-30 220 0s130 15 180-5v130H0z" fill="#eef3f6" />
      <path d="M0 200c90-30 180-15 260 5s110 0 140-10v105H0z" fill="var(--color-white)" />
      {/* Árbol sin hojas */}
      <path d="M90 205v-60M90 165l-18-16M90 155l20-20M90 180l16-10" stroke="var(--color-madera-oscura)" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Muñeco de nieve */}
      <g stroke="var(--color-azul)" strokeWidth="1.5">
        <circle cx="300" cy="186" r="20" fill="var(--color-white)" />
        <circle cx="300" cy="155" r="14" fill="var(--color-white)" />
      </g>
      <rect x="290" y="132" width="20" height="10" fill="var(--color-tinta)" />
      <rect x="285" y="140" width="30" height="4" rx="2" fill="var(--color-tinta)" />
      <path d="M300 156l14 3-14 2z" fill="var(--color-arbol-naranja-intenso)" />
      <circle cx="295" cy="151" r="1.6" fill="var(--color-tinta)" />
      <circle cx="305" cy="151" r="1.6" fill="var(--color-tinta)" />
      {/* Copos */}
      <g fill="var(--color-white)">
        {copos.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={x % 3 === 0 ? 3.2 : 2.3} />
        ))}
      </g>
    </>
  )
}

function Verano() {
  return (
    <>
      <rect width="400" height="300" fill="var(--color-arbol-azul)" />
      {/* Sol */}
      <circle cx="320" cy="60" r="28" fill="var(--color-arbol-naranja-intenso)" />
      <g stroke="var(--color-arbol-naranja-intenso)" strokeWidth="4" strokeLinecap="round">
        <path d="M320 18v-10M320 112v-8M278 60h-10M372 60h-10M290 30l-7-7M350 90l7 7M290 90l-7 7M350 30l7-7" />
      </g>
      {/* Nubes blancas */}
      <g fill="var(--color-white)">
        <ellipse cx="90" cy="50" rx="40" ry="14" />
        <ellipse cx="115" cy="40" rx="24" ry="14" />
      </g>
      {/* Colinas verdes con flores */}
      <path d="M0 175c70-35 150-30 220 0s130 15 180-5v130H0z" fill="var(--color-verde)" opacity="0.75" />
      <path d="M0 200c90-30 180-15 260 5s110 0 140-10v105H0z" fill="var(--color-arbol-verde-intenso)" />
      {flores.map(([x, y, color]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={color} />
      ))}
      {/* El mismo árbol, ahora con hojas */}
      <path d="M90 205v-60" stroke="var(--color-madera-oscura)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="90" cy="140" r="30" fill="var(--color-verde)" />
      <circle cx="74" cy="152" r="18" fill="var(--color-arbol-verde-intenso)" />
      {/* Donde estaba el muñeco de nieve, una pelota en la hierba */}
      <Pelota x="282" y="170" width="36" height="36" />
    </>
  )
}

// Bebé sentado jugando con un cubo (Antonio eligió esta versión el 2026-11-16, entre gateando y sentado; antes
// gateaba). Dibujo propio a partir de su referencia: trazo fino y limpio, cabeza grande de tres cuartos mirando a la
// derecha, rizo, mofletes, sonrisa pequeña, camiseta rosa y pañal verde menta. Dibujado en un recuadro con el suelo
// en y = 70 y colocado con translate y scale sobre el alféizar (y = 222).
const contorno = { stroke: 'var(--trazo-bebe, var(--color-tinta))', strokeWidth: 1.3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
const piel = 'var(--color-piel)'
const camiseta = 'var(--color-arbol-rojo)'
const panal = 'color-mix(in oklab, var(--color-arbol-verde-intenso) 30%, var(--color-white))'

// Un brazo o una pierna "con contorno": un trazo oscuro algo más ancho y, encima, el del color.
function Miembro({ d, color, grosor }: { d: string; color: string; grosor: number }) {
  return (
    <>
      <path d={d} stroke="var(--trazo-bebe, var(--color-tinta))" strokeWidth={grosor + 2.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  )
}

// Sentado: el pañal en el suelo, las piernas estiradas hacia delante (los pies de punta hacia
// arriba), la espalda un poco curvada y las dos manos en el cubo; mira el cubo.
function Bebe({ x }: { x: number }) {
  return (
    // Antonio (2026-11-16): más pequeño (casi tan grande como el árbol) y con la silueta menos marcada (parecía más
    // falso): al 75 % (el trazo también adelgaza) y contorno marrón cálido en vez de casi negro. Suelo: 70 × 0,75 =
    // 52,5 → 222 − 52,5 = 169,5.
    <g
      transform={`translate(${x + 14} 169.5) scale(0.75)`}
      style={{ '--trazo-bebe': 'color-mix(in oklab, var(--color-tinta) 45%, var(--color-piel))' } as CSSProperties}
    >
      {/* Pierna del otro lado (detrás) */}
      <Miembro d="M40 60c8-4 16-4 24-1" color={piel} grosor={8} />
      <ellipse cx="67" cy="55.5" rx="3.4" ry="5" fill={piel} {...contorno} transform="rotate(12 67 55.5)" />
      {/* Brazo del otro lado, hacia el cubo */}
      <Miembro d="M40 37c8 2 16 5 22 9" color={camiseta} grosor={6.5} />
      {/* Su mano, sujetando el cubo por el lado de detrás (el cubo la tapa a medias) */}
      <circle cx="64.5" cy="47" r="3" fill={piel} {...contorno} />
      {/* Pañal y cuerpo */}
      <ellipse cx="30" cy="60" rx="15" ry="10" fill={panal} {...contorno} />
      <path d="M21 58c-4-9-2-20 7-24 7-3 14 0 16 7 2 6 1 13-1 17-7 2-15 2-22 0z" fill={camiseta} {...contorno} />
      {/* Pierna de delante */}
      <Miembro d="M34 64c10-3 20-3 30 0" color={piel} grosor={9} />
      <ellipse cx="67.5" cy="60" rx="3.6" ry="5.4" fill={piel} {...contorno} transform="rotate(10 67.5 60)" />
      {/* El cubo de letras (como los de las aulas; Antonio no sabía qué tenía en la mano): cara de delante con la
          "A" en su cuadrado crema, la de arriba más clara y el lado más oscuro, para que se lea como cubo. */}
      <path d="M46 40l4-4h15l-4 4z" fill="color-mix(in oklab, var(--color-arbol-azul-intenso) 70%, white)" {...contorno} />
      <path d="M61 40l4-4v15l-4 4z" fill="color-mix(in oklab, var(--color-arbol-azul-intenso) 80%, black)" {...contorno} />
      <rect x="46" y="40" width="15" height="15" rx="1.5" fill="var(--color-arbol-azul-intenso)" {...contorno} />
      <rect x="48.3" y="42.3" width="10.4" height="10.4" rx="1.2" fill="var(--color-crema)" />
      <text x="53.5" y="51.2" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="var(--font-titulo)" fill="var(--color-arbol-azul-intenso)">
        A
      </text>
      {/* Brazo de delante, con la mano en el lado del cubo */}
      <Miembro d="M31 40c4 7 8 10 13 10" color={camiseta} grosor={7} />
      <circle cx="46" cy="49.5" r="3.3" fill={piel} {...contorno} />
      {/* Cabeza un poco inclinada, mirando el cubo */}
      <Cabeza cx={36} cy={19} mirandoAbajo />
    </g>
  )
}

// Cabeza de tres cuartos mirando a la derecha: oreja, rizo, ojos, mofletes y sonrisa.
function Cabeza({ cx, cy, mirandoAbajo = false }: { cx: number; cy: number; mirandoAbajo?: boolean }) {
  const ojo = mirandoAbajo ? 1.5 : 0
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle cx="-15.5" cy="3" r="3.6" fill={piel} {...contorno} />
      <circle cx="0" cy="0" r="16.5" fill={piel} {...contorno} />
      <path d="M-2-15.5c-1.6-2.8.6-5.2 3.2-4.2M2.2-15.8c.6-2.4 3.2-3 4.6-1.2" stroke="var(--color-tinta)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="0.5" cy={0.5 + ojo} r="1.5" fill="var(--color-tinta)" />
      <circle cx="9" cy={0.5 + ojo} r="1.5" fill="var(--color-tinta)" />
      <ellipse cx="-3.6" cy={6 + ojo} rx="2.8" ry="1.9" fill="var(--color-arbol-rojo)" />
      <ellipse cx="12.4" cy={6 + ojo} rx="2.2" ry="1.7" fill="var(--color-arbol-rojo)" />
      <path d={`M2.4 ${7 + ojo}c1.6 1.6 4 1.6 5.4 0`} stroke="var(--color-tinta)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </g>
  )
}

// El interior: el marco blanco de la ventana, el alféizar de madera y el bebé encima.
function Interior() {
  return (
    <>
      <rect x="0" y="0" width="400" height="230" fill="none" stroke="var(--color-white)" strokeWidth="18" />
      <path d="M0 115h400" stroke="var(--color-white)" strokeWidth="8" />
      {/* El alféizar de madera llega hasta abajo del todo: las etiquetas se apoyan en él (antes una franja de pared
          crema dejaba la etiqueta a medias y el borde de la pantalla la cortaba). */}
      <rect x="-10" y="222" width="420" height="30" fill="var(--color-madera)" />
      <Bebe x={104} />
    </>
  )
}

// Termómetro sonriente, fijo arriba en el centro (idea de Antonio). invierno: cuánto se ve del invierno (0-100, la
// posición de la línea). Lo sigue poco a poco, en tres colores: hacia el invierno, la calefacción (rojo y más alto);
// en el centro, verde claro, natural (a gusto); hacia el verano, el aire fresco (azul y más bajo). Cada mitad mezcla
// dos colores (color-mix) y el nivel sube o baja con la línea. La cara sonríe siempre: dentro, a gusto.
function Termometro({ invierno }: { invierno: number }) {
  const color =
    invierno >= 50
      ? `color-mix(in oklab, var(--color-arbol-rojo-intenso) ${(invierno - 50) * 2}%, var(--color-arbol-verde-intenso))`
      : `color-mix(in oklab, var(--color-arbol-verde-intenso) ${invierno * 2}%, var(--color-arbol-azul-intenso))`
  const nivel = 10 + 28 * (invierno / 100) // alto del líquido por encima de la bola, en unidades del dibujo
  return (
    <svg viewBox="0 0 30 70" aria-hidden="true" focusable="false" className="w-full">
      <rect x="8" y="2" width="14" height="52" rx="7" fill="var(--color-white)" stroke="var(--color-tinta)" strokeWidth="2" />
      <rect x="11.5" y={48 - nivel} width="7" height={nivel + 8} rx="3.5" fill={color} />
      <circle cx="15" cy="57" r="11" fill={color} stroke="var(--color-tinta)" strokeWidth="2" />
      <circle cx="11.4" cy="54.6" r="1.3" fill="var(--color-white)" />
      <circle cx="18.6" cy="54.6" r="1.3" fill="var(--color-white)" />
      <path d="M10.8 59.2c2.3 2.2 6.1 2.2 8.4 0" stroke="var(--color-white)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// linea: dónde está la línea, en % desde la izquierda (a su izquierda se ve el invierno y a su derecha, el verano;
// así la flecha derecha del teclado la mueve a la derecha, como se espera). La guarda quien lo usa (el termostato de
// Instalaciones), porque sus botones también la mueven: "estado levantado". Este componente solo la pinta y avisa
// de los cambios (alCambiar).
export function ComparadorEstaciones({ linea, alCambiar, className = '' }: { linea: number; alCambiar: (linea: number) => void; className?: string }) {
  const marco = useRef<HTMLDivElement>(null)

  // De la posición del ratón o el dedo, al % de la línea (0 = a la izquierda del todo, 100 = a la derecha).
  function moverA(evento: PointerEvent<HTMLDivElement>) {
    const caja = marco.current?.getBoundingClientRect()
    if (!caja) return
    const porcentaje = ((evento.clientX - caja.left) / caja.width) * 100
    alCambiar(Math.min(100, Math.max(0, Math.round(porcentaje))))
  }

  return (
    <div
      ref={marco}
      onPointerDown={(evento) => {
        evento.currentTarget.setPointerCapture(evento.pointerId)
        moverA(evento)
      }}
      onPointerMove={(evento) => {
        if (evento.currentTarget.hasPointerCapture(evento.pointerId)) moverA(evento)
      }}
      className={`relative aspect-8/5 cursor-ew-resize touch-pan-y overflow-hidden bg-white select-none ${className}`}
    >
      <svg viewBox={VISTA} aria-hidden="true" className="absolute inset-0 size-full">
        <Invierno />
      </svg>
      <svg viewBox={VISTA} aria-hidden="true" className="absolute inset-0 size-full" style={{ clipPath: `inset(0 0 0 ${linea}%)` }}>
        <Verano />
      </svg>
      <svg viewBox={VISTA} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        <Interior />
      </svg>

      {/* Etiquetas de cada lado, abajo, apoyadas en el alféizar (arriba va el termómetro y las tapaba). */}
      <span aria-hidden="true" className="absolute bottom-[1.5%] left-3 rounded-full bg-white/90 px-3 py-1 font-titulo text-sm font-semibold text-arbol-azul-texto">
        {t.invierno.cuando}
      </span>
      <span aria-hidden="true" className="absolute right-3 bottom-[1.5%] rounded-full bg-white/90 px-3 py-1 font-titulo text-sm font-semibold text-arbol-naranja-texto">
        {t.verano.cuando}
      </span>

      {/* El termómetro, fijo arriba en el centro (la línea pasa por debajo). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[4%] left-1/2 z-10 w-6 -translate-x-1/2 sm:top-[7%] sm:w-11"
      >
        <Termometro invierno={linea} />
      </div>

      {/* Para el teclado y el lector de pantalla (invisible). Va antes del tirador: "peer" solo mira hacia delante. */}
      <input
        type="range"
        min={0}
        max={100}
        value={linea}
        onChange={(evento) => alCambiar(Number(evento.target.value))}
        aria-label={t.comparadorAria}
        aria-valuetext={t.comparadorValor(100 - linea)}
        className="peer sr-only"
      />
      {/* La línea y el tirador redondo con las flechas. Con el foco del teclado en el input, el tirador (su hijo: *:)
          enseña el anillo de foco: peer solo alcanza a los hermanos del input, no a sus hijos. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white peer-focus-visible:*:outline-3 peer-focus-visible:*:outline-offset-2 peer-focus-visible:*:outline-ciruela peer-focus-visible:*:outline-solid" style={{ left: `${linea}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-tinta shadow-[0_0.4rem_1rem_rgb(43_40_48/0.25)]">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  )
}

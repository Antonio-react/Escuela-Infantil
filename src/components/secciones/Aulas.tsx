import { useInView } from 'motion/react'
import { useRef, type CSSProperties, type ReactNode } from 'react'
import { site } from '../../data/site'
import { textos } from '../../data/textos'
import { CuboSvg } from '../CuboSvg'
import { Colegio, Jirafa, Vaca } from '../Juguetes'
import { Seccion } from '../Seccion'
import { Tren } from '../Tren'

// Cada aula con su color del árbol del logo (el vivo para el cubo y uno oscuro, con contraste sobre crema, para la
// edad) y DÓNDE va en la pila (referencias de Antonio, 2026-11-16: ilustración de cubos ABC apilados): Bebés arriba,
// apoyado en los dos; 1-2 abajo a la izquierda, algo más atrás; 2-3 abajo a la derecha, delante (tapa un poco el
// lado del 1-2). Todos con el mismo fondo (misma perspectiva) y un poco torcidos. En el mismo orden que site.aulas.
// Medidas en unidades del viewBox de la pila (ver CuboSvg).
const FONDO = [42, -34] as const
const estiloAulas = [
  {
    marco: 'var(--color-arbol-naranja-intenso)',
    tinta: 'var(--color-arbol-naranja-texto)',
    cubo: { x: 178, y: 62, lado: 168, giro: -3 },
  }, // bebés
  {
    marco: 'var(--color-arbol-morado-intenso)',
    tinta: 'var(--color-arbol-morado-intenso)',
    cubo: { x: 84, y: 248, lado: 170, giro: 1.5 },
  }, // 1-2 años
  {
    marco: 'var(--color-arbol-verde-intenso)',
    tinta: 'var(--color-verde)',
    cubo: { x: 270, y: 262, lado: 170, giro: -1 },
  }, // 2-3 años
] as const
// Orden de dibujo: primero el de detrás (1-2), luego el de delante (2-3) y por último el de arriba (Bebés).
const ORDEN_DIBUJO = [1, 2, 0] as const

// Los cubos de las aulas (SVG; al verse, caen: CuboQueCae): en pila por debajo de 640 px y en fila desde ahí (FilaAulas). El dibujo va
// oculto al lector de pantalla (aria-hidden): las aulas están, en texto, en la lista de debajo (sr-only).
// Lo de la cara de delante de un aula: "0-1 años" → la edad ("0-1") en grande, "años" justo debajo y, al pie, el
// nombre del aula. Las excursiones de 2-3 (Antonio: que se vean en el cubo), en pequeño sobre el borde de color de
// abajo (de 91 a ~104 en este espacio 0-100), en tinta (blanco sobre ese verde no se leería); también están en la
// lista sr-only.
function CaraAula({ i }: { i: number }) {
  const aula = site.aulas[i]
  const { tinta } = estiloAulas[i]
  const [edad, ...resto] = aula.edades.split(' ')
  const excursiones = 'excursiones' in aula && aula.excursiones
  return (
    <>
      {excursiones && (
        <text x="50" y="97.6" textAnchor="middle" dominantBaseline="central" fontSize="6.6" fontWeight="700" letterSpacing="0.2" style={{ fontFamily: 'var(--font-titulo)', fill: 'var(--color-tinta)' }}>
          {textos.secciones.aulas.excursiones.toLowerCase()}
        </text>
      )}
      <text x="50" y="40" textAnchor="middle" dominantBaseline="central" fontSize="31" fontWeight="700" style={{ fontFamily: 'var(--font-titulo)', fill: tinta }}>
        {edad}
      </text>
      <text x="50" y="62" textAnchor="middle" fontSize="10.5" fontWeight="600" style={{ fontFamily: 'var(--font-titulo)', fill: 'color-mix(in oklab, var(--color-tinta) 65%, white)' }}>
        {resto.join(' ')}
      </text>
      <text x="50" y="80" textAnchor="middle" fontSize="13" fontWeight="700" style={{ fontFamily: 'var(--font-titulo)', fill: 'var(--color-tinta)' }}>
        {aula.nombre}
      </text>
    </>
  )
}

function DegradadoSombra({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor="var(--color-tinta)" stopOpacity="0.2" />
        <stop offset="1" stopColor="var(--color-tinta)" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

// LOS CUBOS CAEN (Antonio, 2026-11-16: "como si fueran dados"): al verse el dibujo, cada cubo cae desde arriba un
// poco torcido, rebota dos veces y se queda en su sitio (.cubos-caen / .cubo-cae en index.css). Una sola vez; con
// movimiento reducido, ya colocados. El orden, como cuando se apilan de verdad: en la pila, primero los dos de abajo y
// luego Bebés encima; en la fila, de izquierda a derecha.
const GIRO_CAIDA = ['-9deg', '8deg', '-6deg'] as const // por aula: hacia dónde va torcido al caer

function useCubosVistos() {
  const ref = useRef<SVGSVGElement>(null)
  // Con casi todo el dibujo a la vista, para que se vea caer (no solo el final).
  const visto = useInView(ref, { once: true, amount: 0.6 })
  return { ref, visto }
}

function CuboQueCae({ aula, retraso, children }: { aula: number; retraso: number; children: ReactNode }) {
  return (
    <g className="cubo-cae" style={{ '--retraso': `${retraso}ms`, '--cae-giro': GIRO_CAIDA[aula] } as CSSProperties}>
      {children}
    </g>
  )
}

// Desde sm (640 px), los tres cubos EN FILA (Antonio, 2026-11-16: la pila dejaba mucho hueco a los lados; foto de
// referencia con cubos en fila), creciendo con la edad (bebés el pequeño, 2-3 el grande) y apoyados en el mismo
// suelo. Desde 640 px el cubo pequeño mide como en la pila del móvil. Por debajo, la pila.
const SUELO_FILA = 400
const FILA = [
  { x: 20, lado: 150, giro: -2 },
  { x: 250, lado: 172, giro: 1.5 },
  { x: 502, lado: 194, giro: -1 },
] as const

function FilaAulas() {
  const { ref, visto } = useCubosVistos()
  return (
    // overflow-visible: los cubos caen desde más arriba del dibujo. --cae-alto: aquí el dibujo sale más grande que la
    // pila del móvil; con menos caída tampoco llega al título.
    <svg ref={ref} data-visto={visto} viewBox="0 150 760 290" aria-hidden="true" focusable="false" className="cubos-caen block h-auto w-full overflow-visible [--cae-alto:75px]">
      <DegradadoSombra id="sombra-fila" />
      <ellipse className="cubos-sombra" cx="385" cy={SUELO_FILA + 14} rx="380" ry="16" fill="url(#sombra-fila)" />
      {FILA.map((c, i) => (
        <CuboQueCae key={site.aulas[i].nombre} aula={i} retraso={i * 160}>
          <CuboSvg x={c.x} y={SUELO_FILA - c.lado} lado={c.lado} giro={c.giro} fondo={FONDO} marco={estiloAulas[i].marco}>
            <CaraAula i={i} />
          </CuboSvg>
        </CuboQueCae>
      ))}
    </svg>
  )
}

function PilaAulas() {
  const t = textos.secciones.aulas
  const { ref, visto } = useCubosVistos()
  return (
    <div className="mx-auto w-full max-w-xl sm:max-w-4xl">
      <div className="hidden sm:block">
        <FilaAulas />
      </div>
      <svg ref={ref} data-visto={visto} viewBox="55 10 450 470" aria-hidden="true" focusable="false" className="cubos-caen block h-auto w-full overflow-visible sm:hidden">
        <DegradadoSombra id="sombra-pila" />
        {/* Sombra en el suelo, bajo los dos de abajo. */}
        <ellipse className="cubos-sombra" cx="285" cy="448" rx="225" ry="18" fill="url(#sombra-pila)" />
        {/* Caen en el orden de dibujo: 1-2, 2-3 y, cuando ya están abajo, Bebés encima. */}
        {ORDEN_DIBUJO.map((i, orden) => (
          <CuboQueCae key={site.aulas[i].nombre} aula={i} retraso={orden < 2 ? orden * 160 : 480}>
            <CuboSvg {...estiloAulas[i].cubo} fondo={FONDO} marco={estiloAulas[i].marco}>
              <CaraAula i={i} />
            </CuboSvg>
          </CuboQueCae>
        ))}
      </svg>
      <ul className="sr-only">
        {site.aulas.map((aula) => (
          <li key={aula.nombre}>
            {aula.nombre}: {aula.edades}
            {'excursiones' in aula && aula.excursiones ? `. ${t.excursiones}.` : '.'}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Excursiones del aula de 2 a 3 años: el texto a un lado y, al otro, la ruta: tres paradas unidas por un camino
// de puntos, cada una con su dibujo propio (granja: vaca; zoo: jirafa; cole: el colegio con su bandera), para no
// repetir los juguetes de siempre. Sin caja: va sobre
// el fondo, justo después del tren (que así "sale de excursión"). Los juguetes, decorativos: el nombre ya lo dice.
const juguetesDestino = [Vaca, Jirafa, Colegio] as const

function Excursiones() {
  const t = textos.secciones.aulas.excursionesBloque
  return (
    // Separado del tren (más en escritorio, Antonio: lg:mt-24).
    <div className="mt-[clamp(2.5rem,6svh,4rem)] grid items-center gap-8 lg:mt-24 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
      <div>
        <h3 className="text-3xl font-semibold text-verde sm:text-4xl">{t.titulo}</h3>
        <p className="mt-3 max-w-xl text-lg text-tinta/80 lg:text-xl">{t.texto}</p>
      </div>
      {/* En escritorio, más grande (Antonio: se quedaba pequeña al lado del tren): círculos de size-28.
          El camino: una línea de puntos a la altura del centro de los círculos (top-10 = mitad de size-20; en escritorio,
          top-14 = mitad de size-28), de la
          primera parada a la última (inset-x-[16.6%]: del centro de la primera columna al de la tercera). */}
      <ol className="relative grid grid-cols-3 gap-3">
        <span aria-hidden="true" className="absolute inset-x-[16.6%] top-10 border-t-[3px] border-dotted border-tinta/20 lg:top-14" />
        {t.destinos.map((destino, i) => {
          const Juguete = juguetesDestino[i % juguetesDestino.length]
          return (
            <li key={destino} className="group relative flex flex-col items-center gap-3 text-center">
              <span aria-hidden="true" className="grid size-20 place-items-center rounded-full bg-white lg:size-28 shadow-[0_0.5rem_1.25rem_rgb(43_40_48/0.1)] ring-1 ring-tinta/5">
                <Juguete className="size-11 lg:size-16 transition-transform duration-300 ease-salida group-hover:-translate-y-1 group-hover:-rotate-6" />
              </span>
              <span className="font-titulo text-lg leading-tight font-semibold lg:text-2xl">{destino}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Aulas() {
  const t = textos.secciones.aulas
  return (
    // Subrayado azul (Antonio: en naranja repetía el color del cubo de Bebés).
    <Seccion titulo={t.titulo} resalte={{ forma: 'subrayado', color: 'azul' }} colorTitulo="text-ciruela">
      {/* Cubos de letras de juguete, dibujados en SVG: en pila en móvil y en fila desde 640 px. */}
      <PilaAulas />
      {/* El tren de las aulas: un vagón por aula, llega una vez al verse (Tren.tsx). Versión "normal" elegida. */}
      <Tren />
      <Excursiones />
    </Seccion>
  )
}

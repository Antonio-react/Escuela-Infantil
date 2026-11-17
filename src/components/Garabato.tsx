import { useInView } from 'motion/react'
import { Fragment, useRef, type ReactNode } from 'react'

// Títulos de sección con una palabra destacada con un GARABATO de cera (Antonio, 2026-11-16: "todos los títulos son
// iguales"). En los textos (src/data/textos.ts), la palabra va entre asteriscos: 'Un aula para cada *edad*'. Esa
// palabra sale en color y con un garabato distinto en cada sección (forma y color, desde la sección):
//   - subrayado: una raya ondulada debajo.
//   - circulo:   un óvalo a mano alrededor.
//   - chispas:   tres rayitas de brillo en las esquinas.
// El trazo, liso y redondeado, como de rotulador de cera (con el filtro de tiza quedaba grumoso y pálido), se descubre
// de izquierda a derecha una vez, al verse (.garabato en index.css; con movimiento reducido, ya dibujado). El
// garabato es decorativo (aria-hidden): el título se lee igual.

type FormaGarabato = 'subrayado' | 'circulo' | 'chispas'
type ColorGarabato = 'naranja' | 'coral' | 'azul' | 'ciruela' | 'verde'
export type Resalte = { forma: FormaGarabato; color: ColorGarabato }

// texto: la palabra, con contraste sobre crema; trazo: el color vivo del árbol para el garabato.
const colores: Record<ColorGarabato, { texto: string; trazo: string }> = {
  naranja: { texto: 'text-arbol-naranja-texto', trazo: 'var(--color-arbol-naranja-intenso)' },
  coral: { texto: 'text-coral', trazo: 'var(--color-arbol-rojo-intenso)' },
  azul: { texto: 'text-arbol-azul-texto', trazo: 'var(--color-arbol-azul-intenso)' },
  ciruela: { texto: 'text-ciruela', trazo: 'var(--color-arbol-morado-intenso)' },
  verde: { texto: 'text-verde', trazo: 'var(--color-arbol-verde-intenso)' },
}

// Cada forma: dónde va su dibujo respecto a la palabra (clases) y sus trazos (viewBox 0 0 100 100, que se estira a
// la caja: preserveAspectRatio="none"; el grosor no se estira: vector-effect).
// Ojo: un <svg> con position absolute NO se estira con left/right/top/bottom (es un elemento "reemplazado"): por eso
// cada caja da su ancho y alto (w-/h-) además de dónde empieza.
const formas: Record<FormaGarabato, { caja: string; trazos: string[]; grosor: number }> = {
  subrayado: {
    caja: '-left-[3%] top-[80%] h-[0.36em] w-[106%]',
    trazos: ['M1 55C12 20 22 85 34 50S56 15 68 50 88 80 99 40'],
    grosor: 5,
  },
  // El óvalo sale 0,22em por cada lado: la palabra deja casi todo ese hueco con su margen (mx-[0.18em], en PalabraGarabato); si no, el
  // trazo se montaba sobre la palabra de al lado o rozaba el borde de la pantalla (2026-11-17).
  circulo: {
    caja: '-left-[0.22em] -top-[0.06em] h-[calc(100%+0.2em)] w-[calc(100%+0.44em)]',
    trazos: ['M88 12C68 0 20 2 6 26-4 46 10 86 46 94 82 100 100 76 98 44 96 22 84 10 62 6'],
    grosor: 4,
  },
  // Tres rayitas de brillo saliendo de la esquina de arriba a la derecha de la palabra (sin invadir la línea de
  // arriba del título).
  chispas: {
    caja: 'left-[calc(100%+0.04em)] -top-[0.12em] h-[0.6em] w-[0.6em]',
    trazos: ['M22 52 16 6', 'M44 66 88 24', 'M54 90 100 86'],
    grosor: 5,
  },
}

function Dibujo({ forma, color, visto }: Resalte & { visto: boolean }) {
  const { caja, trazos, grosor } = formas[forma]
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-visto={visto}
      className={`garabato pointer-events-none absolute overflow-visible ${caja}`}
    >
      {trazos.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={colores[color].trazo}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}

// La palabra destacada: en color, sin partirse, y su garabato. Se mira si se ve LA PALABRA (no el dibujo: empieza
// recortado del todo y el navegador lo daría por invisible, y nunca se descubriría).
function PalabraGarabato({ children, forma, color }: Resalte & { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visto = useInView(ref, { once: true, amount: 0.8 })
  return (
    <span ref={ref} className={`relative inline-block whitespace-nowrap ${forma === 'circulo' ? 'mx-[0.18em]' : ''} ${colores[color].texto}`}>
      {children}
      <Dibujo forma={forma} color={color} visto={visto} />
    </span>
  )
}

// Convierte 'Un aula para cada *edad*' en el título con la palabra destacada. Sin asteriscos, el texto tal cual.
// (Es un componente y no una función que devuelve JSX: así el archivo solo exporta componentes y la recarga en
// caliente de Vite funciona; regla react-refresh/only-export-components.)
export function TituloConGarabato({ texto, resalte }: { texto: string; resalte?: Resalte }) {
  if (!resalte || !texto.includes('*')) return texto.replaceAll('*', '')
  const trozos = texto.split(/\*([^*]+)\*/)
  return trozos.map((trozo, i) => {
    if (i % 2 === 1) {
      // La puntuación pegada detrás de la palabra (", hecha en…") va con ella en un bloque que no se parte: si no,
      // la coma podía irse sola a la línea siguiente.
      const puntuacion = trozos[i + 1]?.match(/^[,.;:!?)]+/)?.[0] ?? ''
      const palabra = (
        <PalabraGarabato {...resalte}>
          {trozo}
        </PalabraGarabato>
      )
      return puntuacion ? (
        <span key={i} className="whitespace-nowrap">
          {palabra}
          {puntuacion}
        </span>
      ) : (
        <Fragment key={i}>{palabra}</Fragment>
      )
    }
    // Lo que va detrás de una palabra destacada pierde la puntuación que ya se ha llevado ella.
    const sinPuntuacion = i > 0 ? trozo.replace(/^[,.;:!?)]+/, '') : trozo
    return <Fragment key={i}>{sinPuntuacion}</Fragment>
  })
}

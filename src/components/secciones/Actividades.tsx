import { useState } from 'react'
import { fotosActividades, srcSet } from '../../data/fotos'
import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'
import { VisorFotos } from '../VisorFotos'

const t = textos.secciones.actividades

// "Algunas actividades" (Familias): fotos de actividades pinchadas en un tablón de corcho, como en las aulas (idea de
// Antonio). Cada foto, impresa con borde blanco, un poco girada, con su chincheta y la franja blanca debajo, sin título.
// Al pulsarla se amplía en el visor (VisorFotos.tsx). Mientras no haya fotos, no se pinta.

// Giro y pequeño desnivel de cada foto (escritos enteros para que Tailwind los encuentre). Con ratón, al pasar por
// encima la foto se endereza y se levanta un poco.
const colocacion = [
  '-rotate-3',
  'rotate-2 sm:translate-y-5',
  '-rotate-1 sm:-translate-y-2',
  'rotate-1 sm:translate-y-1',
  '-rotate-2 sm:-translate-y-1',
] as const
// Chinchetas de los colores del árbol del logo, una de cada.
const chinchetas = [
  'var(--color-arbol-rojo-intenso)',
  'var(--color-arbol-azul-intenso)',
  'var(--color-arbol-naranja-intenso)',
  'var(--color-arbol-verde-intenso)',
  'var(--color-arbol-morado-intenso)',
] as const

function Chincheta({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute -top-3 left-1/2 size-7 -translate-x-1/2 drop-shadow-[1px_3px_2px_rgb(60_30_0/0.45)]">
      <circle cx="12" cy="12" r="9" fill={color} />
      <circle cx="12" cy="12" r="9" fill="none" stroke="black" strokeOpacity="0.18" strokeWidth="1.5" />
      {/* Brillo de la cabeza de plástico. */}
      <ellipse cx="9" cy="8.5" rx="3.2" ry="2.2" fill="white" opacity="0.55" />
    </svg>
  )
}

export function Actividades() {
  const [abierta, setAbierta] = useState<number | null>(null)
  if (fotosActividades.length === 0) return null

  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'chispas', color: 'naranja' }} entradilla={t.entradilla} colorTitulo="text-ciruela">
      <div className="corcho px-6 py-10 sm:px-8 sm:py-12 lg:px-14">
        {/* Flex con salto de línea y centrado (no rejilla): con 5 fotos, 3 arriba y las 2 de abajo centradas, como
            pinchadas a mano. Cada una mide un tercio del ancho menos los huecos. */}
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-12 lg:gap-x-12 lg:gap-y-14">
          {fotosActividades.map((foto, i) => (
            <li key={foto.src} className="w-full max-w-sm sm:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-6rem)/3)]">
              {/* Un botón que abre el visor: su nombre accesible es el alt de la imagen. */}
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setAbierta(i)}
                className={`relative block w-full cursor-zoom-in bg-white p-2.5 pb-2 shadow-[0_8px_16px_-4px_rgb(60_30_0/0.45)] transition-[rotate,translate] duration-300 ease-salida hover:-translate-y-1 hover:rotate-0 ${colocacion[i % colocacion.length]}`}
              >
                <img
                  src={foto.src}
                  srcSet={srcSet(foto)}
                  // Un tercio del corcho desde sm; en móvil, como mucho 24rem (max-w-sm).
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 30vw, 384px"
                  alt={foto.alt}
                  width={foto.ancho}
                  height={foto.alto}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-4/3 w-full object-cover"
                />
                {/* La franja blanca de abajo de la foto impresa, sin título (Antonio, 2026-11-17): el mismo alto que
                    tenía con el texto (h-7, la línea de text-xl). El título sigue en el visor. */}
                <span aria-hidden="true" className="mt-1.5 block h-7" />
                <Chincheta color={chinchetas[i % chinchetas.length]} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <VisorFotos fotos={fotosActividades} abierta={abierta} alCerrar={() => setAbierta(null)} />
    </Seccion>
  )
}

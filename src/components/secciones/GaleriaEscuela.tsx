import { useState } from 'react'
import { fotosEscuela, srcSet } from '../../data/fotos'
import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'
import { VisorFotos } from '../VisorFotos'

const t = textos.secciones.galeria

// "Así es la escuela": las fotos de los espacios de la escuela (src/data/fotos.ts). Mientras no haya fotos, no se
// pinta. Al pulsar una foto se amplía en el visor (VisorFotos.tsx).

// Formas orgánicas (esquinas distintas), alternándose.
const formas = [
  'rounded-[2.5rem_3.5rem_3rem_4rem/3rem_2.5rem_3.5rem_3rem]',
  'rounded-[3.5rem_2.5rem_4rem_3rem/2.5rem_3.5rem_3rem_3.5rem]',
  'rounded-[3rem_4rem_2.5rem_3.5rem/3.5rem_3rem_3.5rem_2.5rem]',
] as const

// Hueco de cada foto en la rejilla (el "encaje" de fotos.ts). Con las filas de alto fijo (ver la rejilla) y las 8
// fotos de ahora, sin huecos:
//   escritorio (3 columnas)      tablet (2 columnas)
//   [ grande ][ · ]              [ grande ]
//   [ grande ][ · ]              [ grande ]
//   [ · ][ · ][alta]             [ · ][ · ]
//   [ · ][ · ][alta]             [ · ][ · ]
//                                [alta][ · ]
//                                [alta][ · ]
// En móvil, una debajo de otra con su forma real.
const huecos = {
  normal: '',
  grande: 'sm:col-span-2 sm:row-span-2',
  alta: 'sm:row-span-2',
  ancha: 'lg:col-span-2',
} as const

export function GaleriaEscuela() {
  const [abierta, setAbierta] = useState<number | null>(null)
  if (fotosEscuela.length === 0) return null

  return (
    <Seccion titulo={t.titulo} colorTitulo="text-coral">
      {/* Las filas tienen un alto fijo calculado con el ancho de la rejilla (100cqw: unidades de contenedor, por eso
          el @container): cada hueco normal sale 4:3, como las fotos, y los grandes, altos y anchos encajan justos.
          Si el alto dependiera de cada foto, la vertical (el baño) estiraría su fila. */}
      <div className="@container">
        <ul className="grid gap-4 sm:auto-rows-[calc((100cqw-1rem)*3/8)] sm:grid-cols-2 lg:auto-rows-[calc((100cqw-2rem)/4)] lg:grid-cols-3">
          {fotosEscuela.map((foto, i) => (
            <li key={foto.src} className={huecos[foto.encaje ?? 'normal']}>
              {/* Un botón que abre el visor; su nombre accesible es el alt. La forma y el recorte van en el botón (y no
                  en el <li>): así el anillo de foco no queda cortado. */}
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setAbierta(i)}
                className={`group block size-full cursor-zoom-in overflow-hidden ${formas[i % formas.length]}`}
              >
                <img
                  src={foto.src}
                  srcSet={srcSet(foto)}
                  // Lo que ocupa: la grande, dos columnas (unos 730 px en escritorio); las demás, una (unos 360).
                  sizes={
                    foto.encaje === 'grande'
                      ? '(min-width: 1024px) 731px, calc(100vw - 3rem)'
                      : '(min-width: 1024px) 360px, (min-width: 640px) calc(50vw - 2rem), calc(100vw - 2rem)'
                  }
                  alt={foto.alt}
                  width={foto.ancho}
                  height={foto.alto}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-cover transition-transform duration-500 ease-salida group-hover:scale-[1.03] sm:h-full"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <VisorFotos fotos={fotosEscuela} abierta={abierta} alCerrar={() => setAbierta(null)} />
    </Seccion>
  )
}

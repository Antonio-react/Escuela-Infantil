import { textos } from '../../data/textos'
import { Manzana } from '../Juguetes'
import { Seccion } from '../Seccion'

// "Nuestra cocina": a la izquierda, la manzana y la frase aprobada en grande; a la derecha, una ficha de
// receta (papel rayado, ligeramente girada) con los puntos aprobados.

// Viñeta de cada punto: un círculo de un color del árbol (decorativo; la lista ya se anuncia como lista).
const coloresVineta = [
  'var(--color-arbol-naranja-intenso)',
  'var(--color-arbol-verde-intenso)',
  'var(--color-arbol-rojo-intenso)',
  'var(--color-arbol-azul-intenso)',
  'var(--color-arbol-morado-intenso)',
] as const

export function Cocina() {
  const t = textos.secciones.cocina
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'circulo', color: 'coral' }} colorTitulo="text-arbol-azul-texto">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <Manzana className="size-20 -rotate-6 sm:size-24" />
          <p className="font-titulo text-3xl leading-snug font-medium sm:text-4xl sm:leading-snug">{textos.cocina}</p>
        </div>

        {/* Ficha de receta: papel con renglones (degradado que se repite cada 2.5rem, la altura de cada línea). */}
        <div className="ficha-receta rounded-[1.5rem_2rem_1.75rem_2.25rem] px-7 pt-6 pb-8 shadow-sm ring-1 ring-tinta/5 sm:px-9 lg:rotate-1">
          <h3 className="text-xl font-semibold text-coral">{t.ficha}</h3>
          <ul className="mt-2">
            {t.puntos.map((punto, i) => (
              // leading-10: cada línea de texto mide lo mismo que un renglón (2.5rem), así se apoya en su raya
              // aunque el punto ocupe dos líneas. La viñeta, centrada en la primera línea.
              <li key={punto} className="flex items-start gap-3 text-lg leading-10">
                <span aria-hidden="true" className="mt-3.75 size-2.5 shrink-0 rounded-full" style={{ background: coloresVineta[i % coloresVineta.length] }} />
                {punto}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Seccion>
  )
}

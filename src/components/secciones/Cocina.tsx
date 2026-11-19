import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'

// "Comida casera": solo la ficha de receta (papel rayado, ligeramente girada) con los puntos aprobados, centrada.
// Sin la manzana, la frase grande ni el título de la ficha (Antonio, 2026-11-19).

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
      {/* Ficha de receta: papel con renglones (degradado que se repite cada 2.5rem, la altura de cada línea). */}
      <div className="ficha-receta mx-auto max-w-xl rounded-[1.5rem_2rem_1.75rem_2.25rem] px-7 pt-4 pb-5 shadow-sm ring-1 ring-tinta/5 sm:px-9 lg:rotate-1">
        <ul>
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
    </Seccion>
  )
}

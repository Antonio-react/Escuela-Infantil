import { Fragment } from 'react'
import { Link } from 'react-router'
import type { Bloque, TextoLegal, Trozo } from '../data/legal'
import type { Pagina } from '../data/paginas'
import { textos } from '../data/textos'
import { CabeceraPagina } from './CabeceraPagina'

// Plantilla de las páginas legales (Aviso legal y Política de privacidad). Son textos para LEER: una columna
// cómoda (max-w-3xl), secciones numeradas (el número en un círculo de un color del árbol, como en la FAQ) y, para
// los datos de la empresa, una ficha con líneas de puntos (como "Otras formas" de Contacto), sin cajas.
// Los textos viven en src/data/legal.ts.

const coloresNumero = ['bg-arbol-naranja', 'bg-arbol-verde', 'bg-arbol-rojo', 'bg-arbol-azul', 'bg-arbol-morado'] as const
const claseEnlace = 'font-semibold text-ciruela underline underline-offset-4 wrap-anywhere'

// Un trozo de texto: texto tal cual o un enlace. Si empieza por "/", es una página de esta web (Link); si no, un
// enlace normal (los externos, en otra pestaña y avisándolo al lector de pantalla).
function PintarTrozo({ trozo }: { trozo: Trozo }) {
  if (typeof trozo === 'string') return trozo
  if (trozo.href.startsWith('/')) {
    return (
      <Link to={trozo.href} className={claseEnlace}>
        {trozo.texto}
      </Link>
    )
  }
  return (
    <a
      href={trozo.href}
      className={claseEnlace}
      {...(trozo.externo ? { target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${trozo.texto}${textos.legal.externo}` } : {})}
    >
      {trozo.texto}
    </a>
  )
}
function Trozos({ trozos }: { trozos: readonly Trozo[] }) {
  return trozos.map((trozo, i) => (
    <Fragment key={i}>
      <PintarTrozo trozo={trozo} />
    </Fragment>
  ))
}

function PintarBloque({ bloque }: { bloque: Bloque }) {
  if (bloque.tipo === 'parrafo') {
    return (
      <p>
        <Trozos trozos={bloque.trozos} />
      </p>
    )
  }
  if (bloque.tipo === 'lista') {
    return (
      <ul className="flex flex-col gap-2 pl-1">
        {bloque.elementos.map((elemento, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 rounded-full bg-arbol-verde-intenso" />
            <span>
              <Trozos trozos={elemento} />
            </span>
          </li>
        ))}
      </ul>
    )
  }
  // Ficha: en móvil, etiqueta encima y valor debajo; desde sm, en dos columnas.
  return (
    <dl className="border-y-2 border-dotted border-tinta/15">
      {bloque.filas.map((fila) => (
        <div key={fila.etiqueta} className="grid gap-x-6 gap-y-0.5 border-b-2 border-dotted border-tinta/15 py-3 last:border-b-0 sm:grid-cols-[12rem_1fr]">
          <dt className="text-sm font-semibold text-tinta/70 sm:text-base">{fila.etiqueta}</dt>
          <dd className="font-titulo text-lg font-medium">
            <Trozos trozos={fila.valor} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function PaginaLegal({ pagina, texto }: { pagina: Pagina; texto: TextoLegal }) {
  return (
    <>
      <CabeceraPagina pagina={pagina} />
      <div className="mx-auto max-w-6xl px-4 pt-[clamp(2rem,6svh,3.5rem)] pb-[clamp(3.5rem,10svh,7rem)] sm:px-6">
        <div className="flex max-w-3xl flex-col gap-[clamp(2.5rem,6svh,3.5rem)]">
          {texto.secciones.map((seccion, i) => (
            <section key={seccion.titulo} aria-labelledby={`legal-${i}`}>
              <h2 id={`legal-${i}`} className="flex items-center gap-3 text-2xl font-semibold text-verde sm:text-3xl">
                <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-full font-titulo text-base text-tinta ${coloresNumero[i % coloresNumero.length]}`}>
                  {i + 1}
                </span>
                {seccion.titulo}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-lg leading-relaxed text-tinta/85">
                {seccion.bloques.map((bloque, j) => (
                  <PintarBloque key={j} bloque={bloque} />
                ))}
              </div>
            </section>
          ))}
          <p className="text-sm text-tinta/70">
            {textos.legal.actualizado} {texto.actualizado}.
          </p>
        </div>
      </div>
    </>
  )
}

import type { CSSProperties } from 'react'
import { equipo } from '../../data/equipo'
import { fotoEquipo, srcSet } from '../../data/fotos'
import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'

// "Nuestro equipo": la foto de grupo (fotoEquipo) y, debajo de cada una, solo su nombre (Antonio, 2026-11-18: sin
// cargos; el cargo sigue en equipo.ts porque Presentacion lo usa para saber quiénes son directoras), en texto real
// para los lectores de pantalla y los buscadores. Todos los nombres en la misma celda de la rejilla, con un ancho fijo
// y un margen a la izquierda en % según enLaFoto (en una rejilla, el % del margen se mide sobre el ancho de la celda,
// que es el de la foto): así cada nombre queda justo debajo de su persona, en todos los tamaños.

// Ancho de cada nombre, en % de la foto: lo que hay entre las dos más juntas (Olga y Cristina, 21 %).
const ANCHO_NOMBRE = 20

// Cada nombre en un color del árbol del logo (Antonio: "no tan serio"), en su versión para texto (≥ 4,9:1 sobre
// crema). Sin ciruela: es el del título de la sección.
const coloresNombre = ['text-arbol-naranja-texto', 'text-verde', 'text-coral', 'text-arbol-azul-texto'] as const

export function Equipo() {
  const t = textos.secciones.equipo
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'chispas', color: 'verde' }} entradilla={t.entradilla} colorTitulo="text-ciruela">
      {/* Como mucho el 73 % del alto de la pantalla (la foto es casi cuadrada: en un portátil bajo no cabría entera). */}
      <div className="mx-auto max-w-[min(56rem,73svh)]">
        {fotoEquipo && (
          <img
            src={fotoEquipo.src}
            srcSet={srcSet(fotoEquipo)}
            sizes="(min-width: 640px) min(56rem, 73svh), calc(100vw - 2rem)"
            alt={fotoEquipo.alt}
            width={fotoEquipo.ancho}
            height={fotoEquipo.alto}
            loading="lazy"
            className="h-auto w-full rounded-sm shadow-[0_1rem_2.5rem_rgb(43_40_48/0.14)]"
          />
        )}
        <ul className="mt-3 grid sm:mt-4">
          {equipo.map((persona, i) => {
            const sitio = { '--izquierda': `${persona.enLaFoto - ANCHO_NOMBRE / 2}%`, '--ancho': `${ANCHO_NOMBRE}%` } as CSSProperties
            return (
              <li
                key={persona.nombre}
                style={sitio}
                className={`col-start-1 row-start-1 ml-(--izquierda) w-(--ancho) text-center font-titulo text-lg font-semibold sm:text-2xl ${coloresNombre[i % coloresNombre.length]}`}
              >
                {persona.nombre}
              </li>
            )
          })}
        </ul>
      </div>
    </Seccion>
  )
}

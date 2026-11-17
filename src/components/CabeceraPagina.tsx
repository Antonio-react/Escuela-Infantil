import type { ReactNode } from 'react'
import type { Cifra } from '../data/cifras'
import { srcSet, type Foto } from '../data/fotos'
import type { Pagina } from '../data/paginas'
import { useMetadatos } from '../hooks/useMetadatos'

// Cada cifra con un color de texto con contraste suficiente sobre crema, todos bien distintos entre sí
// (el morado del logo se parecía demasiado al ciruela).
const coloresCifra = ['text-verde', 'text-ciruela', 'text-coral', 'text-verde-hoja'] as const

// La inicial del título de la página escrita A TIZA en una mini pizarra con marco de madera, del color de la página
// (Antonio, 2026-11-16: los títulos eran todos iguales; primero fue un cubo de letras, pero en La escuela repetía los
// cubos de las aulas). Une con la pizarra del menú y la del cierre. Decorativo: el h1 lleva el nombre entero para el
// lector de pantalla (sr-only) y lo que se ve va aria-hidden. La tiza: el color de la página aclarado (como en el
// menú) y el filtro de tiza (.tiza).
function InicialEnPizarra({ letra, color }: { letra: string; color: string }) {
  return (
    // La letra, gorda (contorno del mismo color, -webkit-text-stroke): el filtro de tiza se come los bordes y una
    // letra fina casi no se leía.
    <span className="mr-[0.08em] inline-grid size-[1.22em] -rotate-3 place-items-center rounded-[0.16em] border-[0.07em] border-madera bg-pizarra align-[-0.2em] shadow-[0_0.08em_0.2em_rgb(43_40_48/0.25)]">
      <span
        className="tiza font-tiza text-[1.02em] leading-none font-normal [-webkit-text-stroke:0.045em_currentColor]"
        style={{ color: `color-mix(in oklab, ${color} 70%, white)` }}
      >
        {letra}
      </span>
    </span>
  )
}

// Cabecera común de las páginas interiores: pone título y descripción en la pestaña y pinta el h1.
// Con "cifras", es un arranque más potente: debajo, los datos clave en grande.
// foto: una foto de la escuela (fotos.ts). Desde xl, a la derecha del texto (por debajo quitaba sitio a las cifras);
// por debajo, bajo las cifras, en todos los tamaños (Antonio, 2026-11-17: en móvil no salía nada). Sin lazy: está
// arriba, se ve al entrar.
// descripcion: si se pasa, se pinta en lugar de pagina.descripcion (por ejemplo, con palabras de colores, como en
// Contacto); la de Google sigue siendo pagina.descripcion (useMetadatos).
export function CabeceraPagina({
  pagina,
  cifras,
  foto,
  descripcion,
  children,
}: {
  pagina: Pagina
  cifras?: readonly Cifra[]
  foto?: Foto | null
  descripcion?: ReactNode
  children?: ReactNode
}) {
  useMetadatos(pagina)
  return (
    <div className="mx-auto max-w-6xl px-4 pt-[clamp(2rem,6svh,3.5rem)] pb-2 sm:px-6">
      <div className={foto ? 'grid items-center gap-10 xl:grid-cols-[2fr_1fr]' : ''}>
        <div>
          {/* Un escalón más grande que los títulos de sección (text-4xl sm:text-5xl, Seccion.tsx): antes medían lo
              mismo y no se distinguía el título de la página. En el color de su página (paginas.ts). */}
          <h1 className={`text-5xl font-semibold sm:text-6xl ${pagina.colorTitulo ?? 'text-verde'}`}>
            {pagina.colorIntenso ? (
              <>
                <span className="sr-only">{pagina.nombre}</span>
                <span aria-hidden="true">
                  <InicialEnPizarra letra={pagina.nombre[0]} color={pagina.colorIntenso} />
                  {pagina.nombre.slice(1)}
                </span>
              </>
            ) : (
              pagina.nombre
            )}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-tinta/80">{descripcion ?? pagina.descripcion}</p>
          {/* Móvil: de dos en dos. Desde sm: en fila, cada cifra con su ancho natural (en 4 columnas iguales la
              hora no cabía). */}
          {cifras && (
            <ul className="mt-[clamp(2rem,5svh,3rem)] grid grid-cols-2 gap-6 sm:flex sm:flex-wrap sm:gap-x-10 lg:gap-x-8">
              {cifras.map((cifra, i) => (
                <li key={cifra.texto} className="flex flex-col items-center text-center">
                  {/* whitespace-nowrap: una cifra nunca se parte en dos líneas ("7:00–" / "17:00"). */}
                  <span className={`font-titulo text-4xl leading-none font-semibold whitespace-nowrap sm:text-5xl ${coloresCifra[i % coloresCifra.length]}`}>
                    {cifra.valor}
                  </span>
                  <span className="mt-2 text-tinta/75">{cifra.texto}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Esquinas poco redondeadas (rounded-sm), como la fachada de Inicio: es una foto, no una tarjeta. Por debajo
            de xl, como mucho max-w-xl y alineada a la izquierda, con el texto (a todo el ancho de una tablet sería
            enorme y empujaría el contenido hacia abajo). */}
        {foto && (
          <img
            src={foto.src}
            srcSet={srcSet(foto)}
            sizes="(min-width: 1280px) 23rem, (min-width: 640px) 36rem, calc(100vw - 2rem)"
            alt={foto.alt}
            width={foto.ancho}
            height={foto.alto}
            decoding="async"
            className="block aspect-4/3 w-full max-w-xl rounded-sm object-cover"
          />
        )}
      </div>
      {children}
    </div>
  )
}

import { useId, type ReactNode } from 'react'
import { TituloConGarabato, type Resalte } from './Garabato'

type SeccionProps = {
  // ReactNode y no solo texto: así un título puede llevar palabras de otro color (Instalaciones: "frío" y "calor").
  titulo: ReactNode
  // La palabra entre asteriscos del título ('Un aula para cada *edad*'), en color y con un garabato de cera
  // (Garabato.tsx): forma y color, distintos en cada sección para que los títulos no sean todos iguales.
  resalte?: Resalte
  // Frase corta que acompaña al título. En escritorio va a su derecha, en la misma línea ("cabecera
  // editorial", skill Taste); en móvil, debajo.
  entradilla?: string
  children: ReactNode
  id?: string
  // Color del título: los de la marca que tienen contraste suficiente sobre crema (el azul oscuro del árbol, 5,8:1).
  // Regla (2026-11-17, DESIGN.md): distinto del título de la sección anterior, del h1 de su página y de su palabra
  // destacada.
  colorTitulo?: 'text-verde' | 'text-ciruela' | 'text-coral' | 'text-arbol-azul-texto' | 'text-arbol-naranja-texto'
  // Fondo de color para meter la sección en un panel con forma orgánica (por ejemplo, 'bg-azul-suave').
  // Da ritmo a la página (no todas las secciones sobre el mismo crema). Panel y no franja a lo ancho: así
  // alrededor se sigue viendo el árbol de fondo. La clase va escrita entera para que Tailwind la encuentre.
  panel?: 'bg-azul-suave' | 'bg-verde-suave' | 'bg-coral-suave' | 'bg-mostaza-suave' | 'bg-ciruela-suave'
  className?: string
}

// Envoltorio común de las secciones de contenido: mismo ancho, mucho aire (casi una pantalla por
// sección) y la misma cabecera. aria-labelledby une la sección con su título para el lector de pantalla.
export function Seccion({ titulo, resalte, entradilla, children, id, colorTitulo = 'text-verde', panel, className = '' }: SeccionProps) {
  const idTitulo = useId()
  return (
    // Márgenes verticales en proporción al alto de la pantalla (svh), con mínimo y máximo: en pantallas
    // altas como antes; en portátiles bajos (13") se encogen y la sección no empieza a media pantalla.
    // Título y entradilla en la misma línea solo desde xl (1280 px): por debajo, el título se partía.
    <section
      id={id}
      aria-labelledby={idTitulo}
      // Con panel, menos margen por fuera: el propio panel ya separa la sección de las demás.
      className={`mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6 ${panel ? 'py-[clamp(1.5rem,5svh,3.5rem)]' : 'py-[clamp(3.5rem,10svh,7rem)]'} ${className}`}
    >
      <div
        className={
          panel
            ? `${panel} rounded-[2.5rem_3.5rem_3rem_4rem/3rem_2.5rem_3.5rem_3rem] px-5 py-[clamp(2.5rem,7svh,4.5rem)] sm:px-10 lg:px-14`
            : ''
        }
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between xl:gap-12">
          <h2 id={idTitulo} className={`max-w-3xl text-4xl font-semibold text-balance sm:text-5xl ${colorTitulo}`}>
            {typeof titulo === 'string' ? <TituloConGarabato texto={titulo} resalte={resalte} /> : titulo}
          </h2>
          {entradilla && <p className="max-w-xl text-lg text-tinta/75 xl:max-w-md xl:pb-1 xl:text-right">{entradilla}</p>}
        </div>
        <div className="mt-[clamp(2rem,5svh,3rem)]">{children}</div>
      </div>
    </section>
  )
}

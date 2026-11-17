import { site } from '../../data/site'
import { textos } from '../../data/textos'
import { Asoma } from '../Asoma'
import { Nube } from '../Decoracion'
import { Osito, Patito } from '../Juguetes'
import { Seccion } from '../Seccion'

// "Su día a día, en Baby Control": a la izquierda, qué es y el enlace a su web oficial; a la derecha, un móvil
// DIBUJADO por nosotros (no una captura de la app ni su logo) con la agenda del día: una "foto" (un paisaje con
// sol y nubes, sin niños) y las novedades. Dos avisos asoman fuera de la pantalla. Todo el móvil es decorativo
// (aria-hidden): lo que cuenta ya está en el texto. Sin caja (Antonio: los paneles redondeados quedan de plantilla):
// detrás del móvil, una nube grande, la misma forma de toda la web, como si el móvil descansara en ella.

// Icono de cámara (aviso "Fotos del día").
function Camara({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  )
}

// Corazón (aviso flotante).
function Corazon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 20.5C6 16.4 3 13 3 9.2 3 6.6 5 4.5 7.6 4.5c1.8 0 3.3 1 4.4 2.6 1.1-1.6 2.6-2.6 4.4-2.6C19 4.5 21 6.6 21 9.2c0 3.8-3 7.2-9 11.3z" fill="var(--color-arbol-rojo-intenso)" />
    </svg>
  )
}

// Una novedad del día: el juguete y dos rayas que hacen de texto (no se inventa ningún mensaje).
function Novedad({ Juguete, ancho }: { Juguete: typeof Osito; ancho: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl bg-white p-2.5 shadow-[0_0.25rem_0.75rem_rgb(43_40_48/0.06)]">
      <Juguete className="size-8 shrink-0" />
      <div className="flex flex-1 flex-col gap-1.5">
        <span className={`h-2 rounded-full bg-tinta/15 ${ancho}`} />
        <span className="h-2 w-1/2 rounded-full bg-tinta/10" />
      </div>
    </div>
  )
}

export function BabyControl() {
  const t = textos.secciones.babyControl
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'chispas', color: 'naranja' }} colorTitulo="text-verde">
      {/* items-start: el texto va justo bajo el título (centrado dejaba un hueco). Desde md, el móvil sube hasta la
          altura del título (-mt), para que la sección no crezca por él. */}
      <div className="grid items-start gap-14 md:grid-cols-[1fr_auto] md:gap-12 lg:gap-20">
        <div className="flex max-w-xl flex-col items-start gap-7">
          <p className="text-xl leading-relaxed text-tinta/85">{t.texto}</p>
          {/* Con una rana asomando por arriba (Asoma.tsx; Antonio, 2026-11-16: la prefirió al cocodrilo), saliendo
              del agua: el botón es un charco (.boton-charco, 2026-11-17). */}
          <Asoma animal="rana">
            <a href={site.babyControl} target="_blank" rel="noopener noreferrer" aria-label={t.botonAria} className="boton boton-charco">
              {t.boton}
            </a>
          </Asoma>
        </div>

        {/* El móvil. Un poco girado, como apoyado en la mesa. Entre md y xl (tablet en horizontal) algo más pequeño
            y separado del borde (md:mr-6): si no, el corazón de la derecha se cortaba con el borde de la pantalla. */}
        <div aria-hidden="true" className="relative mx-auto w-[min(15rem,70vw)] rotate-3 sm:w-64 md:-mt-28 md:mr-6 md:w-56 xl:mr-auto xl:w-64">
          {/* La nube de detrás: más ancha que el móvil (150 %: más ancha se salía de la pantalla) y algo más baja que su
              centro; -z-10 la deja detrás. */}
          <Nube className="absolute top-[42%] left-1/2 -z-10 w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-3 text-mostaza-suave" />
          <div className="rounded-[2.6rem] bg-tinta p-2.5 shadow-[0_1.5rem_3rem_rgb(43_40_48/0.25)]">
            <div className="flex aspect-9/17 flex-col gap-3 overflow-hidden rounded-[2.1rem] bg-crema px-4 pt-3 pb-5">
              {/* La "isla" de la cámara del móvil. */}
              <span className="mx-auto h-5 w-20 rounded-full bg-tinta" />
              <p className="font-titulo text-2xl font-semibold text-ciruela">{t.pantalla.hoy}</p>
              {/* La "foto": un paisaje sencillo (cielo, sol, nube y colina), sin niños. */}
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-arbol-azul">
                <span className="absolute top-3 right-4 size-8 rounded-full bg-arbol-naranja-intenso" />
                <Nube className="absolute top-5 left-3 w-16 text-white" />
                <span className="absolute -bottom-10 -left-6 h-20 w-[75%] rounded-[50%] bg-arbol-verde-intenso" />
                <span className="absolute -right-8 -bottom-12 h-20 w-[80%] rounded-[50%] bg-verde/80" />
              </div>
              <p className="-mt-1 text-sm font-semibold text-tinta/70">{t.pantalla.novedades}</p>
              <Novedad Juguete={Osito} ancho="w-4/5" />
              <Novedad Juguete={Patito} ancho="w-3/5" />
            </div>
          </div>

          {/* Avisos que asoman fuera de la pantalla: "Fotos del día" y un corazón. */}
          <div className="absolute top-[38%] -left-10 flex -rotate-6 items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 font-titulo text-sm font-semibold shadow-[0_0.75rem_1.5rem_rgb(43_40_48/0.15)] sm:-left-16">
            <Camara className="size-5 text-ciruela" />
            {t.pantalla.fotos}
          </div>
          <div className="absolute -right-5 bottom-[22%] grid size-14 rotate-6 place-items-center rounded-full bg-white shadow-[0_0.75rem_1.5rem_rgb(43_40_48/0.15)]">
            <Corazon className="size-7" />
          </div>
        </div>
      </div>
    </Seccion>
  )
}

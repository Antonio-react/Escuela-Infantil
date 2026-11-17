import { useInView } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { enlaceMapa } from '../../data/mapa'
import { rutaSolicitarVisita } from '../../data/paginas'
import { site } from '../../data/site'
import { enlaceTel, formatoPantalla, telefonoLlamadas } from '../../data/telefonos'
import { textos } from '../../data/textos'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { IconoEmail, IconoTelefono } from '../Iconos'
import { MarcoPizarra } from '../MarcoPizarra'
import { JugueteTiza, NubeTiza, PajaroTiza, SubrayadoTiza, TextoTiza } from '../Tiza'
import { conTiempo, despues, duracionPalabras, duracionTexto, tizas } from '../utilidadesTiza'
import { marcarVisto, yaSeHaVisto } from '../../utils/vistoEnLaVisita'

const CLAVE_VISTO = 'cierre-pizarra-visto'

// Cierre de las páginas, justo antes del footer: quien llega al final ya está convencido, así que se le da
// el siguiente paso. Una pizarra de aula (como la 404) escrita a tiza: la invitación, la matrícula abierta,
// dónde estamos (con "Cómo llegar"), la acción principal (la nube "Solicitar visita") y dos alternativas
// (email y llamar). Se escribe UNA vez en la visita, cuando aparece en pantalla (antes espera en pausa). Con movimiento
// reducido, ya escrita. En todas las páginas menos Contacto (ya tiene el formulario), las legales y la 404.

const t = textos.secciones.cierre
const MS_LETRA_TITULO = 30
const MS_LETRA_TEXTO = 6

// Orden de escritura: de arriba abajo y de izquierda a derecha (en milisegundos, desde que se ve).
const TITULO = { retraso: 0, duracion: duracionPalabras(t.titulo, MS_LETRA_TITULO) }
const OSITO = { retraso: TITULO.duracion - 150, duracion: 450 } // a la derecha del título
const PAJAROS = { retraso: OSITO.retraso + 300, duracion: 300 }
const SUBRAYADO = { retraso: TITULO.duracion + 100, duracion: 320 }
const TEXTO = { retraso: SUBRAYADO.retraso + 200, duracion: duracionPalabras(t.texto, MS_LETRA_TEXTO) }
const DIRECCION_INTRO = { retraso: TEXTO.retraso + TEXTO.duracion, duracion: duracionPalabras(t.direccionIntro, MS_LETRA_TEXTO) }
const DIRECCION = { retraso: DIRECCION_INTRO.retraso + DIRECCION_INTRO.duracion, duracion: duracionPalabras(t.direccion, MS_LETRA_TEXTO) }
const COMO_LLEGAR = { retraso: DIRECCION.retraso + DIRECCION.duracion, duracion: duracionTexto(t.comoLlegar) }
const NUBE = { retraso: COMO_LLEGAR.retraso + 100, duracion: 420 }
const NUBE_TEXTO = { retraso: NUBE.retraso + 180, duracion: duracionTexto(textos.hero.botonVisita) }
// Los dos botones se ESCRIBEN (de izquierda a derecha, contorno y texto), uno detrás de otro, como el resto de la
// pizarra (Antonio, 2026-11-17: antes aparecían con un fundido casi a la vez).
const ESCRIBENOS = { retraso: NUBE_TEXTO.retraso + 150, duracion: 300 + duracionTexto(t.escribenos) }
const LLAMAR = { retraso: ESCRIBENOS.retraso + ESCRIBENOS.duracion, duracion: 300 + duracionTexto(t.llamar) }
const OSITO_PEQUENO = { retraso: LLAMAR.retraso + LLAMAR.duracion, duracion: 450 } // móvil: abajo a la derecha, lo último

export function Cierre() {
  const idTitulo = useId()
  const ref = useRef<HTMLElement>(null)
  // Se escribe cuando ya se ve buena parte de la pizarra, y solo la primera vez.
  const visto = useInView(ref, { once: true, amount: 0.35 })
  const reducido = usePrefersReducedMotion()
  // Solo se escribe la primera vez que se ve en la visita (Antonio, 2026-11-17); en las demás páginas sale ya
  // pintada (--escala-tiza a 0, como el menú). Se decide al montar y se recuerda al empezar a escribirse.
  const [primeraVez] = useState(() => !yaSeHaVisto(CLAVE_VISTO))
  useEffect(() => {
    if (visto && primeraVez) marcarVisto(CLAVE_VISTO)
  }, [visto, primeraVez])
  const claseMarco = !primeraVez ? '[--escala-tiza:0]' : visto || reducido ? '' : 'pizarra-pausada'

  return (
    <section ref={ref} aria-labelledby={idTitulo} className="mx-auto max-w-6xl px-4 py-[clamp(2.5rem,7svh,5rem)] sm:px-6">
      <MarcoPizarra
        claseMarco={claseMarco}
        clasePizarra="px-6 py-[clamp(2.5rem,6svh,4rem)] sm:px-12 lg:px-16"
      >
        <div className="relative grid items-center gap-8 lg:grid-cols-[2.6fr_1fr]">
          <div>
            {/* w-fit: la caja mide lo que el título, y el subrayado (estirado) lo recorre entero (idea de Antonio). */}
            <div className="w-fit">
              <h2 id={idTitulo} className="font-tiza text-[clamp(2.2rem,5vw,3.4rem)] leading-tight font-normal text-tiza">
                <TextoTiza texto={t.titulo} retraso={TITULO.retraso} msPorLetra={MS_LETRA_TITULO} />
              </h2>
              <SubrayadoTiza estirar className="mt-2 block h-3.5 w-full" style={conTiempo(SUBRAYADO, { color: tizas.verde })} />
            </div>
            <p className="mt-6 max-w-xl text-[clamp(1.25rem,2.4vw,1.5rem)] leading-snug text-tiza/85">
              <TextoTiza texto={t.texto} retraso={TEXTO.retraso} msPorLetra={MS_LETRA_TEXTO} />
            </p>
            {/* Dónde estamos, con el enlace a Google Maps (solo un enlace: no carga ningún mapa). */}
            <p className="mt-4 text-[clamp(1.2rem,2.2vw,1.4rem)] leading-snug text-tiza/85">
              <TextoTiza texto={t.direccionIntro} retraso={DIRECCION_INTRO.retraso} msPorLetra={MS_LETRA_TEXTO} />{' '}
              {/* La calle, en tiza naranja como el osito (idea de Antonio): el color lo heredan las palabras de tiza. */}
              <span style={{ color: tizas.naranja }}>
                <TextoTiza texto={t.direccion} retraso={DIRECCION.retraso} msPorLetra={MS_LETRA_TEXTO} />
              </span>{' '}
              <a
                href={enlaceMapa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.comoLlegarAria}
                className="tiza tiza-escribe inline-block rounded underline decoration-2 underline-offset-4"
                style={conTiempo(COMO_LLEGAR, { color: tizas.morada })}
              >
                {t.comoLlegar} →
              </a>
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              {/* La acción principal: la nube de tiza, como en el menú. El dibujo empieza en x=17 de su viewBox
                  (240 de ancho, 110 de alto): el margen negativo lo alinea con el borde de los otros botones. */}
              <Link
                to={rutaSolicitarVisita}
                className="relative -ml-[calc(5.25rem*17/110)] grid h-21 w-[calc(5.25rem*240/110)] place-items-center transition-transform duration-150 active:scale-[0.97]"
              >
                <NubeTiza className="absolute inset-0 size-full" style={conTiempo(NUBE, { color: tizas.azul })} />
                <span className="tiza tiza-escribe relative mt-1 -rotate-2 text-[1.6rem]" style={conTiempo(NUBE_TEXTO)}>
                  {textos.hero.botonVisita}
                </span>
              </Link>
              <a
                href={`mailto:${site.email}`}
                aria-label={t.escribenosAria}
                className="boton-tiza tiza tiza-escribe"
                style={conTiempo(ESCRIBENOS, { color: tizas.verde })}
              >
                <IconoEmail className="size-5" />
                {t.escribenos}
              </a>
              <a
                href={enlaceTel(telefonoLlamadas.numero)}
                aria-label={`${textos.menu.llamanosAria} ${formatoPantalla(telefonoLlamadas.numero)}`}
                className="boton-tiza tiza tiza-escribe text-tiza"
                style={conTiempo(LLAMAR)}
              >
                <IconoTelefono className="size-5" />
                {t.llamar}
              </a>
            </div>
          </div>

          {/* Osito pequeño como detalle (en escritorio va el grande, a la derecha). Solo decoración.
              - Móvil: abajo a la derecha (los botones van en columna y dejan ese hueco libre). Por debajo de
                360 px no cabe junto a "Llámanos" y no se pinta.
              - Tablet (sm): arriba a la derecha, junto al título. Abajo no cabe: los botones van en fila y
                "Llámanos" llega casi al borde. */}
          <JugueteTiza
            tipo="osito"
            className="absolute right-0 bottom-0 hidden size-16 rotate-8 min-[22.5rem]:block sm:hidden"
            style={conTiempo(OSITO_PEQUENO, { color: tizas.naranja })}
          />
          {/* En tablet se dibuja a la vez que el título (está a su altura), como el grande de escritorio. */}
          <JugueteTiza
            tipo="osito"
            className="absolute -top-6 -right-8 hidden size-16 rotate-8 sm:block lg:hidden"
            style={conTiempo(OSITO, { color: tizas.naranja })}
          />

          {/* A la derecha (escritorio): el osito a tiza con dos pájaros. Solo decoración. */}
          <div aria-hidden="true" className="relative mx-auto hidden size-56 lg:block">
            <JugueteTiza tipo="osito" className="absolute inset-6 -rotate-8" style={conTiempo(OSITO, { color: tizas.naranja })} />
            {/* Por encima de la cabeza del osito (sin tocar las orejas), como si volaran sobre él. */}
            <PajaroTiza className="absolute -top-10 right-4 w-10 text-tiza" style={conTiempo(PAJAROS)} />
            <PajaroTiza className="absolute -top-3 right-20 w-6 text-tiza" style={conTiempo(despues(PAJAROS, 150))} />
          </div>
        </div>
      </MarcoPizarra>
    </section>
  )
}

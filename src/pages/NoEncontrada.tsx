import { Link } from 'react-router'
import { JugueteTiza, NubeTiza, PajaroTiza, SubrayadoTiza, TextoTiza } from '../components/Tiza'
import { MarcoPizarra } from '../components/MarcoPizarra'
import { conTiempo, despues, duracionPalabras, duracionTexto, tizas } from '../components/utilidadesTiza'
import { paginas } from '../data/paginas'
import { textos } from '../data/textos'
import { useMetadatos } from '../hooks/useMetadatos'

// 404: una pizarra de aula "de las de antes" (marco de madera y bandeja con tizas y borrador), escrita a tiza
// con las mismas piezas que el menú de móvil (Tiza.tsx). Con movimiento reducido, todo aparece ya escrito.

// Colores: el 404 en morado (distinto del osito, naranja), el subrayado en verde y la nube en azul.
const { naranja: TIZA_NARANJA, azul: TIZA_AZUL, verde: TIZA_VERDE, morada: TIZA_MORADA } = tizas

// Orden de escritura: de arriba abajo y de izquierda a derecha (en milisegundos).
const MS_LETRA_TITULO = 28
const MS_LETRA_TEXTO = 7
const { titulo, texto, boton } = textos.noEncontrada

const T404 = { retraso: 0, duracion: 450 }
const PAJAROS = { retraso: 380, duracion: 300 } // a la derecha del 404
const TITULO = { retraso: 560, duracion: duracionPalabras(titulo, MS_LETRA_TITULO) }
const SUBRAYADO = { retraso: TITULO.retraso + TITULO.duracion - 60, duracion: 320 }
const TEXTO = { retraso: SUBRAYADO.retraso + 200, duracion: duracionPalabras(texto, MS_LETRA_TEXTO) }
// Al final, la "alfombra mágica": a la izquierda de la pizarra se dibujan el osito (con su interrogación) y,
// debajo, la nube "Volver al inicio" con su texto. Después cruzan volando, meciéndose, hasta su sitio (centro)
// y se quedan quietos: es el botón, y un botón que no para de moverse cuesta pulsarlo.
const OSITO = { retraso: TEXTO.retraso + TEXTO.duracion - 100, duracion: 320 }
const INTERROGACION = { retraso: OSITO.retraso + 220, duracion: 200 }
const NUBE = { retraso: INTERROGACION.retraso + 120, duracion: 420 }
const NUBE_TEXTO = { retraso: NUBE.retraso + 180, duracion: duracionTexto(boton) }
const VUELO = { retraso: NUBE_TEXTO.retraso + NUBE_TEXTO.duracion + 120, duracion: 1500 }

export function NoEncontrada() {
  useMetadatos(paginas.noEncontrada)
  return (
    // En pantallas bajas (portátil de 13", tablet en horizontal) la pizarra entera debe caber bajo el menú: el
    // margen, el "404" y el título se encogen también con el alto (svh).
    <section className="flex min-h-[70svh] items-center justify-center px-4 py-[clamp(1.5rem,4svh,4rem)]">
      <MarcoPizarra claseMarco="w-full max-w-3xl" clasePizarra="px-5 pt-[clamp(2rem,5svh,3.5rem)] pb-[clamp(1.5rem,4svh,2.5rem)] text-center sm:px-12">
          {/* Decoración: pájaros arriba a la derecha. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <PajaroTiza className="absolute top-[9%] right-[16%] w-7 text-tiza sm:w-10" style={conTiempo(PAJAROS)} />
            <PajaroTiza className="absolute top-[15%] right-[8%] w-5 text-tiza sm:w-7" style={conTiempo(despues(PAJAROS, 150))} />
          </div>

          <p
            aria-hidden="true"
            className="tiza tiza-escribe mx-auto w-fit text-[clamp(4.5rem,min(18vw,13svh),8rem)] leading-none"
            style={conTiempo(T404, { color: TIZA_MORADA })}
          >
            404
          </p>
          {/* font-tiza: el h1 hereda los títulos de la web (Fredoka) si no se le dice otra cosa. */}
          <h1 className="mt-3 font-tiza text-[clamp(2rem,min(7vw,5svh),3.4rem)] leading-tight font-normal">
            <TextoTiza texto={titulo} retraso={TITULO.retraso} msPorLetra={MS_LETRA_TITULO} />
          </h1>
          <SubrayadoTiza className="mx-auto mt-2 block h-3.5 w-[min(16rem,60%)]" style={conTiempo(SUBRAYADO, { color: TIZA_VERDE })} />
          <p className="mx-auto mt-6 max-w-xl text-[clamp(1.25rem,3.6vw,1.6rem)] leading-snug text-tiza/85">
            <TextoTiza texto={texto} retraso={TEXTO.retraso} msPorLetra={MS_LETRA_TEXTO} />
          </p>

          {/* La nube "Volver al inicio" con el osito encima, como en una alfombra mágica (.tiza-vuela, index.css).
              --desde: el borde izquierdo de la pizarra. La pizarra es un contenedor (@container): 50cqw es la
              mitad de su ancho, y 50% la mitad del de la nube (está centrada). mt grande: deja sitio al osito. */}
          <Link
            to={paginas.inicio.ruta}
            className="tiza-vuela relative mx-auto mt-[clamp(4.25rem,8svh,5rem)] sm:mt-[clamp(5rem,9svh,6rem)] grid h-22 w-[calc(5.5rem*240/110)] place-items-center active:scale-[0.97] sm:h-24 sm:w-[calc(6rem*240/110)]"
            style={conTiempo(VUELO, { '--desde': 'calc(-50cqw + 50%)' })}
          >
            {/* El osito, sentado sobre la nube, con su interrogación junto a la cabeza. */}
            <span aria-hidden="true" className="absolute top-[-2.9rem] left-[17%] flex items-start gap-0.5 sm:top-[-3.4rem]">
              <JugueteTiza tipo="osito" className="size-14 -rotate-8 sm:size-16" style={conTiempo(OSITO, { color: TIZA_NARANJA })} />
              <span className="tiza tiza-escribe -mt-1 text-3xl sm:text-4xl" style={conTiempo(INTERROGACION)}>
                ?
              </span>
            </span>
            <NubeTiza className="absolute inset-0 size-full" style={conTiempo(NUBE, { color: TIZA_AZUL })} />
            <span className="tiza tiza-escribe relative mt-1 -rotate-2 text-[1.6rem] sm:text-[1.8rem]" style={conTiempo(NUBE_TEXTO)}>
              {boton}
            </span>
          </Link>
      </MarcoPizarra>
    </section>
  )
}

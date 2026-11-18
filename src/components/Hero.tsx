import { motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router'
import rotuloEscuela from '../assets/logo-rotulo-escuela.webp'
import rotuloEscuela700 from '../assets/logo-rotulo-escuela-700.webp'
import rotuloNubes from '../assets/logo-rotulo-nubes.webp'
import rotuloNubes700 from '../assets/logo-rotulo-nubes-700.webp'
import { rutaSolicitarVisita } from '../data/paginas'
import { site } from '../data/site'
import { textos } from '../data/textos'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { ArbolHero } from './ArbolHero'
import { BALANCEO_BOTON, balanceoNube } from './balanceo'
import { Nube } from './Decoracion'
import { SelloMatricula } from './SelloMatricula'
import { SocialLinks } from './SocialLinks'

export function Hero() {
  const zonaRef = useRef<HTMLDivElement>(null)
  const seccionRef = useRef<HTMLElement>(null)
  const reducido = usePrefersReducedMotion()
  const arrastrable = useMediaQuery('(min-width: 768px)') // tablet y escritorio (md de Tailwind)

  // El hero se queda ANCLADO (sticky) mientras se hace scroll por una "zona" algo más alta que la
  // pantalla: así el árbol se mece y los pájaros salen sin que la página se vaya. scrollYProgress va de
  // 0 (empieza el anclaje) a 1 (termina y la página sigue bajando). Lo usa el árbol (ArbolHero).
  const { scrollYProgress } = useScroll({ target: zonaRef, offset: ['start start', 'end end'] })

  return (
    // Zona: el alto de la pantalla + 60 % más de recorrido anclado. Con movimiento reducido no hay
    // efecto que ver, así que no se ancla (sin alto extra).
    // data-zona-hero: el header la usa para saber si se está en el hero (allí, al parar el scroll, vuelve a salir).
    <div ref={zonaRef} data-zona-hero className={reducido ? '' : 'h-[calc(160svh-4.5rem)]'}>
    <section
      ref={seccionRef}
      // overflow-clip, no overflow-hidden (2026-11-17): recorta igual lo que asoma (nubes, pájaros), pero con hidden Safari
      // del iPhone trataba el hero anclado como una caja con scroll propio y lo movía a tirones al subir (temblaba).
      className="sticky top-18 isolate flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center overflow-clip px-4 pt-6 pb-10 text-center"
    >
      {/* Nubes grandes del cielo: no se mueven con el scroll (lo que se mueve es el árbol, ArbolHero). En reposo, cada
          una se mece un poco a los lados (.balancea, con su distancia y su ritmo: balanceo.ts). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Nube className="balancea absolute top-[5%] -left-10 w-40 text-azul-suave sm:top-[12%] sm:left-[6%] sm:w-56" style={balanceoNube(16, 4.8)} />
        <Nube className="balancea absolute top-[46%] -right-12 w-44 text-ciruela-suave sm:right-[5%] sm:w-64" style={balanceoNube(-14, 4.5)} />
        <Nube className="balancea absolute bottom-[14%] left-[8%] hidden w-36 text-mostaza-suave md:block" style={balanceoNube(12, 4.9)} />
      </div>

      {/* Logo en el centro. Escritorio (lg): el sello va pegado a la derecha del árbol y el botón
          "Solicitar visita" no sale aquí (ya está en el header). Móvil y tablet: sello y botón en fila debajo. */}
      <div className="relative flex flex-col items-center">
          <h1 className="flex flex-col items-center">
            <span className="sr-only">{site.nombre}</span>
            {/* srcSet + sizes (2026-11-18): el navegador elige la de 700 o la de 1100 según el ancho al que se ve (los
                tamaños de sizes son los topes de las clases de abajo) y la densidad de la pantalla. */}
            <img src={rotuloEscuela} srcSet={`${rotuloEscuela700} 700w, ${rotuloEscuela} 1100w`} sizes="(min-width: 112.5rem) 54rem, (min-width: 96rem) 40rem, (min-width: 64rem) 34rem, (min-width: 48rem) 30rem, min(84vw, 26rem)" alt="" width={1100} height={315} className="h-auto w-[min(84vw,26rem)] md:w-[min(84vw,calc((100svh-4.5rem)*0.62),30rem)] lg:w-[min(84vw,calc((100svh-4.5rem)*0.62),34rem)] 2xl:w-[min(84vw,calc((100svh-4.5rem)*0.62),40rem)] 3xl:w-[min(84vw,calc((100svh-4.5rem)*0.62),54rem)]" />
            <ArbolHero
              progreso={scrollYProgress}
              className="mt-[-2%] w-[min(56vw,calc((100svh-26rem)*0.745),16.5rem)] md:w-[min(56vw,calc((100svh-4.5rem)*0.39),19rem)] lg:w-[min(56vw,calc((100svh-4.5rem)*0.39),21.5rem)] 2xl:w-[min(56vw,calc((100svh-4.5rem)*0.39),25rem)] 3xl:w-[min(56vw,calc((100svh-4.5rem)*0.39),34rem)]"
            />
            <img src={rotuloNubes} srcSet={`${rotuloNubes700} 700w, ${rotuloNubes} 1100w`} sizes="(min-width: 112.5rem) 53rem, (min-width: 96rem) 39rem, (min-width: 64rem) 33rem, (min-width: 48rem) 29rem, min(82vw, 25rem)" alt="" width={1100} height={269} className="mt-[-6%] h-auto w-[min(82vw,25rem)] md:w-[min(82vw,calc((100svh-4.5rem)*0.6),29rem)] lg:w-[min(82vw,calc((100svh-4.5rem)*0.6),33rem)] 2xl:w-[min(82vw,calc((100svh-4.5rem)*0.6),39rem)] 3xl:w-[min(82vw,calc((100svh-4.5rem)*0.6),53rem)]" />
          </h1>

          {/* md:contents: desde tablet este div "desaparece" y el sello se coloca respecto al logo. */}
          <div className="mt-5 flex items-center gap-4 md:contents">
            {/* Desde tablet: a la izquierda del árbol y se puede arrastrar por el hero (dragConstraints:
                no sale de la sección). En móvil, fijo: arrastrarlo chocaría con el scroll de la página. */}
            <motion.div
              drag={arrastrable}
              dragConstraints={seccionRef}
              dragElastic={0.12}
              dragMomentum={!reducido} // la inercia al soltar es movimiento: fuera con movimiento reducido
              dragTransition={{ power: 0.12, timeConstant: 160 }} // inercia corta: se desliza un poco y se para
              whileDrag={reducido ? undefined : { scale: 1.06 }}
              className="size-24 shrink-0 md:absolute md:top-[34%] md:right-full md:mr-2 md:size-32 md:cursor-grab md:touch-none md:active:cursor-grabbing lg:mr-6 lg:size-40 3xl:size-52"
            >
              <SelloMatricula className="size-full" />
            </motion.div>
            <Link to={rutaSolicitarVisita} className="boton boton-visita balancea px-7 text-lg menu:hidden" style={BALANCEO_BOTON}>
              {textos.hero.botonVisita}
            </Link>
          </div>
      </div>

      {/* Redes en la esquina de abajo a la derecha, en todos los tamaños. */}
      <SocialLinks tamano="pequeno" className="absolute right-2 bottom-2 md:right-4 md:bottom-4 lg:right-6 lg:bottom-6" />
    </section>
    </div>
  )
}

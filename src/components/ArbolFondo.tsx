import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation } from 'react-router'
import arbol from '../assets/logo-arbol.webp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { cuandoEsteLibre } from '../utils/cuandoEsteLibre'

// Proporciones de logo-arbol.webp (600 × 805): la copa ocupa hasta y = 508, las raíces desde y = 690,
// y el tronco está en x = 288,75 (medido sobre logo-arbol.webp, que ahora mide 720 × 965: el tronco ocupa
// x = 344-349, centro 346,5 → 346,5 / 720 = 48,1 %; antes ponía 290, el 48,3 %, y quedaba 2-3 px desplazado).
const ANCHO_LOGO = 600
const ALTO_COPA = 508
const ALTO_RAICES = 115
const ALTO_LOGO = 805 // alto total del logo (copa, tronco y raíces), en la misma escala
const X_TRONCO = (346.5 / 720) * ANCHO_LOGO
// Grosor del tronco del logo, medido sobre el original: 21 px de 3039 de ancho (≈ 0,69 % del árbol).
const GROSOR_TRONCO = 21 / 3039
// Dónde se abren las raíces en su imagen (en % de su alto, desde arriba): hasta ahí, la imagen solo trae un trocito
// de tronco, que se esconde y lo sustituye la prolongación del tronco de la página (ver la unión, más abajo).
const CORTE_RAICES = 14.5
// Cuánto antes de la línea del © terminan las raíces (px).
const MARGEN_RAICES = 24
// Franja del tronco que se esconde en la imagen de las raíces (en % de su ancho): un poco más ancha que el tronco
// (47,8-48,5 %), para no dejar bordes. Solo esa franja: las raíces laterales que suben hasta arriba quedan enteras.
const FRANJA_TRONCO = { desde: 47.2, hasta: 49.1 }

// --- Ramas con hojas que crecen al bajar (idea de Antonio) ---
// Una rama cada SEPARACION_RAMAS px de tronco (la primera, PRIMERA_RAMA px por debajo de la copa), alternando
// derecha e izquierda. Crecen MIENTRAS se baja con el scroll (solo las que ya han entrado en pantalla), poco a poco,
// hasta 1 (su tamaño completo). Si se para el scroll, se quedan quietas; al subir no
// encogen. Al cambiar de página, la nueva empieza sin ramas. Con movimiento reducido, todas crecidas y quietas.
// Separación mínima entre dos ramas (px de tronco) y desde dónde se empieza a buscar sitio.
const SEPARACION_RAMAS = 450
const PRIMERA_RAMA = 60
// Paso con el que se busca un hueco libre bajando por el tronco, y aire alrededor de lo que tapa (px).
const PASO_BUSQUEDA = 20
const AIRE = 12
// Rama: mide el 26 % del ancho del árbol y su dibujo es 200 × 120 (alto = 0,6 × ancho).
const ANCHO_RAMA = 0.26
const ALTO_RAMA = 0.6

type RamaColocada = { arriba: number; lado: 'derecha' | 'izquierda' }

// Transparencia de un color de fondo calculado ("rgba(0, 0, 0, 0)", "oklab(… / 0.9)", "rgb(…)"…): 0 = no tapa.
function opacidadFondo(color: string): number {
  if (color === 'transparent') return 0
  const alfa = color.match(/(?:\/|,)\s*([\d.]+)(%?)\s*\)$/)
  if (!alfa || color.startsWith('rgb(')) return 1 // rgb(…) sin alfa: opaco
  return parseFloat(alfa[1]) / (alfa[2] ? 100 : 1)
}

// Lo que tapa a una rama dentro de <main>: imágenes, dibujos (svg), lienzos, mapas, botones y campos, cualquier caja
// con fondo de color o imagen, y el texto (una rama asomando por detrás de un párrafo queda sucia). Rectángulos en
// coordenadas de la pantalla.
function loQueTapa(main: HTMLElement): DOMRect[] {
  const etiquetas = new Set(['IMG', 'CANVAS', 'IFRAME', 'VIDEO', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'svg'])
  const rects: DOMRect[] = []
  for (const el of main.querySelectorAll('*')) {
    const svgPadre = el.closest('svg')
    if (svgPadre && svgPadre !== el) continue // lo de dentro de un dibujo ya cuenta con el dibujo entero
    const estilo = getComputedStyle(el)
    if (estilo.display === 'none' || estilo.visibility === 'hidden') continue
    const tapa =
      etiquetas.has(el.tagName) ||
      estilo.backgroundImage !== 'none' ||
      opacidadFondo(estilo.backgroundColor) > 0.05 ||
      [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
    if (!tapa) continue
    const r = el.getBoundingClientRect()
    if (r.width >= 2 && r.height >= 2) rects.push(r) // fuera lo de 1 px (textos solo para lectores de pantalla)
  }
  return rects
}

// Dónde caben las ramas a lo largo del tronco sin quedar debajo de nada (px desde arriba del tronco). Ninguna a menos
// de 200 px del final (ahí empiezan las raíces).
function huecosLibres(tronco: HTMLElement, main: HTMLElement): RamaColocada[] {
  const caja = tronco.getBoundingClientRect()
  const xTronco = caja.left + caja.width * (X_TRONCO / ANCHO_LOGO)
  const ancho = caja.width * ANCHO_RAMA
  const alto = ancho * ALTO_RAMA
  const obstaculos = loQueTapa(main)
  const libre = (arriba: number, lado: RamaColocada['lado']) => {
    const izquierda = lado === 'derecha' ? xTronco : xTronco - ancho
    const top = caja.top + arriba
    return !obstaculos.some(
      (o) => o.left - AIRE < izquierda + ancho && o.right + AIRE > izquierda && o.top - AIRE < top + alto && o.bottom + AIRE > top,
    )
  }
  const ramas: RamaColocada[] = []
  let preferido: RamaColocada['lado'] = 'derecha'
  for (let y = PRIMERA_RAMA; y <= caja.height - 200 - alto; ) {
    const otro: RamaColocada['lado'] = preferido === 'derecha' ? 'izquierda' : 'derecha'
    const lado: RamaColocada['lado'] | null = libre(y, preferido) ? preferido : libre(y, otro) ? otro : null
    if (!lado) {
      y += PASO_BUSQUEDA
      continue
    }
    ramas.push({ arriba: Math.round(y), lado })
    preferido = lado === 'derecha' ? 'izquierda' : 'derecha'
    y += SEPARACION_RAMAS
  }
  return ramas
}
// CRECE_EN: cuántas pantallas hay que bajar para que una rama crezca entera. ENTRA: empieza a crecer cuando su
// parte de arriba pasa por encima de este punto de la pantalla (0 = arriba, 1 = abajo). SUAVIZADO: qué parte de lo
// que le falta avanza en cada fotograma (crecimiento suave).
const CRECE_EN = 0.45
const ENTRA = 0.85
const SUAVIZADO = 0.12
// Desde dónde escala la rama (en parte de su alto, desde arriba): el 92 % del transform-origin de .rama-cuerpo
// (index.css). Si cambia allí, cambiarlo aquí.
const ORIGEN_Y = 0.92
// Las hojas brotan cuando la rama ya va por la mitad (de 0,45 a 1 de su crecimiento).
const brote = (crecimiento: number) => Math.min(1, Math.max(0, (crecimiento - 0.45) / 0.55))

// Hoja en forma de gota, como las del logo: el pico (arriba, en 10,1) es por donde se une a la ramita.
const GOTA = 'M10 1C14 9 18 14 18 19a8 8 0 0 1-16 0C2 14 6 9 10 1Z'
// Ramita con su hoja: la hoja se coloca con el pico en (x, y) y girada "giro" grados.
const hojasRama = [
  { x: 186, y: 22, giro: 120, tam: 1.25 },
  { x: 122, y: 44, giro: 160, tam: 1 },
  { x: 150, y: 66, giro: 70, tam: 0.9 },
  { x: 72, y: 76, giro: 140, tam: 0.85 },
] as const

// Una rama: sale del tronco (abajo a la izquierda del dibujo, en 2,110) y crece hacia arriba y hacia fuera, con
// dos ramitas y sus hojas. Mide el 26 % del ancho de la copa (Antonio: más largas no guardaban proporción con ella). Las de la izquierda son la misma, en espejo. Clases .rama-* en index.css: el cuerpo
// escala con --g (crecimiento) desde el tronco, y cada hoja con --h (brote) desde su pico.
function Rama({ lado, arriba }: { lado: 'derecha' | 'izquierda'; arriba: number }) {
  const posicion = (X_TRONCO / ANCHO_LOGO) * 100
  return (
    <div
      className="absolute w-[26%] opacity-[0.07]"
      style={{
        top: arriba,
        ...(lado === 'derecha' ? { left: `${posicion}%` } : { right: `${100 - posicion}%`, scale: '-1 1' }),
      }}
    >
      <svg viewBox="0 0 200 120" className="rama-cuerpo block w-full overflow-visible" fill="none" stroke="var(--color-verde)" strokeLinecap="round">
        <path d="M2 110C60 104 120 80 186 22" strokeWidth="5" />
        <path d="M92 86C104 70 112 58 122 44" strokeWidth="3" />
        <path d="M130 70c8-2 14-3 20-4M60 99c4-8 8-15 12-23" strokeWidth="2.5" />
        {hojasRama.map(({ x, y, giro, tam }) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${giro}) scale(${tam})`}>
            <g className="rama-hoja">
              <path d={GOTA} transform="translate(-10 -1)" fill="var(--color-verde)" stroke="none" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  )
}

// "Sombra" del logo: su silueta recorta un fondo verde liso (máscara CSS). Reutiliza la misma imagen
// del hero, que el navegador ya tiene descargada, así que no añade peso.
const sombra = (posicion: 'top' | 'bottom'): CSSProperties => ({
  maskImage: `url(${arbol})`,
  maskPosition: posicion,
  maskSize: '100% auto',
  maskRepeat: 'no-repeat',
})

/**
 * Árbol de marca de agua: copa arriba, tronco a lo largo de la página y raíces en el footer.
 * Va dentro de un contenedor "relative" que envuelve el main y el footer (Layout.tsx).
 * En Inicio empieza debajo del elemento marcado con data-arbol-empieza (hero + barra de datos).
 */
export function ArbolFondo() {
  const capaRef = useRef<HTMLDivElement>(null)
  const raicesRef = useRef<HTMLDivElement>(null)
  const troncoRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const reducido = usePrefersReducedMotion()
  // Alto del tronco (redondeado a 50 px, para no volver a pintar por cualquier píxel): de él sale cuántas ramas caben.
  const [altoTronco, setAltoTronco] = useState(0)
  // Crecimiento de cada rama (0-1), por su número: la meta y lo que se ve (ver el efecto del scroll). En una ref:
  // cambia en cada scroll y no hace falta volver a pintar el componente.
  // Por la posición de la rama (y no por su número): si las ramas se recolocan, la que ya había crecido sigue igual.
  const crecimiento = useRef({ meta: new Map<number, number>(), mostrado: new Map<number, number>() })

  // Dónde empieza la copa y dónde acaba el tronco. Se escribe directamente en el estilo (sin estado de
  // React: no hace falta volver a pintar el componente) y se recalcula si cambia el alto de la página.
  useLayoutEffect(() => {
    const capa = capaRef.current
    const raices = raicesRef.current
    const contenedor = capa?.parentElement
    if (!capa || !raices || !contenedor) return
    const colocar = () => {
      const caja = contenedor.getBoundingClientRect()
      // Arriba: debajo de la marca (en Inicio, tras el hero y la barra de datos); si no hay, desde arriba.
      // Más un margen para que la copa no quede pegada a la barra de navegación (ni a la barra de datos):
      // en proporción al alto de la pantalla, entre 24 y 56 px (como un clamp(24px, 5svh, 56px)).
      const marca = contenedor.querySelector<HTMLElement>('[data-arbol-empieza]')
      const separacion = Math.min(56, Math.max(24, window.innerHeight * 0.05))
      const arriba = (marca ? marca.getBoundingClientRect().bottom - caja.top : 0) + separacion
      // Abajo: el tronco acaba justo donde empieza el footer y las raíces nacen ahí, dentro del footer.
      const footer = contenedor.querySelector('footer')
      const inicioFooter = footer ? footer.getBoundingClientRect().top - caja.top : caja.height
      // Tamaño de las raíces (Antonio: que lleguen casi hasta la línea del ©, en móvil también, donde el footer es
      // mucho más alto). Alto que hace falta: del principio del footer a esa línea (data-raices-hasta), menos un
      // margen. Para llegar, la imagen crece entera (alto y ancho, con su proporción) entre el doble y el triple del
      // árbol; si aún le falta alto, se estira solo a lo alto (salvo en móvil): las raíces se alargan hacia abajo sin
      // engordar el tronco (creciendo entera hasta el final, en móvil eran trazos enormes). "escala" = ancho de las raíces / ancho del árbol: con ella se ensancha también el
      // pie del tronco (ver el tronco, abajo), para que encaje sin escalón con unas raíces más grandes.
      const arbolCaja = raices.parentElement?.getBoundingClientRect()
      const linea = footer?.querySelector<HTMLElement>('[data-raices-hasta]')
      if (footer && arbolCaja && linea) {
        const altoNecesario = linea.getBoundingClientRect().top - footer.getBoundingClientRect().top - MARGEN_RAICES
        const ancho = Math.min(arbolCaja.width * 3, Math.max(arbolCaja.width * 2, (altoNecesario * ANCHO_LOGO) / ALTO_RAICES))
        raices.style.width = `${Math.round(ancho)}px`
        raices.style.aspectRatio = 'auto'
        // En móvil (menos de 640 px) no se estiran (Antonio: estiradas quedaban mal): a su tamaño natural, en la parte
        // de arriba del footer.
        const altoNatural = (ancho * ALTO_RAICES) / ANCHO_LOGO
        const estirar = window.innerWidth >= 640
        raices.style.height = `${Math.round(estirar ? Math.max(altoNecesario, altoNatural) : altoNatural)}px`
        // Que el tronco de la imagen (en el X_TRONCO de su ancho) caiga bajo el tronco del árbol.
        raices.style.marginLeft = `${Math.round((X_TRONCO / ANCHO_LOGO) * (arbolCaja.width - ancho))}px`
        capa.style.setProperty('--escala-raices', String(ancho / arbolCaja.width))
      }
      const abajo = caja.height - inicioFooter - raices.getBoundingClientRect().height
      capa.style.top = `${Math.round(arriba)}px`
      capa.style.bottom = `${Math.round(abajo)}px`
      const tronco = troncoRef.current
      if (tronco) setAltoTronco(Math.round(tronco.getBoundingClientRect().height / 50) * 50)
    }
    colocar()
    const observador = new ResizeObserver(colocar)
    observador.observe(contenedor)
    return () => observador.disconnect()
  }, [pathname])

  // Dónde va cada rama: solo donde se ve (Antonio, 2026-11-17: crecían debajo de fotos, tarjetas o la pizarra y no se
  // veían). El árbol va DETRÁS del contenido, así que se hace un mapa de lo que tapa (huecosLibres, abajo) y cada rama
  // se coloca donde su recuadro entero queda libre: prueba primero el lado que toca (alternando) y, si no, el otro; si
  // no cabe en ninguno, sigue bajando. Se recalcula cuando cambia el tamaño de la página (lo de abajo de Inicio se
  // monta un poco después, las fotos cargan…), cuando el navegador queda libre.
  const [ramas, setRamas] = useState<RamaColocada[]>([])
  useEffect(() => {
    const tronco = troncoRef.current
    const main = document.getElementById('contenido')
    if (!tronco || !main || altoTronco === 0) return
    let cancelar = () => {}
    const buscar = () => {
      const nuevas = huecosLibres(tronco, main)
      // Solo se vuelve a pintar si ha cambiado algo.
      setRamas((antes) => (JSON.stringify(antes) === JSON.stringify(nuevas) ? antes : nuevas))
    }
    const programar = () => {
      cancelar()
      cancelar = cuandoEsteLibre(buscar)
    }
    programar()
    const observador = new ResizeObserver(programar)
    observador.observe(main)
    return () => {
      cancelar()
      observador.disconnect()
    }
  }, [altoTronco, pathname])

  // Al cambiar de página, la nueva empieza sin ramas crecidas.
  useEffect(() => {
    crecimiento.current = { meta: new Map(), mostrado: new Map() }
  }, [pathname])

  // El crecimiento con el scroll. Escribe --g (rama) y --h (hojas) directamente en el estilo de cada rama.
  // Dos valores por rama (2026-11-13, Antonio: antes crecían de golpe y antes de verse):
  //   - meta: hasta dónde debe llegar. La sube el scroll hacia abajo, solo si la rama ya ha entrado en pantalla
  //     (por encima del ENTRA de su alto) y en proporción a lo bajado (CRECE_EN pantallas para completarse).
  //   - mostrado: lo que se ve. En cada fotograma se acerca un SUAVIZADO de lo que le falta: así crece de forma
  //     continua aunque la rueda del ratón vaya a saltos, y se para enseguida cuando se para el scroll.
  // Ninguno baja nunca: al subir no encogen.
  useEffect(() => {
    const tronco = troncoRef.current
    if (!tronco) return
    const cuerpos = Array.from(tronco.querySelectorAll<SVGSVGElement>('.rama-cuerpo'))
    // La clave de cada rama, su posición (en el mismo orden que se pintan).
    const clave = (i: number) => ramas[i]?.arriba ?? -1
    const pintar = (i: number, g: number) => {
      cuerpos[i].style.setProperty('--g', String(g))
      cuerpos[i].style.setProperty('--h', String(brote(g)))
    }
    if (reducido) {
      cuerpos.forEach((_, i) => pintar(i, 1))
      return
    }
    const { meta, mostrado } = crecimiento.current
    cuerpos.forEach((_, i) => pintar(i, mostrado.get(clave(i)) ?? 0))
    let ultimoY = window.scrollY
    let fotograma = 0

    // Dónde está cada rama en la página (px desde arriba del documento y su alto), medido una vez y al cambiar el
    // tamaño de la página, no en cada scroll: preguntar al navegador por la posición justo después de pintar le obliga
    // a recalcular la página en cada evento (auditoría de Impeccable, 2026-11-17). Se mide el div que envuelve a la
    // rama, que no está escalado.
    let cajas: { top: number; alto: number }[] = []
    const medir = () => {
      const y = window.scrollY
      cajas = cuerpos.map((cuerpo) => {
        const r = (cuerpo.parentElement ?? cuerpo).getBoundingClientRect()
        return { top: r.top + y, alto: r.height }
      })
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(document.body)

    // Acerca lo que se ve a la meta; sigue pidiendo fotogramas mientras a alguna rama le falte.
    const animar = () => {
      fotograma = 0
      let falta = false
      cuerpos.forEach((_, i) => {
        const objetivo = meta.get(clave(i)) ?? 0
        const ahora = mostrado.get(clave(i)) ?? 0
        if (objetivo - ahora < 0.002) {
          if (ahora !== objetivo) {
            mostrado.set(clave(i), objetivo)
            pintar(i, objetivo)
          }
          return
        }
        const nuevo = ahora + (objetivo - ahora) * SUAVIZADO
        mostrado.set(clave(i), nuevo)
        pintar(i, nuevo)
        falta = true
      })
      if (falta) fotograma = requestAnimationFrame(animar)
    }

    const alHacerScroll = () => {
      const y = window.scrollY
      const bajado = y - ultimoY
      ultimoY = y
      if (bajado <= 0) return // al subir (o sin moverse) no pasa nada: no encogen
      const alto = window.innerHeight
      let crece = false
      cuerpos.forEach((_, i) => {
        // Las que ya han crecido del todo no tienen nada que hacer (va en cada evento de scroll: cuanto menos, mejor).
        const k = clave(i)
        const hasta = meta.get(k) ?? 0
        if (hasta >= 1) return
        // El recuadro de la rama tal como se ve (escalada por lo que ya ha crecido, desde su origen: ORIGEN_Y).
        const { top, alto: altoRama } = cajas[i] ?? { top: 0, alto: 0 }
        const g = mostrado.get(k) ?? 0
        const origen = top - y + altoRama * ORIGEN_Y
        const arriba = origen - altoRama * ORIGEN_Y * g
        const abajo = origen + altoRama * (1 - ORIGEN_Y) * g
        if (arriba > alto * ENTRA || abajo < 0) return // solo las que ya han entrado en pantalla
        meta.set(k, Math.min(1, hasta + bajado / (alto * CRECE_EN)))
        crece = true
      })
      // Solo se piden fotogramas si alguna rama tiene que crecer.
      if (crece && !fotograma) fotograma = requestAnimationFrame(animar)
    }
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', alHacerScroll)
      observador.disconnect()
      cancelAnimationFrame(fotograma)
    }
  }, [pathname, reducido, ramas])

  return (
    <div ref={capaRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-10 flex justify-center overflow-hidden">
      <div className="flex h-full w-[min(92vw,34rem)] flex-col">
        <div className="w-full shrink-0 bg-verde opacity-[0.05]" style={{ aspectRatio: `${ANCHO_LOGO} / ${ALTO_COPA}`, ...sombra('top') }} />
        {/* Tronco: ocupa todo el alto libre entre la copa y el principio del footer. Es cónico, como un
            tronco de verdad: arriba mide lo mismo que el tronco de la copa (escala 1×) y abajo lo mismo que
            el de las raíces (escala 2×), así no hay saltos de grosor en ninguno de los dos extremos.
            El div mide el grosor de abajo y clip-path lo estrecha a la mitad por arriba. Color al 5 %, como la copa. */}
        {/* Tronco FIJO (Antonio, 2026-11-12): ya no se dibuja con el scroll; se veía "cortado" a media pantalla.
            Lo que crece al bajar son las ramas con hojas (Rama, arriba). */}
        <div ref={troncoRef} className="relative min-h-0 flex-1">
          {ramas.map(({ arriba, lado }) => (
            <Rama key={arriba} arriba={arriba} lado={lado} />
          ))}
          <div
            className="absolute inset-y-0 -translate-x-1/2"
            style={{
              left: `${(X_TRONCO / ANCHO_LOGO) * 100}%`,
              // Abajo mide lo que el tronco de las raíces (GROSOR × escala del árbol; escala ≥ 2, la calcula colocar) y
              // arriba lo que el de la copa (escala 1): por eso clip-path lo estrecha arriba a 1 / escala de su ancho.
              width: `calc(${GROSOR_TRONCO * 100}% * var(--escala-raices, 2))`,
              clipPath: 'polygon(calc(50% - 50% / var(--escala-raices, 2)) 0, calc(50% + 50% / var(--escala-raices, 2)) 0, 100% 100%, 0 100%)',
              background: 'color-mix(in oklab, var(--color-verde) 5%, transparent)',
            }}
          />
        </div>
        {/* Raíces: el footer son las raíces de la web. Nacen del pie del tronco y se extienden por el
            footer, al doble de tamaño. Para que el pie del tronco del logo (48,3 % de su ancho) caiga
            justo bajo el tronco: ancho 200 % y margen izquierdo -48,3 %. Algo más visibles (12 %)
            porque el fondo verde del footer las apaga. */}
        {/* Unión con el tronco (2026-11-13; antes se notaba el cambio): el tronco ATRAVIESA el borde del footer.
            - La imagen de las raíces trae arriba un trocito de tronco propio. Se esconde SOLO esa franja estrecha
              (FRANJA_TRONCO), hasta el CORTE_RAICES de su alto, donde se une a las raíces; las raíces laterales que
              suben hasta arriba quedan enteras (antes un corte de lado a lado se las comía).
            - En su lugar, el tronco sigue dentro del footer (div "prolongación"): mismo grosor y misma posición
              que el pie del tronco de la página, y el color de las raíces (12 %), hasta ese mismo corte.
            Todo en porcentajes del árbol: encaja igual en móvil, tablet y escritorio. El único cambio de color
            queda justo en el borde del footer, donde también cambia el fondo (crema → verde): ahí se ve natural. */}
        <div
          ref={raicesRef}
          className="relative w-[200%] shrink-0"
          // Ancho y margen: los iniciales (el doble del árbol); colocar los ajusta para que lleguen a la línea del ©.
          style={{ marginLeft: `-${(X_TRONCO / ANCHO_LOGO) * 100}%`, aspectRatio: `${ANCHO_LOGO} / ${ALTO_RAICES}` }}
        >
          <div
            className="absolute inset-0 bg-verde opacity-[0.12]"
            style={{
              // Tres capas: la imagen, INTERSECTADA con (la parte de arriba MENOS la franja del tronco, SUMADA a toda
              // la parte de abajo). Así solo se esconde el trocito de tronco de la imagen, no las raíces de los lados.
              maskImage: `url(${arbol}), linear-gradient(to right, #000 ${FRANJA_TRONCO.desde}%, transparent ${FRANJA_TRONCO.desde}%, transparent ${FRANJA_TRONCO.hasta}%, #000 ${FRANJA_TRONCO.hasta}%), linear-gradient(#000, #000)`,
              maskPosition: 'bottom, top, bottom',
              // La imagen mide 7 veces el alto de la caja (ALTO_LOGO / ALTO_RAICES) y se apoya abajo: así se ven solo sus
              // raíces, y si la caja es más alta que su proporción, las raíces se estiran a lo alto.
              maskSize: `100% ${(ALTO_LOGO / ALTO_RAICES) * 100}%, 100% ${CORTE_RAICES}%, 100% ${100 - CORTE_RAICES}%`,
              maskRepeat: 'no-repeat',
              maskComposite: 'intersect, add',
              WebkitMaskComposite: 'source-in, source-over', // Safari usa el nombre antiguo
            }}
          />
          {/* Prolongación del tronco. Dentro de este div (el doble de ancho que el árbol), el tronco está en el
              48,3 % y su grosor de abajo (2 × GROSOR_TRONCO del árbol) es GROSOR_TRONCO de este ancho. */}
          <div
            className="absolute top-0 -translate-x-1/2"
            style={{
              left: `${(X_TRONCO / ANCHO_LOGO) * 100}%`,
              width: `${GROSOR_TRONCO * 100}%`,
              height: `${CORTE_RAICES}%`,
              // Degradado (Antonio: en el borde se veía corte y cambio de tono): empieza al 5 %, como el tronco de
              // encima, y se oscurece hasta el 12 % de las raíces, donde se une con ellas. Sin escalones.
              background: 'linear-gradient(color-mix(in oklab, var(--color-verde) 5%, transparent), color-mix(in oklab, var(--color-verde) 12%, transparent))',
            }}
          />
        </div>
      </div>
    </div>
  )
}

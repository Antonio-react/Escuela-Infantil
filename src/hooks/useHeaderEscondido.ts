import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

// El header se esconde al bajar con el scroll y vuelve a aparecer al subir (Antonio), en toda la web y en todos los
// dispositivos: se gana su alto para ver el contenido (sobre todo en pantallas bajas). Devuelve true si debe estar
// escondido.
// - Arriba del todo, siempre visible.
// - En el hero de Inicio (la zona anclada, [data-zona-hero]) también se esconde al bajar, pero en cuanto se deja de
//   hacer scroll vuelve a aparecer (el hero se queda quieto ahí y el menú tiene que estar a mano).
// - Hace falta moverse unos px en el mismo sentido para cambiar (sin parpadeos con movimientos pequeños del dedo).
// - Con el foco DEL TECLADO dentro del header, se queda visible (se ve lo que se está enfocando). El de un clic, no.
const UMBRAL_SENTIDO = 8
const ARRIBA = 8 // px: "arriba del todo"
const PAUSA_HERO = 250 // ms sin scroll en el hero para que vuelva a salir

export function useHeaderEscondido(header: React.RefObject<HTMLElement | null>, forzarVisible: boolean): boolean {
  const { pathname } = useLocation()
  // El estado va con la página a la que pertenece: al cambiar de página deja de valer y el header sale visible (se
  // empieza arriba), sin tener que ponerlo a false a mano en un efecto.
  const [estado, setEstado] = useState({ ruta: pathname, escondido: false })
  const escondido = estado.ruta === pathname && estado.escondido
  // El último valor que se ha pedido (escondido o no), compartido por los dos efectos de abajo.
  const ultimoValor = useRef<boolean | null>(null)

  useEffect(() => {
    let ultimo = window.scrollY
    let pendiente = false
    let pausa: ReturnType<typeof setTimeout> | undefined
    // Todo lo de aquí corre en cada fotograma del scroll, así que es lo más barato posible (medido en el móvil,
    // 2026-11-17: el header era casi la mitad del trabajo del scroll):
    // - Solo cambia el estado si cambia algo: si se devuelve el mismo objeto, React no vuelve a pintar. Antes creaba
    //   un objeto nuevo en cada fotograma y el header entero (enlaces, juguetes, nube) se pintaba 60 veces por segundo.
    //   Además, una copia del último valor (ultimoValor) evita incluso llamar a React mientras no cambie.
    ultimoValor.current = null
    const poner = (valor: boolean) => {
      if (ultimoValor.current === valor) return
      ultimoValor.current = valor
      setEstado((antes) => (antes.ruta === pathname && antes.escondido === valor ? antes : { ruta: pathname, escondido: valor }))
    }
    // ¿Hay foco DE TECLADO dentro del header? (:focus-visible). Solo ese cuenta: tras pulsar un enlace del menú con el
    // ratón o el dedo, el enlace se queda con el foco y, si contara, el header no se escondía nunca (Antonio).
    // Se mira solo el elemento con el foco: buscar :focus-visible en todo el header (querySelector) obligaba al
    // navegador a recalcular los estilos en cada fotograma.
    const focoDeTeclado = () => {
      const activo = document.activeElement
      return !!activo && !!header.current?.contains(activo) && activo.matches(':focus-visible')
    }

    // ¿Está el scroll dentro de la zona anclada del hero? (solo existe en Inicio). Dónde acaba la zona (en px desde
    // arriba de la página) se mide una vez y al cambiar el tamaño de la ventana, no en cada fotograma: medirla
    // (getBoundingClientRect) obligaba a recalcular la página. La página llega un poco después que el header (se
    // carga aparte), así que se busca hasta encontrarla.
    let zona: Element | null = null
    let finZona = 0
    const medirZona = () => {
      if (!zona?.isConnected) zona = document.querySelector('[data-zona-hero]')
      finZona = zona ? zona.getBoundingClientRect().bottom + window.scrollY : 0
    }
    const enHero = () => {
      if (!zona?.isConnected) medirZona()
      return !!zona && finZona > window.scrollY + window.innerHeight
    }
    const alCambiarTamano = () => medirZona()

    const revisar = () => {
      pendiente = false
      const y = window.scrollY
      const cambio = y - ultimo
      if (y <= ARRIBA) {
        poner(false)
        ultimo = y
      } else if (Math.abs(cambio) >= UMBRAL_SENTIDO) {
        poner(cambio > 0 && !focoDeTeclado())
        ultimo = y
      }
      // En el hero, al dejar de hacer scroll, vuelve a salir.
      clearTimeout(pausa)
      if (enHero()) pausa = setTimeout(() => poner(false), PAUSA_HERO)
    }
    // Como mucho una vez por fotograma (requestAnimationFrame), por fluidez.
    const alHacerScroll = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(revisar)
    }
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    window.addEventListener('resize', alCambiarTamano)
    return () => {
      window.removeEventListener('scroll', alHacerScroll)
      window.removeEventListener('resize', alCambiarTamano)
      clearTimeout(pausa)
    }
  }, [pathname, header])

  // Si el foco del teclado entra en el header escondido (tabulando hacia atrás), aparece.
  useEffect(() => {
    const elemento = header.current
    if (!elemento) return
    // Solo con el teclado (al tabular hacia atrás hasta el menú); un clic no lo hace aparecer.
    const alEnfocar = () => {
      if (elemento.querySelector(':focus-visible')) {
        ultimoValor.current = false
        setEstado({ ruta: pathname, escondido: false })
      }
    }
    elemento.addEventListener('focusin', alEnfocar)
    return () => elemento.removeEventListener('focusin', alEnfocar)
  }, [header, pathname])

  return escondido && !forzarVisible
}

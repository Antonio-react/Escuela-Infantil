import { useEffect } from 'react'
import { useLocation } from 'react-router'

// En cada navegación lleva el scroll arriba del todo, o a la sección del ancla si la hay
// (por ejemplo, /contacto#solicitar-visita). Nunca se queda abajo ni a medias.
// "key" cambia en CADA navegación, también al pulsar el enlace de la página en la que ya estás
// (por ejemplo, "La escuela" en el footer de La escuela): así también sube en ese caso.
// No usamos <ScrollRestoration> de React Router: las páginas abiertas directamente comparten la clave
// "default" y heredaban la posición de scroll de otra página.
export function ScrollArriba() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    const destino = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (destino) {
      // Con ancla, el TÍTULO de la sección queda pegado arriba (Antonio: en "Solicitar visita" quedaba a 160-260 px del
      // borde, se perdía pantalla y se cortaba el camión de enviar). Si el salto es hacia abajo, el header se esconde
      // solo (useHeaderEscondido): basta con 16 px de aire. Si es hacia arriba, el header aparece: se deja su hueco.
      // Primero el foco a la sección (sin mover el scroll): quien usa teclado o lector de pantalla sigue desde ahí, y
      // el botón pulsado en el header deja de tener el foco (si no, el header se quedaba visible tapando el título).
      if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1')
      destino.focus({ preventScroll: true })
      const titulo = destino.querySelector('h1, h2') ?? destino
      const objetivo = titulo.getBoundingClientRect().top + window.scrollY
      const altoHeader = document.querySelector('header')?.offsetHeight ?? 0
      const aire = objetivo > window.scrollY ? 16 : altoHeader + 16
      window.scrollTo(0, Math.max(0, objetivo - aire))
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, key])

  return null // no pinta nada: solo hace su trabajo
}

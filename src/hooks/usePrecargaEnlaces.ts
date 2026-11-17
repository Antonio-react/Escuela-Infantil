import { useEffect } from 'react'
import { cargaPaginas, esPaginaDiferida } from '../cargaPaginas'

// Precarga "con intención": cuando el ratón pasa por un enlace interno, le llega el foco del teclado o el dedo empieza
// a tocarlo, se empieza a descargar el código de esa página (cargaPaginas.ts). Al pulsar ya suele estar descargado y
// la navegación es instantánea. Nada se descarga antes de que haga falta ni se repite (import() lo guarda).
// Un solo vigilante en el documento (delegación de eventos) para todos los enlaces: menú, footer, puzle, cierre…
export function usePrecargaEnlaces() {
  useEffect(() => {
    const precargar = (evento: Event) => {
      if (!(evento.target instanceof Element)) return
      const enlace = evento.target.closest('a[href]')
      if (!(enlace instanceof HTMLAnchorElement) || enlace.origin !== location.origin) return
      if (esPaginaDiferida(enlace.pathname)) void cargaPaginas[enlace.pathname]()
    }
    // passive: no frenan el scroll (el navegador no tiene que esperar a ver si se cancela el evento).
    const opciones = { passive: true }
    document.addEventListener('pointerover', precargar, opciones)
    document.addEventListener('focusin', precargar, opciones)
    document.addEventListener('touchstart', precargar, opciones)
    return () => {
      document.removeEventListener('pointerover', precargar)
      document.removeEventListener('focusin', precargar)
      document.removeEventListener('touchstart', precargar)
    }
  }, [])
}

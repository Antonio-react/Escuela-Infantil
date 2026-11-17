import { useEffect } from 'react'

// Marca en <html> si la pantalla está quieta (data-quieto), para los movimientos "en reposo" (idea de Antonio): las
// nubes del hero y la nube "Solicitar visita" se mueven un poco cuando no se hace scroll, y se quedan fijas mientras
// se hace. El CSS (.balancea, en index.css) solo anima con la marca puesta.
// Cómo va (Antonio, 2026-11-16: al principio se movían y luego ya no; mejor que no se muevan al entrar y que lo hagan
// cuando la pantalla lleva un rato quieta):
// - Al cargar NO se mueve nada: la marca llega cuando la pantalla lleva QUIETO ms sin scroll.
// - Mientras siga quieta, se vuelve a poner cada CADA ms (se quita y se pone para que la animación empiece otra vez),
//   hasta VECES veces; luego todo queda quieto hasta el siguiente scroll. Con límite: lo que se mueve solo sin parar
//   necesitaría un botón de pausa (WCAG 2.2.2). Cada movimiento dura menos de 5 s.
// - Al hacer scroll, se quita al momento y la cuenta empieza de nuevo.
// No usa estado de React: escribe el atributo directamente, así no se vuelve a pintar nada.
const QUIETO = 3000
const CADA = 8000
const VECES = 3

export function useMarcaReposo() {
  useEffect(() => {
    // En pantallas táctiles (móvil y tablet), nada: las nubes se quedan fijas (Antonio, 2026-11-17). Así también se
    // ahorra poner y quitar la marca en <html> al empezar y parar cada scroll, que hace recalcular los estilos de toda
    // la página (en el iPhone se notaba como algún salto). Con ratón, como antes.
    if (window.matchMedia('(hover: none)').matches) return
    const raiz = document.documentElement
    let veces = 0
    let temporizador = 0
    let fotograma = 0

    const marcar = () => {
      raiz.setAttribute('data-quieto', '')
      veces += 1
      if (veces < VECES) {
        temporizador = window.setTimeout(() => {
          // Quitar y, dos fotogramas después, volver a poner: así el navegador reinicia la animación.
          raiz.removeAttribute('data-quieto')
          fotograma = requestAnimationFrame(() => {
            fotograma = requestAnimationFrame(marcar)
          })
        }, CADA)
      }
    }
    const empezarCuenta = () => {
      window.clearTimeout(temporizador)
      cancelAnimationFrame(fotograma)
      veces = 0
      temporizador = window.setTimeout(marcar, QUIETO)
    }
    const alHacerScroll = () => {
      raiz.removeAttribute('data-quieto')
      empezarCuenta()
    }

    empezarCuenta()
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', alHacerScroll)
      window.clearTimeout(temporizador)
      cancelAnimationFrame(fotograma)
      raiz.removeAttribute('data-quieto')
    }
  }, [])
}

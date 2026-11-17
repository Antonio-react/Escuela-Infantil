import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cuandoEsteLibre } from '../utils/cuandoEsteLibre'

// Monta lo de dentro un poco después de cargar la página, para que el primer dibujado sea solo lo que se ve (header
// y hero) y el navegador no se quede bloqueado montando de golpe todo lo de abajo (medido: era una tarea de casi medio
// segundo, lo que más bajaba la nota de Lighthouse). Se monta en cuanto pasa una de estas dos cosas:
//  - el navegador queda libre (requestIdleCallback; como mucho, a los 1,5 s), o
//  - se acerca con el scroll (a menos de una pantalla y media).
// Cada bloque diferido se monta en su propio turno: el trabajo se reparte en trozos cortos.
// No es "cargar al hacer scroll" del todo a propósito: así el contenido está en la página aunque nadie baje y Google
// lo lee (el texto de los testimonios, el cierre…).
// Mientras tanto, un hueco con alto mínimo, para que lo que viene después (el footer) no suba ni se vea antes de tiempo.

type DiferidoProps = {
  children: ReactNode
  // Alto aproximado del hueco mientras no se monta (CSS: '100svh', '40rem'…).
  altoMinimo?: string
}

export function Diferido({ children, altoMinimo = '100svh' }: DiferidoProps) {
  const [montado, setMontado] = useState(false)
  const hueco = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (montado) return
    const montar = () => setMontado(true)
    const cancelar = cuandoEsteLibre(montar)
    const observador = new IntersectionObserver((entradas) => entradas.some((e) => e.isIntersecting) && montar(), {
      rootMargin: '150% 0px',
    })
    if (hueco.current) observador.observe(hueco.current)
    return () => {
      cancelar()
      observador.disconnect()
    }
  }, [montado])

  if (montado) return children
  return <div ref={hueco} aria-hidden="true" style={{ minHeight: altoMinimo }} />
}

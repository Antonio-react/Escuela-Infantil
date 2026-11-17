import { useLayoutEffect, useRef, useState } from 'react'

// Letra que encoge para que quepa lo escrito (idea de Antonio, 2026-11-16: un nombre largo llenaba el hueco del
// formulario). Mide el texto con la letra del campo a su tamaño normal (max) y, si no cabe en el ancho del campo,
// lo encoge lo justo, hasta min (más pequeña ya no se leería bien; a partir de ahí, el campo se desplaza como
// siempre). Vuelve a medir al cambiar el texto, el ancho del campo y cuando termina de cargar la letra.
// Uso: const { ref, style } = useLetraQueCabe(valor); <input ref={ref} style={style} … /> (sacarlos así y no leer
// letra.ref al dibujar: la regla react-hooks/refs lo da por error).

let lienzo: CanvasRenderingContext2D | null = null

export function useLetraQueCabe(valor: string, max = 20, min = 14) {
  const ref = useRef<HTMLInputElement>(null)
  const [tamano, setTamano] = useState(max)

  useLayoutEffect(() => {
    const campo = ref.current
    if (!campo) return
    const medir = () => {
      const estilo = getComputedStyle(campo)
      const ancho = campo.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight)
      lienzo ??= document.createElement('canvas').getContext('2d')
      if (!lienzo || ancho <= 0) return
      lienzo.font = `${estilo.fontWeight} ${max}px ${estilo.fontFamily}`
      const necesita = lienzo.measureText(valor).width
      // Un poco de margen (0,97) para que la última letra no quede pegada al borde.
      setTamano(necesita > ancho * 0.97 ? Math.max(min, Math.floor(((max * ancho * 0.97) / necesita) * 10) / 10) : max)
    }
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(campo)
    document.fonts.ready.then(medir)
    return () => observador.disconnect()
  }, [valor, max, min])

  return { ref, style: { fontSize: `${tamano}px` } }
}

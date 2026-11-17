// Ejecuta algo cuando el navegador queda libre (requestIdleCallback; como mucho, a los 1,5 s), para que no compita con
// la carga ni con el primer dibujado. Devuelve la función que lo cancela (para la limpieza de un useEffect).
// Safari no tiene requestIdleCallback: allí, un pequeño retraso.
export function cuandoEsteLibre(hacer: () => void): () => void {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(hacer, { timeout: 1500 })
    return () => window.cancelIdleCallback(id)
  }
  // setTimeout a secas: TypeScript da por hecho que requestIdleCallback siempre existe (sus tipos son los de Chrome) y,
  // dentro de este caso, "window" le parece imposible.
  const id = setTimeout(hacer, 200)
  return () => clearTimeout(id)
}

// Lo mismo, pero esperando además a que la página haya terminado de cargar (imágenes incluidas): para efectos que
// pueden esperar un instante (la sacudida de "aterrizaje" del árbol del hero).
export function trasCargarYLibre(hacer: () => void): () => void {
  let cancelar = () => {}
  const seguir = () => (cancelar = cuandoEsteLibre(hacer))
  if (document.readyState === 'complete') seguir()
  else window.addEventListener('load', seguir, { once: true })
  return () => {
    window.removeEventListener('load', seguir)
    cancelar()
  }
}

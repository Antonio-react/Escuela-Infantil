import { useCallback, useSyncExternalStore } from 'react'

/**
 * true si se cumple la media query (por ejemplo '(min-width: 768px)'). Se actualiza en directo
 * si cambia (girar la tablet, cambiar un ajuste del sistema...).
 * valorSinNavegador: qué devolver si se renderiza fuera del navegador (sin window).
 */
export function useMediaQuery(consulta: string, valorSinNavegador = false): boolean {
  // React llama a "suscribir" pasándole un aviso; lo ejecutamos cada vez que la consulta cambia.
  // useCallback: la función solo se recrea si cambia la consulta (si no, React se re-suscribiría en cada render).
  const suscribir = useCallback(
    (avisar: () => void) => {
      const lista = window.matchMedia(consulta)
      lista.addEventListener('change', avisar)
      return () => lista.removeEventListener('change', avisar)
    },
    [consulta],
  )
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(consulta).matches,
    () => valorSinNavegador,
  )
}

import { useMediaQuery } from './useMediaQuery'

/**
 * true si el usuario ha pedido reducir el movimiento. Se actualiza en directo si cambia el ajuste.
 * Fuera del navegador devuelve true: por seguridad, "todo fijo".
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', true)
}

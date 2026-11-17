import { useEffect } from 'react'
import type { Pagina } from '../data/paginas'

// Cambia el título de la pestaña y la descripción al entrar en cada página.
// Se modifican las etiquetas que ya existen en index.html (no se añaden nuevas), así nunca hay duplicados.
export function useMetadatos(pagina: Pagina): void {
  useEffect(() => {
    document.title = pagina.titulo
    document.querySelector('meta[name="description"]')?.setAttribute('content', pagina.descripcion)
  }, [pagina])
}

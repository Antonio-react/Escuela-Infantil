import { useEffect } from 'react'
import type { Pagina } from '../data/paginas'
import { contenidoRobots, urlPagina } from '../data/seo'

// Devuelve la etiqueta del <head> que cumple el selector; si no existe, la crea con crear() y la añade.
function etiquetaDelHead(selector: string, crear: () => HTMLElement): HTMLElement {
  const existente = document.head.querySelector<HTMLElement>(selector)
  if (existente) return existente
  const nueva = crear()
  document.head.append(nueva)
  return nueva
}

// Al entrar en cada página: título de la pestaña, descripción, canonical y si Google puede guardarla.
// Las etiquetas salen de index.html (vite.config.ts) y aquí se modifican; solo se crean si faltan (canonical y
// robots, que la 404 quita), así nunca hay duplicados.
export function useMetadatos(pagina: Pagina): void {
  useEffect(() => {
    document.title = pagina.titulo
    document.querySelector('meta[name="description"]')?.setAttribute('content', pagina.descripcion)

    // canonical: la dirección "oficial" de la página. La 404 no tiene (su ruta "*" no es una dirección).
    if (pagina.indexar !== false) {
      etiquetaDelHead('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }))
        .setAttribute('href', urlPagina(pagina.ruta))
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove()
    }

    // robots: "noindex" en las páginas que no se guardan en Google y "max-image-preview:large" en las demás (seo.ts).
    // Se cambia la misma etiqueta del HTML, así al venir de la 404 vuelve a la de siempre.
    etiquetaDelHead('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' }))
      .setAttribute('content', contenidoRobots(pagina))
  }, [pagina])
}

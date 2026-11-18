import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import { paginas } from './src/data/paginas.ts'
import { site } from './src/data/site.ts'
import { datosEstructurados, llmsTxt, robotsTxt, sitemapXml, urlPagina } from './src/data/seo.ts'

// SEO desde los datos (2026-11-18): así index.html no lleva ningún dato copiado a mano.
// - Mete en el <head> de index.html el título, la descripción, las etiquetas para compartir (og:*), el canonical y
//   los datos estructurados de la escuela. Van en el HTML (no los pone React) porque WhatsApp, Facebook y los
//   buscadores los leen sin ejecutar JavaScript. Al cambiar de página, useMetadatos.ts actualiza los que cambian.
// - Al compilar, crea robots.txt, sitemap.xml y llms.txt en dist/.
function seoDesdeLosDatos(): Plugin {
  const inicio = paginas.inicio
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' })

  return {
    name: 'seo-desde-los-datos',
    transformIndexHtml() {
      const etiquetas: HtmlTagDescriptor[] = [
        { tag: 'title', children: inicio.titulo, injectTo: 'head' },
        meta({ name: 'description', content: inicio.descripcion }),
        { tag: 'link', attrs: { rel: 'canonical', href: urlPagina(inicio.ruta) }, injectTo: 'head' },
        meta({ property: 'og:url', content: urlPagina(inicio.ruta) }),
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:locale', content: 'es_ES' }),
        meta({ property: 'og:site_name', content: site.nombre }),
        meta({ property: 'og:title', content: inicio.titulo }),
        meta({ property: 'og:description', content: inicio.descripcion }),
        // Dirección COMPLETA: WhatsApp y Facebook no aceptan rutas relativas. Es el hero sin el menú ni el sello.
        meta({ property: 'og:image', content: urlPagina('/imagen-compartir.jpg') }),
        meta({ property: 'og:image:width', content: '1200' }),
        meta({ property: 'og:image:height', content: '630' }),
        meta({ property: 'og:image:alt', content: `Logo de la ${site.nombre}: un árbol de colores entre nubes` }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          // "<" escrito como <: así ningún texto puede cerrar la etiqueta <script> antes de tiempo.
          children: JSON.stringify(datosEstructurados()).replaceAll('<', '\\u003c'),
          injectTo: 'head',
        },
      ]
      // Mientras la web se revisa (site.web.indexar en false), ninguna página se guarda en Google. Va en el HTML
      // y no lo pone React, porque si Google lo ve al llegar ya no ejecuta el JavaScript de la página.
      if (!site.web.indexar) etiquetas.push(meta({ name: 'robots', content: 'noindex' }))
      return etiquetas
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() }) // para los asistentes de IA (seo.ts)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoDesdeLosDatos(),
  ],
})

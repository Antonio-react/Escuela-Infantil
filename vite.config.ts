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

// CSS dentro del HTML (2026-11-19, PageSpeed móvil: "solicitudes que bloquean el renderizado", ~310 ms). Al compilar,
// el <link> al CSS se cambia por un <style> con el mismo CSS: el navegador no tiene que pedir otro archivo antes de
// pintar ni de ejecutar el JavaScript. Se ve igual (son los mismos estilos, en el mismo sitio del <head>). Se puede
// porque: la CSP permite estilos en el HTML (style-src 'unsafe-inline', public/_headers), las rutas de dentro del CSS
// son absolutas (/assets/…: las fuentes siguen cargando) y ningún JavaScript pide el archivo CSS. El archivo ya no
// hace falta y no se publica. Solo al compilar: en `npm run dev`, Vite pone los estilos a su manera.
function cssDentroDelHtml(): Plugin {
  return {
    name: 'css-dentro-del-html',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!bundle) return html
        return html.replace(/<link rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g, (etiqueta, archivo: string) => {
          const css = bundle[archivo]
          if (!css || css.type !== 'asset') return etiqueta // si no lo encuentra, se queda el <link>: nada se rompe
          delete bundle[archivo]
          return `<style>${String(css.source)}</style>`
        })
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoDesdeLosDatos(),
    cssDentroDelHtml(),
  ],
})

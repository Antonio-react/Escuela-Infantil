import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import { paginas, type Pagina } from './src/data/paginas.ts'
import { site } from './src/data/site.ts'
import { contenidoRobots, datosEstructurados, llmsTxt, robotsTxt, sitemapXml, urlPagina } from './src/data/seo.ts'

// Páginas con su propio HTML (opción A): todas menos Inicio (es el propio index.html) y la 404, que va aparte en
// 404.html (su ruta "*" no es una dirección).
const todasLasPaginas: readonly Pagina[] = Object.values(paginas)
const paginasConArchivo = todasLasPaginas.filter((p) => p.ruta !== paginas.inicio.ruta && p.indexar !== false)

// Para meter un texto dentro de un atributo o del <title> sin romper el HTML.
const escaparHtml = (texto: string) =>
  texto.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// Copia del index.html ya compilado con el título, la descripción, el canonical, los og:* y el robots de otra página.
// Si no encuentra alguna etiqueta, el build falla: mejor eso que publicar páginas con los datos de Inicio.
function cabeceraDe(html: string, pagina: Pagina): string {
  const url = urlPagina(pagina.ruta)
  const titulo = escaparHtml(pagina.titulo)
  const descripcion = escaparHtml(pagina.descripcion)
  // La 404 no tiene dirección propia: sin canonical ni og:url (null = se quita la etiqueta entera).
  const conDireccion = pagina.indexar !== false
  // Cada patrón guarda lo de antes y lo de después del valor (los dos paréntesis) y se cambia solo lo de en medio.
  const cambios: [RegExp, string | null][] = [
    [/(<title>)[^<]*(<\/title>)/, titulo],
    [/(<meta name="description" content=")[^"]*(")/, descripcion],
    [/(<link rel="canonical" href=")[^"]*(")/, conDireccion ? url : null],
    [/(<meta property="og:url" content=")[^"]*(")/, conDireccion ? url : null],
    [/(<meta property="og:title" content=")[^"]*(")/, titulo],
    [/(<meta property="og:description" content=")[^"]*(")/, descripcion],
    [/(<meta name="robots" content=")[^"]*(")/, contenidoRobots(pagina)],
  ]
  return cambios.reduce((resultado, [patron, valor]) => {
    if (!patron.test(resultado)) throw new Error(`opción A: no encuentro ${patron} en index.html para ${pagina.ruta}`)
    // Quitar: desde el patrón hasta el ">" que cierra la etiqueta, con el salto de línea de detrás.
    if (valor === null) return resultado.replace(new RegExp(`${patron.source}[^>]*>\\s*`), '')
    // Con una función, y no con "$1…$2", para que un "$" de los datos no se lea como una referencia.
    return resultado.replace(patron, (_, antes: string, despues: string) => `${antes}${valor}${despues}`)
  }, html)
}

// SEO desde los datos (2026-11-18): así index.html no lleva ningún dato copiado a mano.
// - Mete en el <head> de index.html el título, la descripción, las etiquetas para compartir (og:*), el canonical y
//   los datos estructurados de la escuela. Van en el HTML (no los pone React) porque WhatsApp, Facebook y los
//   buscadores los leen sin ejecutar JavaScript. Al cambiar de página, useMetadatos.ts actualiza los que cambian.
// - Al compilar, crea robots.txt, sitemap.xml y llms.txt en dist/.
function seoDesdeLosDatos(): Plugin {
  const inicio = paginas.inicio
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' })
  let outDir = 'dist'

  return {
    name: 'seo-desde-los-datos',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
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
      // robots (seo.ts): "noindex" mientras la web se revisa (site.web.indexar en false) y, si no, permiso para
      // enseñar las fotos en grande. Va en el HTML y no lo pone React, porque si Google ve un "noindex" al llegar ya
      // no ejecuta el JavaScript de la página.
      etiquetas.push(meta({ name: 'robots', content: contenidoRobots(inicio) }))
      return etiquetas
    },
    // Opción A (2026-11-26, como en la carpintería): al terminar el build, una copia de index.html por página
    // (dist/contacto.html…) con su título, descripción, canonical y og:*. Netlify sirve esos archivos antes que la
    // regla de _redirects (no lleva "!"), así Google, WhatsApp y Facebook ven los de cada página sin ejecutar
    // JavaScript. La web es la misma: React arranca igual y useMetadatos cambia las mismas etiquetas al navegar.
    async closeBundle() {
      if (this.meta.watchMode) return
      const html = await readFile(path.join(outDir, 'index.html'), 'utf8').catch(() => '')
      if (!html) return // en `npm run dev` no hay dist/index.html
      for (const pagina of paginasConArchivo) {
        // Archivo suelto (contacto.html) y no carpeta (contacto/index.html): Netlify sirve /contacto con
        // contacto.html sin redirigir; con la carpeta redirigiría a /contacto/ y ya no coincidiría con el canonical.
        await writeFile(path.join(outDir, `${pagina.ruta.slice(1)}.html`), cabeceraDe(html, pagina))
      }
      // 404 de verdad (2026-11-26): _redirects sirve este archivo con el código 404 en cualquier dirección que no
      // exista. Antes respondía 200 con index.html y Google podía tomarlo por un "soft 404". React pinta la 404 igual.
      await writeFile(path.join(outDir, '404.html'), cabeceraDe(html, paginas.noEncontrada))
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

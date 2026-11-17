// Servidor de la web COMPILADA (dist/) para las pruebas de Playwright, que imita a Netlify:
// - Sirve los archivos de dist/ y, en cualquier otra ruta, index.html (como public/_redirects: /* /index.html 200).
// - Envía las cabeceras de seguridad de dist/_headers (CSP...): así las pruebas comprueban también que la CSP no
//   bloquea nada de la web. `vite preview` no las lee y, además, en Windows a veces se quedaba colgado.
// Uso: node scripts/servidor-pruebas.mjs [puerto]   (lo arranca playwright.config.ts).
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, relative, sep } from 'node:path'

const DIST = 'dist'
const PUERTO = Number(process.argv[2] ?? 4173)

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}

// _headers de Netlify: bloques "ruta" + líneas sangradas "Cabecera: valor". Rutas con * al final (prefijo).
function leerCabeceras() {
  const archivo = join(DIST, '_headers')
  if (!existsSync(archivo)) return []
  const bloques = []
  for (const linea of readFileSync(archivo, 'utf8').split(/\r?\n/)) {
    if (!linea.trim() || linea.trimStart().startsWith('#')) continue
    if (!/^\s/.test(linea)) bloques.push({ ruta: linea.trim(), cabeceras: {} })
    else if (bloques.length) {
      const i = linea.indexOf(':')
      bloques.at(-1).cabeceras[linea.slice(0, i).trim()] = linea.slice(i + 1).trim()
    }
  }
  return bloques
}
const bloques = leerCabeceras()
const casa = (ruta, patron) => (patron.endsWith('*') ? ruta.startsWith(patron.slice(0, -1)) : ruta === patron)
const cabecerasDe = (ruta) => Object.assign({}, ...bloques.filter((b) => casa(ruta, b.ruta)).map((b) => b.cabeceras))

// Todo dist/ se lee EN MEMORIA al arrancar, antes de abrir el puerto: recién compilados, la primera lectura de cada
// archivo en Windows puede tardar mucho (el antivirus lo revisa) y las primeras páginas de las pruebas se quedaban
// esperando más de 30 s. Así esa espera pasa antes de que empiece ninguna prueba. Clave: "/assets/index-….js".
const archivos = new Map()
function leerCarpeta(carpeta) {
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name)
    if (entrada.isDirectory()) leerCarpeta(ruta)
    else archivos.set('/' + relative(DIST, ruta).split(sep).join('/'), readFileSync(ruta))
  }
}
leerCarpeta(DIST)
const INDEX = '/index.html'

createServer((peticion, respuesta) => {
  if (peticion.method !== 'GET' && peticion.method !== 'HEAD') {
    // Envíos del formulario: en Netlify los recoge Netlify Forms; aquí no hay nada que los recoja.
    respuesta.writeHead(404).end()
    return
  }
  const ruta = decodeURIComponent(new URL(peticion.url ?? '/', 'http://x').pathname)
  // Solo se sirve lo que hay en el mapa (nada de "../" para leer otros archivos); el resto, index.html.
  const clave = archivos.has(ruta) ? ruta : INDEX
  respuesta.writeHead(200, { 'Content-Type': tipos[extname(clave)] ?? 'application/octet-stream', ...cabecerasDe(ruta) })
  respuesta.end(peticion.method === 'HEAD' ? undefined : archivos.get(clave))
}).listen(PUERTO, () => console.log(`Servidor de pruebas en http://localhost:${PUERTO} (${archivos.size} archivos en memoria)`))

// Genera las imágenes optimizadas de src/assets/ a partir de los originales de docs/referencias/.
// Los originales nunca se modifican. Uso: npm run imagenes
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile } from 'node:fs/promises'
import { relative } from 'node:path'

const LOGO = 'docs/referencias/logo/LOGO ARBOL COMPLETO.png'
const ARBOL = 'docs/referencias/logo/ARBOL SIN ROTULOS.png'
const DESTINO = 'src/assets'

// Árbol completo (copa, tronco y raíces), sin rótulos.
async function arbol() {
  return sharp(ARBOL).resize({ width: 720 }).webp({ quality: 78, effort: 6 }).toFile(`${DESTINO}/logo-arbol.webp`)
}

// Rótulo "Escuela infantil" (arriba del logo). Se borra la punta de la copa (mancha roja) que asoma
// por debajo: x 1250-1810, desde y 700 del original. Ojo: la "f" de "infantil" baja hasta y ≈ 705
// entre x 1860 y 1960, así que la zona borrada no debe pasar de x 1810 (antes llegaba a 2000 y la cortaba).
async function rotuloEscuela() {
  const recorte = { left: 180, top: 0, width: 2760, height: 790 }
  const tapa = await sharp({
    create: { width: 560, height: 90, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
  })
    .png()
    .toBuffer()
  const sinCopa = await sharp(LOGO)
    .extract(recorte)
    .composite([{ input: tapa, left: 1250 - recorte.left, top: 700, blend: 'dest-out' }]) // dest-out = "borra donde pinto"
    .png()
    .toBuffer()
  await rotuloPequeno(sinCopa, 'logo-rotulo-escuela')
  return sharp(sinCopa).resize({ width: 1100 }).webp({ quality: 84, effort: 6 }).toFile(`${DESTINO}/logo-rotulo-escuela.webp`)
}

// Versión de 700 px de un rótulo (2026-11-18): en el móvil el rótulo se ve a unos 350 px de ancho y bastaba con
// esta, pero se descargaba la de 1100 (unos 40 KB de más cada uno, según PageSpeed). Con srcset (Hero.tsx) el
// navegador elige: 700 px cubren 350 px de pantalla a ×2; el iPhone (×3) y las pantallas grandes siguen con la de 1100.
const ROTULO_PEQUENO = 700
function rotuloPequeno(imagen, nombre) {
  return sharp(imagen).resize({ width: ROTULO_PEQUENO }).webp({ quality: 84, effort: 6 }).toFile(`${DESTINO}/${nombre}-${ROTULO_PEQUENO}.webp`)
}

// Rótulo "Árbol de nubes". En el logo original lo cruzan el tronco (negro) y las raíces (gris):
// se quitan los píxeles poco saturados y se quedan las letras, que son verdes.
async function rotuloNubes() {
  const { data, info } = await sharp(LOGO)
    .extract({ left: 150, top: 3600, width: 2700, height: 660 })
    .resize({ width: 1100 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const saturacion = Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2])
    if (saturacion < 40) data[i + 3] = 0
  }
  const limpio = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer()
  await rotuloPequeno(limpio, 'logo-rotulo-nubes')
  return sharp(limpio)
    .webp({ quality: 84, effort: 6 })
    .toFile(`${DESTINO}/logo-rotulo-nubes.webp`)
}

// --- Favicon e imagen para compartir (van a public/: se publican tal cual) ---
const PUBLICO = 'public'
// Colores de src/index.css (@theme). Este script no puede leer el CSS: si cambian allí, cambiarlos aquí.
const CREMA = '#fbf8f3'
const NUBES = ['#e2e8ec', '#e8e1e5', '#f6e7d1'] // azul-suave, ciruela-suave y mostaza-suave (las del hero)

// La copa del árbol (sin tronco largo ni raíces: a 32 px el árbol entero sería un palito), en un cuadrado.
function copaCuadrada(lado, fondo) {
  return sharp(ARBOL)
    .extract({ left: 0, top: 0, width: 3039, height: 2600 })
    .resize({ width: lado, height: lado, fit: 'contain', background: fondo })
}
const transparente = { r: 0, g: 0, b: 0, alpha: 0 }
const favicon32 = () => copaCuadrada(32, transparente).png().toFile(`${PUBLICO}/favicon-32.png`)
const favicon192 = () => copaCuadrada(192, transparente).png().toFile(`${PUBLICO}/favicon-192.png`)
// iPhone ("añadir a pantalla de inicio") rellena la transparencia de negro: fondo crema y algo de margen.
const iconoApple = async () => {
  const copa = await copaCuadrada(150, transparente).png().toBuffer()
  return sharp({ create: { width: 180, height: 180, channels: 4, background: CREMA } })
    .composite([{ input: copa, left: 15, top: 15 }])
    .png()
    .toFile(`${PUBLICO}/apple-touch-icon.png`)
}

// Imagen al compartir el enlace (WhatsApp, redes): 1200 × 630, como el hero sin el menú ni el sello.
const NUBE = 'M40 104c-20 0-34-13-34-30 0-16 13-29 30-30 3-22 21-38 44-38 18 0 33 10 40 25 5-3 11-4 17-4 20 0 36 15 37 34 13 3 22 13 22 25 0 10-8 18-19 18z'
async function imagenCompartir() {
  const ancho = 1200
  const alto = 630
  const nube = (x, y, w, color) =>
    `<svg x="${x}" y="${y}" width="${w}" height="${(w * 110) / 200}" viewBox="0 0 200 110"><path d="${NUBE}" fill="${color}"/></svg>`
  const cielo = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">${nube(70, 95, 260, NUBES[0])}${nube(880, 300, 280, NUBES[1])}${nube(130, 455, 180, NUBES[2])}</svg>`,
  )
  // Mismas proporciones que el hero: rótulo, árbol (un poco montado) y rótulo debajo.
  const escuela = await sharp(`${DESTINO}/logo-rotulo-escuela.webp`).resize({ width: 440 }).png().toBuffer()
  const arbolPng = await sharp(`${DESTINO}/logo-arbol.webp`).resize({ width: 270 }).png().toBuffer()
  const nubes = await sharp(`${DESTINO}/logo-rotulo-nubes.webp`).resize({ width: 430 }).png().toBuffer()
  return sharp({ create: { width: ancho, height: alto, channels: 4, background: CREMA } })
    .composite([
      { input: cielo, left: 0, top: 0 },
      { input: escuela, left: (ancho - 440) / 2, top: 40 },
      { input: arbolPng, left: (ancho - 270) / 2, top: 157 },
      { input: nubes, left: (ancho - 430) / 2, top: 493 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${PUBLICO}/imagen-compartir.jpg`)
}

// Grano de la pizarra del menú de móvil: polvo de tiza blanco con transparencia, en una baldosa que se
// repite (el color de fondo y las manchas de borrado los pone el CSS). Aleatorio con semilla (mulberry32):
// cada vez que se ejecuta el script sale la misma imagen, así no cambia sin motivo.
function aleatorioConSemilla(semilla) {
  let a = semilla
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
async function granoPizarra() {
  const lado = 256
  const azar = aleatorioConSemilla(7)
  const datos = Buffer.alloc(lado * lado * 4)
  for (let i = 0; i < datos.length; i += 4) {
    datos[i] = datos[i + 1] = datos[i + 2] = 255
    // La mayoría de puntos casi invisibles y muy pocos algo más claros (motas de tiza): sutil, como polvo.
    const r = azar()
    datos[i + 3] = r > 0.997 ? 30 + azar() * 35 : r ** 4 * 16
  }
  return sharp(datos, { raw: { width: lado, height: lado, channels: 4 } })
    .blur(0.4)
    .webp({ quality: 70, alphaQuality: 60, effort: 6 })
    .toFile(`${DESTINO}/pizarra-grano.webp`)
}

// Textura de la tiza (2026-11-17): los huecos y el grano de las letras y dibujos de tiza, ya hechos, para usarlos como
// máscara (.tiza en index.css). Antes los fabricaba un filtro SVG (feTurbulence) al pintar: en el iPhone, Safari lo
// calcula con el procesador y el menú se paraba casi 0,2 s al abrirse (en Android lo hace la tarjeta gráfica).
// Es EL MISMO ruido que tenía el filtro (frecuencia 1.3, 1 octava, semilla 7, y los huecos donde el ruido es claro:
// alfa = 1.9 − 2.6 × ruido), y lo dibuja sharp con ese mismo filtro SVG. stitchTiles: la baldosa se repite sin
// costuras. 128 px de la web a ×3 (384 px), como la ve el iPhone. Calidad 60: es ruido, no se nota y pesa la mitad.
async function texturaTiza() {
  const lado = 128
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${lado}" height="${lado}">
    <filter id="f" x="0" y="0" width="${lado}" height="${lado}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="7" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.6 1.9" />
    </filter>
    <rect width="${lado}" height="${lado}" filter="url(#f)" />
  </svg>`
  // density: puntos por pulgada al dibujar el SVG; 72 = 1 px por px, así que 72 × 3 = a ×3.
  return sharp(Buffer.from(svg), { density: 72 * 3 })
    .webp({ quality: 60, alphaQuality: 60, effort: 6 })
    .toFile(`${DESTINO}/textura-tiza.webp`)
}

// Corcho del tablón de las actividades (Familias): gránulos de corcho de tres tonos (base, oscuro y claro) en una
// baldosa que se repite. Opaco: el color lo da la propia imagen. Con semilla, como el grano de la pizarra.
async function corcho() {
  const lado = 256
  const azar = aleatorioConSemilla(11)
  const base = [201, 154, 99] // #c99a63
  const oscuro = [168, 120, 68]
  const claro = [222, 182, 126]
  const datos = Buffer.alloc(lado * lado * 3)
  // Primero la base con un poco de variación en cada píxel…
  for (let i = 0; i < datos.length; i += 3) {
    const v = (azar() - 0.5) * 18
    for (let c = 0; c < 3; c++) datos[i + c] = base[c] + v
  }
  // …y luego gránulos de 1 a 3 px, oscuros y claros, repartidos al azar (con vuelta: la baldosa empalma).
  for (let n = 0; n < 1500; n++) {
    const color = azar() < 0.6 ? oscuro : claro
    const radio = 1 + Math.floor(azar() * 2.5)
    const cx = Math.floor(azar() * lado)
    const cy = Math.floor(azar() * lado)
    for (let dy = -radio; dy <= radio; dy++) {
      for (let dx = -radio; dx <= radio; dx++) {
        if (dx * dx + dy * dy > radio * radio) continue
        const p = (((cy + dy + lado) % lado) * lado + ((cx + dx + lado) % lado)) * 3
        for (let c = 0; c < 3; c++) datos[p + c] = color[c] + (azar() - 0.5) * 20
      }
    }
  }
  return sharp(datos, { raw: { width: lado, height: lado, channels: 3 } })
    .blur(0.5)
    .webp({ quality: 72, effort: 6 })
    .toFile(`${DESTINO}/corcho.webp`)
}

// El orden importa: la imagen para compartir usa las imágenes del logo ya generadas.
const tareas = { arbol, rotuloEscuela, rotuloNubes, favicon32, favicon192, iconoApple, imagenCompartir, granoPizarra, texturaTiza, corcho }
for (const [nombre, tarea] of Object.entries(tareas)) {
  const r = await tarea()
  console.log(`${nombre}: ${r.width}x${r.height}, ${Math.round(r.size / 1024)} KB`)
}

// --- Fotos de la escuela: docs/referencias/fotos/ → src/assets/fotos/ (WebP) ---
// Convierte todo lo que haya en la carpeta. Los originales se borran tras convertirlos (no se guardan en el
// proyecto), así que si la carpeta no existe o está vacía, este paso se salta sin error.
// Nombre de salida: el del original en minúsculas, sin tildes ni espacios ("Baño niños.HEIC" → "bano-ninos.webp").
const FOTOS_ORIGEN = 'docs/referencias/fotos'
const FOTOS_DESTINO = `${DESTINO}/fotos`
const FOTO_ANCHO = 1400 // la foto grande de la galería ocupa ~1150 px en escritorio

const nombreLimpio = (archivo) =>
  archivo
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita las tildes (y la virgulilla de la ñ)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Ajustes por foto, por nombre de salida ("fachada", "actividades/3"…). Vacíos: las fotos de ahora ya están
// generadas con los suyos y sus originales se borraron (2026-11-17). Se rellenan si llega una foto que lo necesite:
// - FOTOS_DIFUMINAR: zonas con caras de niños (fotos pegadas en las paredes), en px de la foto ya generada (1400 de
//   ancho), p. ej. { left: 710, top: 468, width: 66, height: 52 }. Así en la web no queda ninguna versión nítida.
// - FOTOS_RECORTE: bordes que se quitan antes de reducir, en px del original, p. ej. { arriba: 20 }.
// - FOTOS_RETOQUE: función que recibe la imagen y devuelve la retocada, p. ej. más color con modulate({ saturation }).
const FOTOS_DIFUMINAR = {}
const FOTOS_RECORTE = {}
const FOTOS_RETOQUE = {}

// También entra en las subcarpetas ("Actividades/1.HEIC" → "actividades/1.webp"); solo coge archivos.
const fotosOriginales = existsSync(FOTOS_ORIGEN)
  ? (await readdir(FOTOS_ORIGEN, { recursive: true, withFileTypes: true })).filter((entrada) => entrada.isFile())
  : []
for (const entrada of fotosOriginales) {
  const carpeta = relative(FOTOS_ORIGEN, entrada.parentPath)
  const archivo = carpeta ? `${carpeta}/${entrada.name}` : entrada.name
  const subcarpeta = carpeta ? `${nombreLimpio(carpeta)}/` : ''
  await mkdir(`${FOTOS_DESTINO}/${subcarpeta}`, { recursive: true })
  let datos = await readFile(`${FOTOS_ORIGEN}/${archivo}`)
  // sharp no trae el códec HEVC de las fotos del iPhone (patentes): heic-convert las pasa antes a JPEG.
  if (/\.hei[cf]$/i.test(archivo)) datos = Buffer.from(await heicConvert({ buffer: datos, format: 'JPEG', quality: 0.95 }))
  // rotate() endereza la foto según el móvil. sharp no copia los metadatos (EXIF con la ubicación GPS) si no se pide.
  const nombre = `${subcarpeta}${nombreLimpio(entrada.name)}`
  const recorte = FOTOS_RECORTE[nombre]
  if (recorte) {
    const derecha = await sharp(datos).rotate().toBuffer({ resolveWithObject: true })
    datos = await sharp(derecha.data)
      .extract({ left: 0, top: recorte.arriba, width: derecha.info.width, height: derecha.info.height - recorte.arriba })
      .toBuffer()
  }
  const retoque = FOTOS_RETOQUE[nombre]
  if (retoque) datos = await retoque(await sharp(datos).rotate().png().toBuffer())
  const reducida = await sharp(datos).rotate().resize({ width: FOTO_ANCHO, withoutEnlargement: true }).toBuffer()
  // Cada zona se recorta, se difumina y se vuelve a pegar en su sitio.
  const parches = await Promise.all(
    (FOTOS_DIFUMINAR[nombre] ?? []).map(async (zona) => ({
      input: await sharp(reducida).extract(zona).blur(7).toBuffer(),
      left: zona.left,
      top: zona.top,
    })),
  )
  const final = await sharp(reducida).composite(parches).toBuffer()
  const r = await sharp(final).webp({ quality: 78, effort: 6 }).toFile(`${FOTOS_DESTINO}/${nombre}.webp`)
  // Y otra de 800 px ("-800"): la que piden la rejilla, el corcho y la fachada en casi todas las pantallas (srcset en
  // fotos.ts). La de 1400, solo la foto grande, el móvil a pantalla completa y el visor.
  const p = await sharp(final).resize({ width: 800 }).webp({ quality: 78, effort: 6 }).toFile(`${FOTOS_DESTINO}/${nombre}-800.webp`)
  console.log(`foto ${archivo}: ${r.width}x${r.height}, ${Math.round(r.size / 1024)} KB (800: ${Math.round(p.size / 1024)} KB)`)
}

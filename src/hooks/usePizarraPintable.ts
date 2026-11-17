import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

// Pizarra en la que se puede pintar a tiza (idea de Antonio, 2026-11-16): un <canvas> detrás de lo escrito.
// - Ratón y dedo (o lápiz), igual: pinta siempre que se arrastra (con la tiza blanca si no se ha cogido ninguna).
//   En el móvil, la pizarra no hace scroll (touch-action: none, lo pone MarcoPizarra): Antonio prefiere que pinte
//   bien a la primera; para bajar la página se toca fuera de ella (el marco, el pollete).
// - Con el borrador en la mano, los trazos borran.
// - Tocar un enlace o un botón de la pizarra NO pinta (se deja pasar el toque).
// El trazo lleva textura de tiza: se pinta con un "patrón" de grano (píxeles del color con más o menos opacidad y
// algún hueco), hecho una vez por color.
// Al cambiar el tamaño de la pizarra, lo dibujado se reescala (no se pierde).

const GROSOR = 5 // px de pantalla
const LADO_GRANO = 48

// Convierte cualquier color CSS (también color-mix o var()) en "rgb(r, g, b)": se lee de un elemento y, como el
// navegador puede devolverlo en otro formato (oklab, color(srgb …): las tizas de color salían negras), se pinta en un
// píxel y se leen sus valores.
let pixel: CanvasRenderingContext2D | null = null
function colorResuelto(color: string, dentro: HTMLElement): string {
  const prueba = document.createElement('span')
  prueba.style.color = color
  prueba.style.display = 'none'
  dentro.appendChild(prueba)
  const calculado = getComputedStyle(prueba).color
  prueba.remove()
  if (!pixel) {
    const lienzo = document.createElement('canvas')
    lienzo.width = 1
    lienzo.height = 1
    pixel = lienzo.getContext('2d', { willReadFrequently: true })
  }
  if (!pixel) return calculado
  pixel.clearRect(0, 0, 1, 1)
  pixel.fillStyle = calculado
  pixel.fillRect(0, 0, 1, 1)
  const [r, g, b] = pixel.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

// Patrón de grano de tiza de un color: cada píxel con opacidad al azar (entre 0,55 y 1) y ~12 % de huecos.
const patrones = new Map<string, CanvasPattern>()
function patronDeTiza(ctx: CanvasRenderingContext2D, rgb: string): CanvasPattern | string {
  const guardado = patrones.get(rgb)
  if (guardado) return guardado
  const lienzo = document.createElement('canvas')
  lienzo.width = LADO_GRANO
  lienzo.height = LADO_GRANO
  const c = lienzo.getContext('2d')
  const numeros = rgb.match(/[\d.]+/g)?.map(Number)
  if (!c || !numeros) return rgb
  const [r, g, b] = numeros
  const imagen = c.createImageData(LADO_GRANO, LADO_GRANO)
  for (let i = 0; i < imagen.data.length; i += 4) {
    imagen.data[i] = r
    imagen.data[i + 1] = g
    imagen.data[i + 2] = b
    imagen.data[i + 3] = Math.random() < 0.12 ? 0 : Math.round(255 * (0.55 + Math.random() * 0.45))
  }
  c.putImageData(imagen, 0, 0)
  const patron = ctx.createPattern(lienzo, 'repeat')
  if (!patron) return rgb
  patrones.set(rgb, patron)
  return patron
}

type Opciones = {
  color: string // color CSS de la tiza elegida
  borrador: boolean // si lo que hay en la mano es el borrador: los trazos borran
  alPintar?: () => void // la primera vez que se pinta (para quitar la pista)
  alMoverDedo?: (punto: { x: number; y: number } | null) => void // dónde está el dedo (para dibujar la tiza bajo él)
  // Puntero del ratón sobre la pizarra: el de la tiza (según su color ya en rgb) o el del borrador. Lo pone el hook
  // (no quien lo usa): modificar el elemento desde fuera, con la ref devuelta, la regla react-hooks/immutability lo
  // da por error. Tienen que ser estables (una función y un texto de fuera del componente).
  cursorTiza?: (rgb: string) => string
  cursorBorrador?: string
}

type Punto = { x: number; y: number }
const GROSOR_BORRADOR = 28 // px de pantalla

export function usePizarraPintable({ color, borrador, alPintar, alMoverDedo, cursorTiza, cursorBorrador }: Opciones) {
  const contenedor = useRef<HTMLDivElement>(null)
  const lienzo = useRef<HTMLCanvasElement>(null)
  const ultimo = useRef<Punto | null>(null)
  const pintando = useRef<number | null>(null) // id del puntero que pinta
  const yaPinto = useRef(false)

  // Puntero (solo se ve con ratón): el borrador o la tiza del color con el que se pinta.
  useEffect(() => {
    const caja = contenedor.current
    if (!caja) return
    if (borrador && cursorBorrador) caja.style.cursor = cursorBorrador
    else if (!borrador && cursorTiza) caja.style.cursor = cursorTiza(colorResuelto(color, caja))
  }, [color, borrador, cursorTiza, cursorBorrador])

  // Tamaño del lienzo = el de la pizarra (por la densidad de píxeles de la pantalla). Si cambia, se reescala lo pintado.
  useEffect(() => {
    const caja = contenedor.current
    const canvas = lienzo.current
    if (!caja || !canvas) return
    const ajustar = () => {
      const densidad = window.devicePixelRatio || 1
      const ancho = Math.round(caja.clientWidth * densidad)
      const alto = Math.round(caja.clientHeight * densidad)
      if (ancho === canvas.width && alto === canvas.height) return
      const copia = document.createElement('canvas')
      copia.width = canvas.width
      copia.height = canvas.height
      copia.getContext('2d')?.drawImage(canvas, 0, 0)
      canvas.width = ancho
      canvas.height = alto
      if (copia.width && copia.height) canvas.getContext('2d')?.drawImage(copia, 0, 0, ancho, alto)
    }
    ajustar()
    const observador = new ResizeObserver(ajustar)
    observador.observe(caja)
    return () => observador.disconnect()
  }, [])

  const puntoDe = (evento: ReactPointerEvent) => {
    const caja = contenedor.current!.getBoundingClientRect()
    return { x: evento.clientX - caja.left, y: evento.clientY - caja.top }
  }

  const trazo = useCallback(
    (desde: { x: number; y: number }, hasta: { x: number; y: number }) => {
      const canvas = lienzo.current
      const caja = contenedor.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !caja || !ctx) return
      const densidad = canvas.width / caja.clientWidth
      ctx.save()
      ctx.scale(densidad, densidad)
      if (borrador) {
        // Borrar: quitar lo pintado por donde pasa (destination-out), con un trazo ancho como el borrador.
        ctx.globalCompositeOperation = 'destination-out'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = GROSOR_BORRADOR
      } else {
        ctx.strokeStyle = patronDeTiza(ctx, colorResuelto(color, caja))
        ctx.lineWidth = GROSOR
      }
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(desde.x, desde.y)
      // Un punto (sin moverse): se dibuja un trazo mínimo para que se vea.
      ctx.lineTo(hasta.x + (desde.x === hasta.x && desde.y === hasta.y ? 0.1 : 0), hasta.y)
      ctx.stroke()
      ctx.restore()
    },
    [color, borrador],
  )

  // Empieza a pintar (o borrar) desde un punto, con el puntero capturado (sigue aunque se salga de la pizarra).
  const empezar = (evento: ReactPointerEvent<HTMLDivElement>, desde: Punto) => {
    evento.currentTarget.setPointerCapture(evento.pointerId)
    pintando.current = evento.pointerId
    const punto = puntoDe(evento)
    trazo(desde, punto)
    ultimo.current = punto
    if (evento.pointerType !== 'mouse') alMoverDedo?.(punto)
    if (!yaPinto.current && !borrador) {
      yaPinto.current = true
      alPintar?.()
    }
  }

  const alBajar = (evento: ReactPointerEvent<HTMLDivElement>) => {
    if ((evento.target as HTMLElement).closest('a, button')) return // los enlaces y botones, como siempre
    if (evento.pointerType === 'mouse') {
      if (evento.button !== 0) return
      // Sin esto, al arrastrar con el ratón se seleccionaba el texto de la pizarra (se veía azul).
      evento.preventDefault()
      empezar(evento, puntoDe(evento))
      return
    }
    // Dedo: pinta siempre, como el ratón (Antonio: con la blanca, sin coger nada, y sin que la página se mueva). La
    // pizarra tiene touch-action: none; para hacer scroll se toca fuera de ella (el marco, el pollete).
    empezar(evento, puntoDe(evento))
  }
  const alMover = (evento: ReactPointerEvent<HTMLDivElement>) => {
    if (pintando.current !== evento.pointerId || !ultimo.current) return
    const punto = puntoDe(evento)
    trazo(ultimo.current, punto)
    ultimo.current = punto
    if (evento.pointerType !== 'mouse') alMoverDedo?.(punto)
  }
  const alSoltar = (evento: ReactPointerEvent<HTMLDivElement>) => {
    if (pintando.current !== evento.pointerId) return
    pintando.current = null
    ultimo.current = null
    alMoverDedo?.(null)
  }

  const borrar = useCallback(() => {
    const canvas = lienzo.current
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  return {
    contenedor,
    lienzo,
    borrar,
    eventos: { onPointerDown: alBajar, onPointerMove: alMover, onPointerUp: alSoltar, onPointerCancel: alSoltar },
  }
}

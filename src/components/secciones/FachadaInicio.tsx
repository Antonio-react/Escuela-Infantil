import { fotoFachada, srcSet } from '../../data/fotos'

// Inicio: la escuela desde fuera, en grande, justo debajo del hero (en lugar de la antigua barra de datos; Antonio,
// 2026-11-17). Sola, sin datos encima: lo más limpio, y los datos ya están por toda la web. Lo primero que quiere ver
// una familia es cómo es el sitio de verdad. Si no hay foto (fotos.ts), no se pinta nada.
// Esquinas poco redondeadas (rounded-sm): es una foto, no una tarjeta.
// En móvil, 4:3 (la forma de la foto). Desde sm, como mucho el 70 % del alto de la pantalla (en un portátil bajo no
// la tapa entera); lo que sobra se recorta sobre todo por abajo (el suelo), para no cortar el tejado.
// En pantallas BAJAS (portátil de 13", 1366×768, 1024×600) solo cabe la mitad de la foto o poco más: así se veían el
// tejado y la planta de arriba, sin la puerta. Ahí va centrada, para que salga la entrada entera (cartel, puerta y
// dibujos; Antonio, 2026-11-19). Cuándo: con la foto a su ancho máximo (1104 px, desde 72rem de ventana), si la
// ventana mide menos de 53rem de alto; por debajo de 72rem, si es más ancha que 3:2. Medido en cada pantalla: se
// centra cuando se ve menos de ~70 % de la foto; en 1440×900, 1920×1080, tablet y móvil se queda como estaba.
export function FachadaInicio() {
  if (!fotoFachada) return null
  return (
    <div className="mx-auto max-w-6xl px-4 pt-[clamp(2.5rem,7svh,4.5rem)] sm:px-6">
      <img
        src={fotoFachada.src}
        srcSet={srcSet(fotoFachada)}
        sizes="(min-width: 1152px) 1104px, calc(100vw - 2rem)"
        alt={fotoFachada.alt}
        width={fotoFachada.ancho}
        height={fotoFachada.alto}
        loading="lazy"
        decoding="async"
        className="block aspect-4/3 w-full rounded-sm object-cover sm:aspect-auto sm:max-h-[70svh] sm:object-[50%_15%] [@media(min-width:72rem)_and_(max-height:53rem)]:object-center [@media(min-width:40rem)_and_(max-width:71.99rem)_and_(min-aspect-ratio:3/2)]:object-center"
      />
    </div>
  )
}

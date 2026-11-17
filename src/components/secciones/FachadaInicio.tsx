import { fotoFachada, srcSet } from '../../data/fotos'

// Inicio: la escuela desde fuera, en grande, justo debajo del hero (en lugar de la antigua barra de datos; Antonio,
// 2026-11-17). Sola, sin datos encima: lo más limpio, y los datos ya están por toda la web. Lo primero que quiere ver
// una familia es cómo es el sitio de verdad. Si no hay foto (fotos.ts), no se pinta nada.
// Esquinas poco redondeadas (rounded-sm): es una foto, no una tarjeta.
// En móvil, 4:3 y el recorte centrado en el edificio (a la derecha de la foto): apaisada, se veía diminuta. Desde sm,
// con su forma, y como mucho el 70 % del alto de la pantalla (en un portátil bajo no la tapa entera).
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
        className="block aspect-4/3 w-full rounded-sm object-cover object-[68%_50%] sm:aspect-auto sm:max-h-[70svh] sm:object-center"
      />
    </div>
  )
}

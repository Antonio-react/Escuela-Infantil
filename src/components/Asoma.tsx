import { useInView } from 'motion/react'
import { useRef, useState, type AnimationEvent, type ReactNode } from 'react'

// Un animal que ASOMA por el borde de arriba de un botón (idea de Antonio, 2026-11-16: los botones secundarios, con
// un animal asomando; las formas especiales solo para la nube "Solicitar visita" y el camión "Enviar"). El animal va
// DETRÁS del botón (se ve solo lo que sobresale): en reposo, los ojos. Las patitas (el ratón) van DELANTE, agarradas
// al borde. Todo decorativo (aria-hidden); el botón no cambia.
// - rana: los ojos saltones arriba y la cara con su sonrisa (Baby Control; Antonio la prefirió al cocodrilo).
// - raton: orejas, ojos y patitas (Guardar calendario).
// La animación (Antonio: lenta, igual en ordenador y móvil): se asoma despacio, mira a un lado y al otro (solo se
// mueven las pupilas) y se vuelve a agachar (~3 s; .asomandose / .asoma-pupila en index.css). Se activa al pasar el
// ratón por el botón (y termina aunque se quite) o, en pantallas táctiles, la primera vez que el botón se ve.

type Animal = 'rana' | 'raton'

// Las pupilas llevan la clase asoma-pupila: son lo único que se mueve al "mirar a los lados".
function Rana() {
  return (
    <svg viewBox="0 0 56 32" className="block w-full overflow-visible">
      {/* Cara (lo de abajo queda detrás del botón) y las dos lomas de los ojos, saltones, arriba */}
      <ellipse cx="28" cy="25" rx="23" ry="12" fill="#6cbf4a" />
      <circle cx="16" cy="11" r="8.5" fill="#6cbf4a" />
      <circle cx="40" cy="11" r="8.5" fill="#6cbf4a" />
      {/* Ojos: blanco y pupila (con su brillo, que se mueve con ella) */}
      <circle cx="16" cy="10.5" r="5.5" fill="white" />
      <circle cx="40" cy="10.5" r="5.5" fill="white" />
      <g className="asoma-pupila">
        <circle cx="16" cy="11" r="2.8" fill="#2b2830" />
        <circle cx="40" cy="11" r="2.8" fill="#2b2830" />
        <circle cx="15.1" cy="10" r="0.9" fill="white" />
        <circle cx="39.1" cy="10" r="0.9" fill="white" />
      </g>
      {/* Mofletes y sonrisa ancha */}
      <circle cx="10" cy="23" r="2.6" fill="#f3a3a5" opacity="0.8" />
      <circle cx="46" cy="23" r="2.6" fill="#f3a3a5" opacity="0.8" />
      <path d="M17 22c6 5 16 5 22 0" stroke="#3f7d2a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Orificios de la nariz */}
      <circle cx="25.5" cy="18.5" r="0.8" fill="#3f7d2a" />
      <circle cx="30.5" cy="18.5" r="0.8" fill="#3f7d2a" />
    </svg>
  )
}

function Raton() {
  return (
    <svg viewBox="0 0 48 30" className="block w-full overflow-visible">
      {/* Orejas (con el interior rosa) y cabeza */}
      <circle cx="12" cy="9" r="7.5" fill="#a9a6b2" />
      <circle cx="36" cy="9" r="7.5" fill="#a9a6b2" />
      <circle cx="12" cy="9" r="4.5" fill="#f3b6c0" />
      <circle cx="36" cy="9" r="4.5" fill="#f3b6c0" />
      <ellipse cx="24" cy="22" rx="13" ry="11" fill="#b9b6c1" />
      {/* Ojos con su brillo (las pupilas se mueven al mirar) y mofletes */}
      <g className="asoma-pupila">
        <circle cx="19" cy="19" r="2" fill="#2b2830" />
        <circle cx="29" cy="19" r="2" fill="#2b2830" />
        <circle cx="18.4" cy="18.3" r="0.7" fill="white" />
        <circle cx="28.4" cy="18.3" r="0.7" fill="white" />
      </g>
      <circle cx="15" cy="24" r="2" fill="#f3b6c0" opacity="0.7" />
      <circle cx="33" cy="24" r="2" fill="#f3b6c0" opacity="0.7" />
      {/* Hocico rosa */}
      <ellipse cx="24" cy="24" rx="2" ry="1.5" fill="#e88a9a" />
    </svg>
  )
}

// Las ondas del agua alrededor de la rana, donde sale del charco (el botón de Baby Control, .boton-charco; 2026-11-17).
// Van delante, sobre el borde de arriba del botón: dos arcos claros, por debajo de la rana, como el agua que se mueve
// a su alrededor.
function OndasRana() {
  return (
    <svg viewBox="0 0 96 12" className="block w-full overflow-visible" fill="none" strokeLinecap="round">
      <path d="M14 3c10 6 58 6 68 0" stroke="white" strokeWidth="1.8" opacity="0.85" />
      <path d="M4 6c16 8 72 8 88 0" stroke="white" strokeWidth="1.4" opacity="0.5" />
    </svg>
  )
}

// Las patitas del ratón, agarradas al borde del botón (van delante).
function PatitasRaton() {
  return (
    <svg viewBox="0 0 48 8" className="block w-full">
      <ellipse cx="15" cy="4" rx="4.5" ry="3.5" fill="#b9b6c1" />
      <ellipse cx="33" cy="4" rx="4.5" ry="3.5" fill="#b9b6c1" />
      <path d="M13 5v1.5M15 5.4v1.6M17 5v1.5M31 5v1.5M33 5.4v1.6M35 5v1.5" stroke="#8d8a96" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

export function Asoma({ animal, children }: { animal: Animal; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visto = useInView(ref, { once: true, amount: 0.9 })
  const [conRaton, setConRaton] = useState(false) // asomándose porque ha pasado el ratón
  // Pantallas táctiles (sin "pasar el ratón"): se asoma la primera vez que el botón se ve, una sola vez. Se calcula
  // al dibujar (visto, táctil y aún no se ha asomado) en vez de cambiar el estado en un efecto (react-hooks/
  // set-state-in-effect).
  const [tactil] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)
  const [yaSeAsomoTactil, setYaSeAsomoTactil] = useState(false)
  const asomando = conRaton || (tactil && visto && !yaSeAsomoTactil)

  const alTerminar = (evento: AnimationEvent) => {
    if (evento.animationName !== 'asoma-mira') return
    setConRaton(false)
    if (tactil && visto) setYaSeAsomoTactil(true)
  }

  return (
    // [&>a]/[&>button]: el botón, por encima del animal (z-10), para que el animal quede detrás.
    <span
      ref={ref}
      onPointerEnter={(evento) => {
        if (evento.pointerType === 'mouse') setConRaton(true)
      }}
      className="relative inline-flex [&>a]:relative [&>a]:z-10 [&>button]:relative [&>button]:z-10"
    >
      <span
        aria-hidden="true"
        onAnimationEnd={alTerminar}
        className={`pointer-events-none absolute right-6 z-0 ${asomando ? 'asomandose' : ''} ${
          // En reposo se le ven los ojos; al asomarse, sube y se le ve la cara.
          animal === 'rana' ? 'bottom-[calc(100%-1rem)] w-16' : 'bottom-[calc(100%-0.75rem)] w-15'
        }`}
      >
        {animal === 'rana' ? <Rana /> : <Raton />}
      </span>
      {children}
      {/* Centradas con la rana: ella va a right-6 (1,5rem) y mide w-16 (4rem); las ondas, w-24 (6rem), a right-2. */}
      {animal === 'rana' && (
        // top-1: dentro del agua (más arriba quedaban sobre el fondo crema y el blanco no se veía).
        <span aria-hidden="true" className="pointer-events-none absolute top-1 right-2 z-20 w-24">
          <OndasRana />
        </span>
      )}
      {animal === 'raton' && (
        <span aria-hidden="true" className="pointer-events-none absolute right-6 bottom-[calc(100%-0.35rem)] z-20 w-15">
          <PatitasRaton />
        </span>
      )}
    </span>
  )
}

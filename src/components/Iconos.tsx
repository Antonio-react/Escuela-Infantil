import { useId, type SVGProps } from 'react'

// Iconos de trazo propios. Heredan el color del texto (currentColor) y son decorativos:
// el texto o el aria-label del enlace que los contiene es lo que se anuncia.
type IconoProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: IconoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

// Colores reales de la marca Instagram (de abajo a la izquierda a arriba a la derecha). Son colores de
// otra marca, no de nuestra paleta: por eso van aquí y no en @theme.
const degradadoInstagram = ['#f58529', '#dd2a7b', '#8134af', '#515bd4'] as const

// colorReal: pinta el icono con el degradado de Instagram en vez del color del texto.
export function IconoInstagram({ colorReal = false, ...props }: IconoProps & { colorReal?: boolean }) {
  const id = useId() // id único: puede haber varios iconos en la misma página
  const trazo = colorReal ? `url(#${id})` : 'currentColor'
  return (
    <Base stroke={trazo} {...props}>
      {colorReal && (
        <defs>
          <linearGradient id={id} x1="3" y1="21" x2="21" y2="3" gradientUnits="userSpaceOnUse">
            {degradadoInstagram.map((color, i) => (
              <stop key={color} offset={i / (degradadoInstagram.length - 1)} stopColor={color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill={trazo} />
    </Base>
  )
}

// La "G" de Google con sus cuatro colores (son los de esa marca, no de nuestra paleta: por eso van aquí y
// no en @theme). Solo para el botón que lleva a la ficha de la escuela en Google. Es de relleno, no de
// trazo: no usa Base.
export function IconoGoogle(props: IconoProps) {
  return (
    <svg viewBox="0 0 48 48" width="24" height="24" aria-hidden="true" focusable="false" {...props}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export function IconoFacebook(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
    </Base>
  )
}

export function IconoTelefono(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 7.5 7.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2z" />
    </Base>
  )
}

// Un sobre: para los enlaces de email.
export function IconoEmail(props: IconoProps) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7l8 6 8-6" />
    </Base>
  )
}

export function IconoWhatsApp(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8 19z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z" />
    </Base>
  )
}

// Flecha hacia abajo que cae en una bandeja: guardar o descargar un archivo.
export function IconoDescargar(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" />
    </Base>
  )
}

// Hoja con la esquina doblada: un documento (el PDF).
export function IconoDocumento(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z" />
      <path d="M14 3.5V8h4.5M9 13h6M9 16.5h4" />
    </Base>
  )
}

// Chincheta de mapa: ver dónde está algo en un mapa.
export function IconoMapa(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M12 21.5s-7-6.2-7-11.6a7 7 0 0 1 14 0c0 5.4-7 11.6-7 11.6z" />
      <circle cx="12" cy="9.9" r="2.6" />
    </Base>
  )
}

// Lupa con un "+": ampliar una imagen.
export function IconoAmpliar(props: IconoProps) {
  return (
    <Base {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L20 20M10.5 7.8v5.4M7.8 10.5h5.4" />
    </Base>
  )
}

export function IconoMenu(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  )
}

export function IconoCerrar(props: IconoProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  )
}

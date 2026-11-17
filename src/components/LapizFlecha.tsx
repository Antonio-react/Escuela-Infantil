// Flecha de lápiz de color (idea de Antonio): el ">" pintado en el color del lápiz y el lápiz apoyado justo donde
// termina el trazo, como si lo acabara de dibujar. Solo el dibujo (para un círculo blanco): el botón y su nombre
// accesible los pone quien lo usa. Reutilizable (galería; más adelante, visor del calendario, "Ver más", volver…).
// El de "anterior" es el mismo dibujo del revés (-scale-x-100). Al pasar el ratón por el botón (clase "group"), el
// trazo y el lápiz avanzan un poco hacia su lado.

type LapizFlechaProps = {
  direccion: 'anterior' | 'siguiente'
  // Color de la mina, del cuerpo y del trazo. Con contraste sobre blanco (verde, coral o ciruela de la marca).
  color: string
  className?: string
}

export function LapizFlecha({ direccion, color, className = '' }: LapizFlechaProps) {
  const avance = direccion === 'siguiente' ? 'group-hover:translate-x-0.5' : 'group-hover:-translate-x-0.5'
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      className={`block overflow-visible ${direccion === 'anterior' ? '-scale-x-100' : ''} ${className}`}
    >
      <g className={`transition-transform duration-200 ease-salida ${avance}`}>
        {/* El ">", con los tramos algo curvos, como hecho a mano. */}
        <path
          d="M33 22 Q42 31 50 40 Q42 49 33 58"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* El lápiz, dibujado en horizontal con la punta en el origen y girado sobre el final del trazo. El cuerpo,
            en tres caras (clara, su color y oscura) para que se vea hexagonal. */}
        <g transform="translate(35.5 60.5) rotate(-35)">
          <path d="M0 0 L9 -3.6 L9 3.6 Z" fill="#f1d3a1" />
          <path d="M0 0 L3.5 -1.4 L3.5 1.4 Z" fill={color} />
          <rect x="9" y="-3.6" width="26" height="7.2" fill={color} />
          <rect x="9" y="-3.6" width="26" height="2.4" style={{ fill: `color-mix(in oklab, ${color} 65%, white)` }} />
          <rect x="9" y="1.2" width="26" height="2.4" style={{ fill: `color-mix(in oklab, ${color} 70%, black)` }} />
          <rect x="35" y="-3.6" width="4" height="7.2" fill="#c3c7cd" />
          <rect x="39" y="-3.6" width="6" height="7.2" rx="2" fill="#f29bb0" />
        </g>
      </g>
    </svg>
  )
}

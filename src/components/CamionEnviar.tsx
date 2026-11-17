// Botón "Enviar" del formulario con forma de CAMIÓN DE BOMBEROS (idea de Antonio, 2026-11-16, con una referencia
// hecha con ChatGPT; el dibujo es propio, con el estilo de la web: contorno tinta, colores del logo).
// - El texto "Enviar" es texto de verdad (no parte del dibujo): es el nombre del botón para el lector de pantalla.
// - estado (data-estado, estilos .camion-* en index.css): 'apagado' (falta algo: algo apagado y sirena gris),
//   'listo' (a todo color, la sirena parpadea al ponerse listo y al pasar el ratón) y 'enviando' (arranca y sale
//   por la derecha con las ruedas girando).
// Medidas: viewBox 240 × 124; el texto va encima de la caja del camión (x 10-156, y 36-74).

type EstadoCamion = 'apagado' | 'listo' | 'enviando'

type CamionEnviarProps = {
  estado: EstadoCamion
  texto: string
  className?: string
}

const ROJO = 'var(--color-arbol-rojo-intenso)'
const GRIS = '#c9ccd1'
const TINTA = 'var(--color-tinta)'

// La escalera en horizontal (se gira al dibujarla), desde el eje (24, 33): largueros a 33 (abajo) y 22 (arriba),
// de x 24 a 154, unidos en las puntas, y la celosía en zigzag entre ellos cada 10 (triángulos).
const ESCALERA = (() => {
  const zigzag = Array.from({ length: 13 }, (_, i) => `${30 + i * 10} ${i % 2 ? 22 : 33}`).join(' L')
  return `M24 33H154V22H24Z M${zigzag}`
})()

// El paso de rueda: un arco rojo con contorno por encima de la rueda (como en la referencia), que corta el
// parachoques. Va fijo; la rueda gira dentro.
function PasoRueda({ cx }: { cx: number }) {
  return <path d={`M${cx - 21} 99a21 21 0 0 1 42 0Z`} fill={ROJO} stroke={TINTA} strokeWidth="3.5" strokeLinejoin="round" />
}

function Rueda({ cx }: { cx: number }) {
  return (
    <g className="camion-rueda">
      <circle cx={cx} cy="100" r="15" fill={TINTA} />
      <circle cx={cx} cy="100" r="7" fill={GRIS} stroke={TINTA} strokeWidth="2" />
      {/* Tornillos: así se ve que la rueda gira. */}
      {[0, 90, 180, 270].map((g) => (
        <circle key={g} cx={cx + 4 * Math.cos((g * Math.PI) / 180)} cy={100 + 4 * Math.sin((g * Math.PI) / 180)} r="1.2" fill={TINTA} />
      ))}
    </g>
  )
}

export function CamionEnviar({ estado, texto, className = '' }: CamionEnviarProps) {
  const sirena = estado === 'apagado' ? GRIS : ROJO
  return (
    // @container: la letra de "Enviar" se mide con el ancho del camión (12cqw), así crece y encoge con él.
    <span className={`camion-viaje @container relative inline-block ${className}`}>
      <svg viewBox="0 0 240 124" aria-hidden="true" focusable="false" className="block h-auto w-full overflow-visible">
        <g className="camion-cuerpo" strokeLinejoin="round" strokeLinecap="round">
          {/* Rayos de la sirena (amarillos), alrededor de la luz. */}
          <g className="camion-rayos" stroke="var(--color-arbol-naranja-intenso)" strokeWidth="4">
            <path d="M184 4v8M168 10l5 6M200 10l-5 6M160 24h7M208 24h-7" />
          </g>
          {/* La escalera (Antonio, 2026-11-16: la de antes no parecía real), apoyada sobre la caja: un soporte delante,
              y la escalera en sí, dibujada en horizontal y girada a su inclinación desde el eje de atrás (24, 33):
              dos largueros paralelos y, entre ellos, la celosía en triángulos, con los huecos vacíos (se ve el fondo).
              Cada pieza se pinta dos veces: primero gruesa en tinta (el contorno) y encima, más fina, en gris. */}
          <path d="M141 34V21" stroke={TINTA} strokeWidth="7" />
          <path d="M141 34V21" stroke={GRIS} strokeWidth="3.5" />
          <g transform="rotate(-7.2 24 33)" fill="none">
            <path d={ESCALERA} stroke={TINTA} strokeWidth="7" />
            <path d={ESCALERA} stroke={GRIS} strokeWidth="3.5" />
          </g>
          <circle cx="24" cy="33" r="7.5" fill="#6b6e75" stroke={TINTA} strokeWidth="3" />
          <circle cx="24" cy="33" r="2.2" fill={TINTA} />
          {/* Luz de atrás. */}
          <rect x="3" y="50" width="10" height="20" rx="3" fill="var(--color-arbol-naranja-intenso)" stroke={TINTA} strokeWidth="3" />
          {/* La caja (donde va "Enviar") y la cabina. */}
          <rect x="8" y="34" width="152" height="58" rx="9" fill={ROJO} stroke={TINTA} strokeWidth="3.5" />
          <path d="M160 40h34c4 0 7 2 9 5l17 24c2 3 3 6 3 9v14h-63Z" fill={ROJO} stroke={TINTA} strokeWidth="3.5" />
          {/* Ventana con su brillo y la manilla. */}
          <path d="M170 48h22l14 20h-36Z" fill="var(--color-nube)" stroke={TINTA} strokeWidth="3" />
          <path d="M178 66l10-15" stroke="white" strokeWidth="3" opacity="0.7" />
          <path d="M174 76h10" stroke={TINTA} strokeWidth="3" />
          {/* La sirena en el techo de la cabina: gris (apagada) hasta que se puede enviar. */}
          <rect x="174" y="34" width="20" height="7" rx="2" fill="#6b6e75" stroke={TINTA} strokeWidth="3" />
          <path d="M176 34a8 8 0 0 1 16 0Z" fill={sirena} stroke={TINTA} strokeWidth="3" />
          {/* Franja amarilla de lado a lado y el faro. */}
          <path d="M10 80h212" stroke="var(--color-arbol-naranja-intenso)" strokeWidth="6" strokeLinecap="butt" />
          <circle cx="216" cy="70" r="4" fill="var(--color-arbol-naranja-intenso)" stroke={TINTA} strokeWidth="2.5" />
          {/* Parachoques. */}
          <rect x="2" y="90" width="230" height="9" rx="4.5" fill={GRIS} stroke={TINTA} strokeWidth="3" />
          <PasoRueda cx={52} />
          <PasoRueda cx={190} />
        </g>
        <Rueda cx={52} />
        <Rueda cx={190} />
      </svg>
      {/* "Enviar" sobre la caja: blanco con contorno tinta, como letras pintadas en el camión. El contorno se pinta
          detrás del relleno (paint-order) para que la letra no adelgace. */}
      <span className="absolute top-[29%] left-[4%] flex h-[30%] w-[62%] items-center justify-center font-titulo text-[12cqw] leading-none font-bold tracking-wide text-white uppercase [-webkit-text-stroke:6px_var(--color-tinta)] [paint-order:stroke_fill]">
        {texto}
      </span>
    </span>
  )
}

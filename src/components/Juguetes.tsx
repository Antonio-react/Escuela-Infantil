import type { SVGProps } from 'react'

// Osito y juguetes dibujados a mano, planos y con los colores de la marca (variables de @theme).
// Decorativos: siempre aria-hidden. Se usan como separadores en la barra de datos, en el menú de móvil
// y servirán para los "juguetes en el suelo" de las secciones (CLAUDE.md, sección 6).
//
// Recolorear sin duplicar: los que van en el menú pintan su color con variables CSS que tienen un valor
// por defecto, por ejemplo var(--juguete, var(--color-mostaza)). Si nadie define --juguete, se ven como
// siempre; el menú las define con el color de cada página.
//   --juguete        color principal
//   --juguete-claro  detalles claros (orejas, hocico, ala...)
//   --juguete-pico   pico del patito

type JugueteProps = SVGProps<SVGSVGElement>

function Base({ children, ...props }: JugueteProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  )
}

export function Osito(props: JugueteProps) {
  return (
    <Base {...props}>
      <circle cx="7.5" cy="8.5" r="5" fill="var(--juguete, var(--color-mostaza))" />
      <circle cx="24.5" cy="8.5" r="5" fill="var(--juguete, var(--color-mostaza))" />
      <circle cx="7.5" cy="8.5" r="2.4" fill="var(--juguete-claro, var(--color-mostaza-suave))" />
      <circle cx="24.5" cy="8.5" r="2.4" fill="var(--juguete-claro, var(--color-mostaza-suave))" />
      <circle cx="16" cy="17.5" r="11.5" fill="var(--juguete, var(--color-mostaza))" />
      <ellipse cx="16" cy="21.5" rx="5.5" ry="4.2" fill="var(--juguete-claro, var(--color-mostaza-suave))" />
      <circle cx="11.6" cy="15.2" r="1.5" fill="var(--color-tinta)" />
      <circle cx="20.4" cy="15.2" r="1.5" fill="var(--color-tinta)" />
      <ellipse cx="16" cy="19.8" rx="1.9" ry="1.4" fill="var(--color-tinta)" />
      <path d="M16 21.2v1.4M13.8 23.2c1.2 1.1 3.2 1.1 4.4 0" stroke="var(--color-tinta)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </Base>
  )
}

export function Pelota(props: JugueteProps) {
  return (
    <Base {...props}>
      <circle cx="16" cy="16" r="13" fill="var(--color-coral)" />
      <path d="M16 3c-5.5 4-5.5 22 0 26M16 3c5.5 4 5.5 22 0 26" stroke="var(--color-white)" strokeWidth="2.2" fill="none" />
      <path d="M3.4 13.5c7.5 2.6 17.7 2.6 25.2 0" stroke="var(--color-mostaza-suave)" strokeWidth="2.2" fill="none" />
    </Base>
  )
}

export function Bloque(props: JugueteProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="3.5" width="25" height="25" rx="5" fill="var(--juguete, var(--color-salvia))" />
      <rect x="7.5" y="7.5" width="17" height="17" rx="3" fill="none" stroke="var(--color-white)" strokeWidth="1.4" />
      <path d="M12.6 22l3.4-11 3.4 11M13.7 18.4h4.6" stroke="var(--color-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Base>
  )
}

export function Patito(props: JugueteProps) {
  return (
    <Base {...props}>
      {/* Colores por defecto: los del patito de goma (--color-patito*, index.css). El menú y la barra de arriba los
          cambian por el de su página con --juguete. */}
      <path d="M4 18c0 6 5 10 12 10s12-3.5 12-8.5c0-2.5-1.5-3.5-3.5-2.5-2 1-4 1-5.5-.5H8c-2.5 0-4 .5-4 1.5z" fill="var(--juguete, var(--color-patito))" />
      <circle cx="12" cy="11" r="6.5" fill="var(--juguete, var(--color-patito))" />
      <path d="M4.2 11.6c-2 .2-3 1.2-2.6 2.2.5 1.1 2.4 1 4.4.2z" fill="var(--juguete-pico, var(--color-patito-pico))" />
      <circle cx="10.2" cy="9.6" r="1.3" fill="var(--color-tinta)" />
      <path d="M14 20c2.5 2 6 2 8.5-.5" stroke="var(--juguete-claro, var(--color-patito-claro))" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </Base>
  )
}

export function Manzana(props: JugueteProps) {
  return (
    <Base {...props}>
      <path
        d="M16 9.5c-3-2.6-9.4-2.2-10.8 3.6C3.8 19 7.4 27.3 12 28.3c1.6.4 2.7-.7 4-.7s2.4 1.1 4 .7c4.6-1 8.2-9.3 6.8-15.2C25.4 7.3 19 6.9 16 9.5z"
        fill="var(--juguete, var(--color-coral))"
      />
      <path d="M16 9.5c0-2.6.6-4.6 2.2-6.3" stroke="var(--color-tinta)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M17.4 6.4c1.8-2.7 5.4-3.4 7.6-2.4-1 2.6-4.3 4.2-7.6 2.4z" fill="var(--juguete-claro, var(--color-salvia))" />
      <ellipse cx="10.4" cy="14.6" rx="1.6" ry="2.6" transform="rotate(20 10.4 14.6)" fill="var(--color-white)" opacity="0.7" />
    </Base>
  )
}

// Mochila roja de cole (la de una foto de la escuela). Antonio, 2026-11-16, con una referencia de icono de emoji
// (mochila coral de tres cuartos): dibujo PROPIO con ese estilo, plano y sin contorno: el cuerpo con la parte de
// arriba más clara, el lado derecho más oscuro, la cremallera gris que recorre lo de arriba y baja por el lado con su
// tirador amarillo, el asa gris, la correa que da la vuelta por la derecha (con su hebilla y la cinta marrón), el
// bolsillo de delante con la solapa enrollada y una etiqueta clara.
const MOCHILA = {
  cuerpo: '#f44f3b',
  claro: '#ff7a5c',
  oscuro: '#c8302b',
  hueco: '#743a40', // el interior de las correas
  gris: '#4a5a63',
  melocoton: '#fdb27a',
  melocotonOscuro: '#f8a06a',
  amarillo: '#f7c02b',
  marron: '#8a5634',
}
export function Mochila(props: JugueteProps) {
  const m = MOCHILA
  return (
    <Base {...props}>
      {/* La correa de la derecha, que da la vuelta por detrás (con su interior oscuro arriba) */}
      <path d="M17 5.6c3.6-1.6 8-1.2 10.6 1.6 2.4 2.6 3 7.6 2.9 13l-2.6.4c.1-4.7-.4-8.7-2.1-10.8-1.7-2-4.4-2.4-7-1.4z" fill={m.cuerpo} />
      <path d="M24.4 7.6c1.6.6 2.6 1.6 3.2 3.2l-2.7.7c-.4-.8-.9-1.3-1.6-1.6z" fill={m.hueco} />
      {/* Hebilla y cinta marrón que baja por detrás del cuerpo */}
      <path d="M28.6 21.6l-3.4 6.6 1.6.7 3.2-6.7z" fill={m.marron} />
      <rect x="26.8" y="20.2" width="3.6" height="2.4" rx="0.6" fill={m.gris} />
      {/* La correa de la izquierda, asomando arriba */}
      <path d="M5 7.4c0-3 1.3-5.4 3.6-5.6 1.6-.2 2.4 1.2 2.4 2.6l-.2 2.4L6.6 9z" fill={m.claro} />
      <path d="M9.2 3c.6.4.9 1.1.9 2l-.2 1.9-1.5.6z" fill={m.hueco} />
      {/* El asa de arriba */}
      <path d="M11.2 5.4 12.4 1.6h3.4l1.4 3.8" fill="none" stroke={m.gris} strokeWidth="1.7" strokeLinejoin="round" />
      {/* El cuerpo: arriba en cúpula, abajo redondeado */}
      <path d="M2 28.4c-.8-5.2-.6-12.4 1.8-17.2C6.2 6.6 10.4 4.6 14.6 4.6c5 0 8.2 3 9.2 7.6l1 15.2c.1 2.6-1.8 3.8-4.4 3.8H5c-1.6 0-2.8-1-3-2.8z" fill={m.cuerpo} />
      {/* La parte de arriba, más clara (la luz) */}
      <path d="M3.8 11.2C6.2 6.6 10.4 4.6 14.6 4.6c5 0 8.2 3 9.2 7.6l-1.6.4c-1.4-3.6-4.2-5.6-8-5.6-3.8 0-7.2 1.8-9.4 5.4z" fill={m.claro} />
      {/* El lado derecho, más oscuro */}
      <path d="M20 12c1.4-.6 2.6 0 3 1.4l.8 13.6c.1 2.2-.8 3.6-2.6 4.2-.6-5.4-.8-12.6-1.2-19.2z" fill={m.oscuro} />
      {/* La cremallera: por arriba y bajando por el lado, con el tirador amarillo */}
      <path d="M4.4 9.4c2.4-2.6 6-3.8 9.8-3.8 3.6 0 6.4 1.8 7.6 5.2.8 2.4 1.2 6.8 1.4 13.4" fill="none" stroke={m.gris} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M22.4 24.2c.8-.3 1.6.2 2 .8l.6 1.4-1.8.8c-.6-.2-.9-.6-1-1.2z" fill={m.amarillo} />
      {/* La etiqueta clara de arriba */}
      <rect x="7.8" y="11.4" width="5.2" height="3.2" rx="0.9" fill={m.melocoton} />
      {/* El bolsillo de delante: la solapa enrollada (clara arriba, rollo oscuro a la derecha) y su parte de abajo */}
      <path d="M3.6 23.2c0-1.4.9-2.2 2.2-2.2h11.8v7.4H5.4c-1.2 0-1.8-.8-1.8-1.8z" fill={m.claro} />
      <path d="M3.6 21.6c0-1 .8-1.8 2-1.8h11.4l.4 3.6H5.6c-1.2 0-2-.6-2-1.8z" fill={m.melocotonOscuro} />
      <path d="M3.6 22.6c.4.6 1 .9 1.8.9h12" fill="none" stroke={m.oscuro} strokeWidth="0.6" />
      <rect x="15.6" y="19.8" width="3.2" height="8.8" rx="1.6" fill={m.oscuro} />
    </Base>
  )
}

// Fresa: como el dibujo de vinilo de una ventana de las aulas (foto de Antonio, 2026-11-16): plana, con un contorno
// oscuro fino. Dibujo propio.
export function Fresa(props: JugueteProps) {
  return (
    <Base {...props}>
      <g stroke="var(--color-tinta)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {/* La fresa: ancha arriba y en punta abajo */}
        <path d="M16 9.6c-6.6 0-10.4 2.6-9.9 7 .6 5.2 5.4 10.6 9.9 12 4.5-1.4 9.3-6.8 9.9-12 .5-4.4-3.3-7-9.9-7z" fill="var(--color-arbol-rojo-intenso)" />
        {/* Las hojas verdes de arriba y el rabito */}
        <path
          d="M8.6 11.2c2-1.6 4.2-1.8 5.6-.9l-.9-3.8c1.6.5 2.4 1.9 2.7 3.3.3-1.4 1.1-2.8 2.7-3.3l-.9 3.8c1.4-.9 3.6-.7 5.6.9-2.2 1.7-5 2.3-7.4 1.4-2.4.9-5.2.3-7.4-1.4z"
          fill="var(--color-arbol-verde-intenso)"
        />
        <path d="M16 7.5V4.2" fill="none" />
      </g>
      {/* Pepitas */}
      {[
        [11.5, 15.5],
        [16, 15],
        [20.5, 15.5],
        [13.5, 19.5],
        [18.5, 19.5],
        [16, 23.5],
        [11, 20.5],
        [21, 20.5],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="0.8" ry="1.1" fill="var(--color-mostaza-suave)" />
      ))}
    </Base>
  )
}

// Teléfono de juguete: base con dial y el auricular encima.
export function TelefonoJuguete(props: JugueteProps) {
  return (
    <Base {...props}>
      <path
        d="M4.5 9.2C4.5 7 7.5 5 16 5s11.5 2 11.5 4.2v1.5c0 1-1 1.6-2 1.3l-3-1c-.8-.3-1.2-1-1.2-1.8v-.8C19.8 8 18 7.9 16 7.9s-3.8.1-5.3.5v.8c0 .8-.4 1.5-1.2 1.8l-3 1c-1 .3-2-.3-2-1.3z"
        fill="var(--juguete, var(--color-azul))"
      />
      <path d="M8.5 13.5h15l3.3 11.2c.4 1.4-.6 2.8-2 2.8H7.2c-1.4 0-2.4-1.4-2-2.8z" fill="var(--juguete, var(--color-azul))" />
      <circle cx="16" cy="20.5" r="4.6" fill="var(--color-white)" />
      <circle cx="16" cy="20.5" r="1.4" fill="var(--juguete-claro, var(--color-azul-suave))" />
    </Base>
  )
}

// Despertador de juguete: dos campanas arriba, esfera blanca y agujas a las 3 en punto.
export function Reloj(props: JugueteProps) {
  return (
    <Base {...props}>
      <path d="M4.2 9.6a4.6 4.6 0 0 1 6.6-6.2zM27.8 9.6a4.6 4.6 0 0 0-6.6-6.2z" fill="var(--juguete, var(--color-azul))" />
      <path d="M9.5 26.5l-2 2.5M22.5 26.5l2 2.5" stroke="var(--juguete, var(--color-azul))" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="17" r="11.5" fill="var(--juguete, var(--color-azul))" />
      <circle cx="16" cy="17" r="8.4" fill="var(--color-white)" />
      <circle cx="16" cy="11.4" r="0.9" fill="var(--juguete-claro, var(--color-azul-suave))" />
      <circle cx="21.6" cy="17" r="0.9" fill="var(--juguete-claro, var(--color-azul-suave))" />
      <circle cx="16" cy="22.6" r="0.9" fill="var(--juguete-claro, var(--color-azul-suave))" />
      <circle cx="10.4" cy="17" r="0.9" fill="var(--juguete-claro, var(--color-azul-suave))" />
      <path d="M16 17v-4.2M16 17h3.6" stroke="var(--color-tinta)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="17" r="1.1" fill="var(--color-tinta)" />
    </Base>
  )
}

// Hucha de cerdito (Familias: pago a través de empresa), de perfil y mirando a la derecha: cuerpo rosa con dos
// patas, hocico alargado, oreja pequeña, colita rizada y una moneda dorada entrando por la ranura del lomo.
// Rosa: el rojo del árbol en suave (--color-arbol-rojo); detalles en coral. Dibujo propio (referencia de Antonio).
export function Hucha(props: JugueteProps) {
  return (
    <Base {...props}>
      {/* Colita rizada */}
      <path d="M5.6 18.4c-2 .4-3.4-.6-3-2s2.2-1.2 2 .2-1.8 1.6-2.6.6" stroke="var(--juguete, var(--color-arbol-rojo))" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* Patas */}
      <rect x="9" y="23" width="4" height="6.2" rx="1.4" fill="var(--juguete, var(--color-arbol-rojo))" />
      <rect x="19.4" y="23" width="4" height="6.2" rx="1.4" fill="var(--juguete, var(--color-arbol-rojo))" />
      {/* Cuerpo y hocico */}
      <ellipse cx="16" cy="19" rx="11" ry="8" fill="var(--juguete, var(--color-arbol-rojo))" />
      <rect x="24.4" y="15.6" width="5.6" height="6" rx="2.2" fill="var(--juguete, var(--color-arbol-rojo))" />
      {/* Oreja */}
      <path d="M20.6 12.4c.4-2.2 1.8-3.4 3.6-3.4.2 1.8-.8 3.4-2.4 4.2z" fill="var(--color-coral)" />
      {/* Ojo */}
      <circle cx="23.4" cy="16.6" r="1.1" fill="var(--color-tinta)" />
      {/* Ranura y moneda entrando */}
      <path d="M12.4 11.6h6.2" stroke="var(--color-tinta)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="15.5" cy="6.6" r="4.4" fill="var(--color-arbol-naranja-intenso)" />
      <circle cx="15.5" cy="6.6" r="2.7" fill="var(--color-mostaza)" />
      <rect x="14.8" y="5.9" width="1.4" height="1.4" rx="0.3" fill="var(--color-arbol-naranja-intenso)" />
    </Base>
  )
}

// --- Destinos de las excursiones (La escuela, aula de 2 a 3 años): vaca (granja escuela), jirafa (zoo) y colegio.
// Dibujos planos como los juguetes. ---

// Vaca de la granja escuela, de frente (solo la cabeza: se reconoce mejor que de cuerpo entero): cara blanca con
// manchas negras, cuernecitos, orejas, ojos y el hocico rosa con los agujeritos.
export function Vaca(props: JugueteProps) {
  return (
    <Base {...props}>
      {/* Cuernos y orejas */}
      <path d="M9.4 7.6c-1.2-1.6-1.2-3.6 0-5 .6 1.6 1.6 2.8 2.8 3.4zM22.6 7.6c1.2-1.6 1.2-3.6 0-5-.6 1.6-1.6 2.8-2.8 3.4z" fill="var(--color-mostaza)" />
      <ellipse cx="5" cy="11" rx="4" ry="2.2" transform="rotate(-18 5 11)" fill="var(--color-tinta)" />
      <ellipse cx="27" cy="11" rx="4" ry="2.2" transform="rotate(18 27 11)" fill="var(--color-tinta)" />
      {/* Cara y manchas */}
      <path d="M8.4 9.6C8.4 6.6 11.6 5 16 5s7.6 1.6 7.6 4.6v9.6H8.4z" fill="var(--color-white)" stroke="var(--color-tinta)" strokeWidth="1.2" />
      <path d="M8.9 9.4c0-2.4 1.6-3.6 4.4-3.8-.4 2 .4 3.8 2 4.6-1.6 1.6-4 1.6-6.4.6z" fill="var(--color-tinta)" />
      <circle cx="21" cy="12.4" r="1.9" fill="var(--color-tinta)" />
      {/* Ojos */}
      <circle cx="12.6" cy="13" r="1.15" fill="var(--color-tinta)" />
      <circle cx="19.4" cy="15.4" r="1.15" fill="var(--color-tinta)" />
      {/* Hocico con los agujeritos */}
      <rect x="7.4" y="17.4" width="17.2" height="10" rx="5" fill="var(--color-arbol-rojo)" stroke="var(--color-tinta)" strokeWidth="1.2" />
      <ellipse cx="12.6" cy="22.4" rx="1.2" ry="1.6" fill="var(--color-coral)" />
      <ellipse cx="19.4" cy="22.4" rx="1.2" ry="1.6" fill="var(--color-coral)" />
    </Base>
  )
}

// Jirafa del zoo, de perfil: cuello largo con manchas, cabeza, cuernecitos, oreja y ojo.
export function Jirafa(props: JugueteProps) {
  return (
    <Base {...props}>
      <path d="M11 30V13.5c0-1.6 1.2-2.8 2.8-2.8h1.4c1.6 0 2.8 1.2 2.8 2.8V30z" fill="var(--color-arbol-naranja-intenso)" />
      <path d="M12.2 9.6c0-2.6 2.2-4.6 5.4-4.6 3.8 0 7.4 1.6 7.4 4.4 0 2.2-2.6 3.4-6 3.4-4 0-6.8-1-6.8-3.2z" fill="var(--color-arbol-naranja-intenso)" />
      <path d="M14.6 5.4V2.4M17.6 5V2" stroke="var(--color-madera-oscura)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.6" cy="2.2" r="1.1" fill="var(--color-madera-oscura)" />
      <circle cx="17.6" cy="1.9" r="1.1" fill="var(--color-madera-oscura)" />
      <path d="M12.6 7.4c-1.8-.6-3-.2-3.4.8 1 .6 2.4.6 3.6 0z" fill="var(--color-madera)" />
      <circle cx="18.6" cy="8.4" r="1" fill="var(--color-tinta)" />
      <g fill="var(--color-madera)">
        <circle cx="13.3" cy="16" r="1.3" />
        <circle cx="16" cy="20" r="1.5" />
        <circle cx="13.2" cy="23.8" r="1.2" />
        <circle cx="16.2" cy="27" r="1.3" />
      </g>
    </Base>
  )
}

// Colegio: edificio con frontón y reloj, puerta, dos ventanas y una bandera en lo alto.
export function Colegio(props: JugueteProps) {
  return (
    <Base {...props}>
      <path d="M16 6.5V1.5" stroke="var(--color-tinta)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M16.6 1.6h5l-1.4 1.6 1.4 1.6h-5z" fill="var(--color-arbol-rojo-intenso)" />
      <path d="M4 13 16 6.5 28 13z" fill="var(--color-arbol-azul-texto)" />
      <rect x="5" y="13" width="22" height="16" fill="var(--color-arbol-azul)" />
      <circle cx="16" cy="10.6" r="2.2" fill="var(--color-white)" />
      <path d="M16 9.6v1.1h.9" stroke="var(--color-tinta)" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M13 29v-6.4a3 3 0 0 1 6 0V29z" fill="var(--color-arbol-azul-texto)" />
      <rect x="7.4" y="16.4" width="4" height="4" rx="0.6" fill="var(--color-white)" />
      <rect x="20.6" y="16.4" width="4" height="4" rx="0.6" fill="var(--color-white)" />
      <path d="M3 29.2h26" stroke="var(--color-tinta)" strokeWidth="1.6" strokeLinecap="round" />
    </Base>
  )
}

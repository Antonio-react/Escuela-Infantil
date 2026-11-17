// Fotos de la escuela, enviadas por las dueñas. Si una lista está vacía, su hueco no se pinta: nunca se ve un
// recuadro vacío. Para añadir una:
//  1. El original a docs/referencias/fotos/ (vale en subcarpetas) y `npm run imagenes` la deja optimizada en
//     src/assets/fotos/, en dos tamaños (1400 y "-800"). Si salen fotos de niños (en la pared, por ejemplo), sus
//     zonas se difuminan en FOTOS_DIFUMINAR del script.
//  2. Se añade a la lista con archivos('su-nombre'), su título, su texto alternativo y sus medidas reales (evitan
//     saltos al cargar; las da el propio script al terminar).
//  3. Con el visto bueno, se borra el original (no se guarda en el proyecto).
// Mejor sin niños o sin caras reconocibles; si salen niños, con el permiso de cada familia.

// Todas las fotos de la carpeta de una vez (import.meta.glob de Vite: como un import por archivo, sin escribirlos).
// La clave es la ruta del archivo y el valor, su dirección final en la web (con su huella para la caché).
const carpeta = import.meta.glob<string>('../assets/fotos/**/*.webp', { eager: true, import: 'default' })

// Las dos versiones de una foto por su nombre ('bebes', 'actividades/3'…). Si falta alguna, error claro al compilar
// o al abrir la web en desarrollo, en vez de una foto rota.
function archivos(nombre: string) {
  const src = carpeta[`../assets/fotos/${nombre}.webp`]
  const srcPequena = carpeta[`../assets/fotos/${nombre}-800.webp`]
  if (!src || !srcPequena) throw new Error(`Falta la foto "${nombre}" en src/assets/fotos (npm run imagenes)`)
  return { src, srcPequena }
}

// srcset de una foto: las dos versiones con su ancho real. Con el atributo sizes (cuánto ocupa en pantalla, lo pone
// cada componente), el navegador elige la justa para esa pantalla y su densidad de píxeles.
export const srcSet = (foto: Foto) => `${foto.srcPequena} 800w, ${foto.src} ${foto.ancho}w`

export type Foto = {
  // La foto a 1400 px (visor, foto grande, móvil a pantalla completa)…
  src: string
  // …y a 800 px: la que piden la rejilla, el corcho y la fachada en casi todas las pantallas (srcset).
  srcPequena: string
  // Nombre corto: se lee en el visor, junto al contador ("Psicomotricidad · 1 de 10").
  titulo: string
  alt: string
  ancho: number
  alto: number
  // Hueco que ocupa en la rejilla de "Así es la escuela" (GaleriaEscuela.tsx); sin encaje, uno normal.
  // Están elegidos para que en escritorio (3 columnas) y en tablet (2) no quede ningún hueco: si se añade o se
  // quita una foto, revisar el encaje de las demás.
  encaje?: 'grande' | 'alta' | 'ancha'
}

// La entrada: solo arriba de La escuela (fotoCabeceraEscuela). Ya no va en la galería (Antonio, 2026-11-17: se veía
// dos veces en la misma página).
const entrada: Foto = {
  ...archivos('entrada'),
  titulo: 'La entrada',
  alt: 'Mural de la entrada con animales de la selva y el cartel "Bienvenidos a la aventura de crecer y aprender"',
  ancho: 1125,
  alto: 835,
}

// Foto del arranque de La escuela (CabeceraPagina), junto a las cifras: lo primero que se ve al entrar en la escuela
// (Antonio, 2026-11-17; antes, juguetes sobre una nube como hueco provisional). Con null, no se pinta.
export const fotoCabeceraEscuela: Foto | null = entrada

// "Así es la escuela", en el orden de Antonio (es el del visor; en la rejilla, el patio de arena rellena el hueco
// junto al baño: ver GaleriaEscuela.tsx).
export const fotosEscuela: readonly Foto[] = [
  {
    ...archivos('psicomotricidad'),
    titulo: 'Psicomotricidad',
    alt: 'Sala de psicomotricidad: piscina de bolas de colores, escaleras y rampas de goma espuma y un túnel para gatear',
    ancho: 1400,
    alto: 1050,
    encaje: 'grande',
  },
  {
    ...archivos('bebes'),
    titulo: 'Aula de bebés',
    alt: 'Aula de bebés: zona de descanso con cunas de madera bajo el rótulo "Dulces sueños", alfombras de juego y juguetes blandos',
    ancho: 1400,
    alto: 1050,
  },
  {
    ...archivos('1-2-anos'),
    titulo: 'Aula de 1 a 2 años',
    alt: 'Aula de 1 a 2 años: paredes verdes, mesa con juguetes de cuentas, alfombra de puzle y un espejo a la altura de los peques',
    ancho: 1400,
    alto: 1050,
  },
  {
    ...archivos('2-3-anos'),
    titulo: 'Aula de 2 a 3 años',
    alt: 'Aula de 2 a 3 años: mesas y sillas pequeñas, un árbol de papel que llega al techo, un rincón de biblioteca y un gran ventanal',
    ancho: 1400,
    alto: 1050,
  },
  {
    ...archivos('bano-ninos'),
    titulo: 'El baño',
    alt: 'Baño de los peques con lavabos e inodoros a su altura y una ducha',
    ancho: 1400,
    alto: 1867,
    encaje: 'alta',
  },
  {
    ...archivos('patio'),
    titulo: 'El patio',
    alt: 'Patio con césped artificial, toboganes, balancines y triciclos',
    ancho: 1400,
    alto: 1050,
    encaje: 'ancha',
  },
  {
    ...archivos('patio-exterior'),
    titulo: 'El patio de arena',
    alt: 'Patio exterior de arena con un toldo, columpio, neumáticos para jugar y camiones de juguete, rodeado de árboles',
    ancho: 1400,
    alto: 1039,
  },
]

// "Algunas actividades" (Familias), pinchadas en un corcho. Pocas, a propósito (Antonio). El encaje no se usa aquí.
export const fotosActividades: readonly Foto[] = [
  {
    ...archivos('actividades/1'),
    titulo: 'Pintamos el otoño',
    alt: 'Mesas preparadas para pintar: hojas de otoño de papel, cuencos con pintura y esponjas para estampar',
    ancho: 1400,
    alto: 1050,
  },
  {
    ...archivos('actividades/2'),
    titulo: 'Mural de flores',
    alt: 'Mesa larga cubierta de papel con flores de colores dibujadas y pompones para decorarlas',
    ancho: 1400,
    alto: 1867,
  },
  {
    ...archivos('actividades/3'),
    titulo: 'Rincón de primavera',
    alt: 'Rincón de primavera preparado para explorar: girasoles, pañuelos de colores colgados y platos, botellas y juguetes sobre el suelo',
    ancho: 1400,
    alto: 1050,
  },
  {
    ...archivos('actividades/4'),
    titulo: 'La telaraña',
    alt: 'Estructura de tubos con una telaraña de cuerdas, aros y pañuelos de colores para pasar por dentro y explorar',
    ancho: 1125,
    alto: 1280,
  },
  {
    ...archivos('actividades/5'),
    titulo: 'Navidad en el aula',
    alt: 'Aula decorada por Navidad: casitas de cartón, galletas de jengibre de papel y el suelo cubierto de tiras de papel como si fuera nieve',
    ancho: 1400,
    alto: 1050,
  },
]

// La escuela desde fuera: en Inicio (junto a "Quiénes somos") y en Contacto, mientras carga el mapa de Google.
// PROVISIONAL (mejorada con un programa: poca calidad y el cartel con letras inventadas): cuando llegue la nueva, se
// cambia y sale sola en los dos sitios.
export const fotoFachada: Foto | null = {
  ...archivos('fachada'),
  titulo: 'La escuela',
  alt: 'Fachada de la Escuela Infantil Árbol de Nubes: edificio amarillo y rojo con el cartel de la escuela y dibujos en las ventanas',
  ancho: 1400,
  alto: 658,
}

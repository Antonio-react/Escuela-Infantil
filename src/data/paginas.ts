import { site } from './site.ts'

export type Pagina = {
  ruta: string
  nombre: string // texto del menú y del h1
  titulo: string // <title> de la pestaña
  descripcion: string // <meta name="description">
  // Texto de su pieza de puzzle en Inicio (ResumenPaginas), si tiene que ser más corto que la descripción. Sin él,
  // la pieza usa la descripción.
  resumen?: string
  enMenu: boolean
  // Fondo del enlace del menú cuando es la página activa: un color del árbol del logo (index.css).
  // La clase va escrita entera (no se construye con variables) para que Tailwind la encuentre.
  colorActivo: string
  // Solo páginas del menú: juguete que acompaña al nombre en el menú de móvil y su color intenso
  // (el mismo color del árbol, al 100 %). El "?" las hace opcionales: las legales no los llevan.
  juguete?: 'osito' | 'bloque' | 'reloj' | 'patito' | 'telefono'
  colorIntenso?: string
  // Color del h1 de la página (CabeceraPagina): el de la página, en su versión que se lee sobre crema (Antonio,
  // 2026-11-17: todos los títulos eran verdes). Sin él, verde. Inicio no lo usa: su título es el logo del hero.
  colorTitulo?: 'text-verde' | 'text-arbol-azul-texto' | 'text-coral' | 'text-ciruela'
  // false: Google no la guarda ("noindex") y no va en el sitemap. Sin él, se indexa (si site.web.indexar lo permite).
  indexar?: false
}

const marca = site.nombre

// Descripción de Contacto, por partes (BORRADOR, 2026-11-13). Unidas, son la descripción para Google; en la cabecera
// de Contacto, cada vía va en su color (Contacto.tsx). Orden: email, teléfono y WhatsApp, el último porque es por
// donde las dueñas prefieren que menos les escriban.
export const partesDescripcionContacto = {
  antes: 'Venid a conocernos rellenando la hoja de aquí abajo o, si lo preferís, escribidnos por',
  email: 'email',
  telefono: 'teléfono',
  whatsapp: 'WhatsApp',
  medio: '. Os esperamos en',
  // Completa (Antonio). En la cabecera es un enlace a Google Maps.
  direccion: `${site.direccion.calle}, ${site.direccion.codigoPostal} ${site.direccion.municipio} (${site.direccion.provincia})`,
  direccionAria: 'se abre Google Maps en otra pestaña',
} as const
const pd = partesDescripcionContacto

// "satisfies" comprueba que cada página cumple el tipo Pagina sin perder los valores exactos de "as const".
export const paginas = {
  inicio: {
    ruta: '/',
    nombre: 'Inicio',
    titulo: `${marca} · ${site.direccion.municipio} (${site.direccion.provincia})`,
    // Descripciones de las páginas: explican un poco, no solo enumeran (Antonio, 2026-11-13). BORRADOR. Son también
    // la descripción para Google y el texto de las tarjetas de "Conoce la escuela" en Inicio.
    descripcion: `Escuela infantil de 0 a 3 años en ${site.direccion.municipio} (${site.direccion.provincia}), pequeña y familiar: un aula para cada edad, comida casera hecha cada día y abierta de ${site.horario.apertura} a ${site.horario.cierre}. Matrícula abierta todo el año.`,
    enMenu: true,
    colorActivo: 'bg-arbol-naranja', // naranja de la "a" de "Escuela": bienvenida, alegría, el sol
    juguete: 'osito',
    colorIntenso: 'var(--color-arbol-naranja-intenso)',
  },
  laEscuela: {
    ruta: '/la-escuela',
    nombre: 'La escuela',
    titulo: `La escuela · ${marca}`,
    descripcion: 'Conoced por dentro la escuela donde vuestro peque pasará el día.',
    enMenu: true,
    colorActivo: 'bg-arbol-verde', // verde: el árbol, crecer
    juguete: 'bloque',
    colorIntenso: 'var(--color-arbol-verde-intenso)',
    colorTitulo: 'text-verde',
  },
  horarioCalendario: {
    ruta: '/horario-y-calendario',
    nombre: 'Horario y calendario',
    titulo: `Horario y calendario · ${marca}`,
    descripcion: `Abrimos de ${site.horario.apertura} a ${site.horario.cierre} y podéis ampliar o cambiar de horario cuando lo necesitéis.`,
    enMenu: true,
    colorActivo: 'bg-arbol-azul', // azul cielo: el día y el paso del tiempo
    juguete: 'reloj',
    colorIntenso: 'var(--color-arbol-azul-intenso)',
    colorTitulo: 'text-arbol-azul-texto',
  },
  familias: {
    ruta: '/familias',
    nombre: 'Familias',
    titulo: `Familias · ${marca}`,
    // BORRADOR (2026-11-13): explica un poco, no solo enumera (Antonio). Es también la descripción para Google.
    descripcion: 'Todo lo que necesitáis para empezar con tranquilidad.',
    enMenu: true,
    colorActivo: 'bg-arbol-rojo', // rojo: el corazón, el cariño y el vínculo con las familias
    juguete: 'patito',
    colorIntenso: 'var(--color-arbol-rojo-intenso)',
    colorTitulo: 'text-coral',
  },
  contacto: {
    ruta: '/contacto',
    nombre: 'Contacto',
    titulo: `Contacto · ${marca}`,
    descripcion: `${pd.antes} ${pd.email}, ${pd.telefono} o ${pd.whatsapp}${pd.medio} ${pd.direccion}.`,
    // En la pieza de Inicio, en 2 líneas y con la dirección completa (Antonio, 2026-11-19: la descripción ocupaba 6).
    // "C/" en vez de "Calle" para que quepa (la calle sale de site.ts).
    resumen: `Os esperamos en ${site.direccion.calle.replace(/^Calle /, 'C/ ')}, ${site.direccion.municipio}. Solicitad vuestra visita.`,
    enMenu: true,
    colorActivo: 'bg-arbol-morado', // morado: cercanía, el color del rótulo "Escuela" (y no azul junto a la nube)
    juguete: 'telefono',
    colorIntenso: 'var(--color-arbol-morado-intenso)',
    colorTitulo: 'text-ciruela',
  },
  avisoLegal: {
    ruta: '/aviso-legal',
    nombre: 'Aviso legal',
    titulo: `Aviso legal · ${marca}`,
    descripcion: `Quién está detrás de la web de ${marca}: los datos de la empresa titular y de su autorización como centro educativo.`,
    enMenu: false,
    colorActivo: 'bg-arbol-verde',
  },
  privacidad: {
    ruta: '/privacidad',
    nombre: 'Política de privacidad',
    titulo: `Política de privacidad · ${marca}`,
    descripcion: `Qué hacemos con los datos que nos enviáis desde la web de ${marca}, para qué los usamos y cómo podéis verlos, corregirlos o borrarlos.`,
    enMenu: false,
    colorActivo: 'bg-arbol-verde',
  },
  noEncontrada: {
    ruta: '*',
    nombre: 'Página no encontrada',
    titulo: `Página no encontrada · ${marca}`,
    descripcion: 'Esta página no existe o ha cambiado de sitio. Desde aquí podéis volver al inicio y seguir.',
    enMenu: false,
    colorActivo: 'bg-arbol-verde',
    // Netlify la sirve (404.html, con código 404) en cualquier dirección que no exista (_redirects): sin canonical,
    // no va en el sitemap y lleva "noindex".
    indexar: false,
  },
} as const satisfies Record<string, Pagina>

// Páginas que salen en el menú, en el orden de arriba.
export const paginasMenu: readonly Pagina[] = Object.values(paginas).filter((p) => p.enMenu)

export const paginasLegales: readonly Pagina[] = [paginas.avisoLegal, paginas.privacidad]

// Destino del botón "Solicitar visita": la sección del formulario en Contacto.
export const anclaSolicitarVisita = 'solicitar-visita'
export const rutaSolicitarVisita = `${paginas.contacto.ruta}#${anclaSolicitarVisita}`

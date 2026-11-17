import { direccionCompleta } from './mapa'
import { paginas } from './paginas'
import { site } from './site'
import { enlaceTel, formatoPantalla, telefonoLlamadas } from './telefonos'

// Textos de las páginas legales (Aviso legal y Política de privacidad). BORRADOR (2026-11-13): los revisa la
// gestoría de la escuela antes de publicar (CLAUDE.md, sección 9). Todos los datos salen de site.ts.
// No se inventan plazos ni cifras: donde no sabemos algo (por ejemplo, cuánto tiempo se guardan los datos), se usa
// una fórmula que siempre es cierta.
//
// Cómo se escriben: cada página es una lista de secciones; cada sección, una lista de bloques (párrafo, lista o
// ficha). Un "trozo" es texto o un enlace; si el enlace empieza por "/", es una página de esta web.

export type Trozo = string | { texto: string; href: string; externo?: boolean }
export type Bloque =
  | { tipo: 'parrafo'; trozos: readonly Trozo[] }
  | { tipo: 'lista'; elementos: readonly (readonly Trozo[])[] }
  | { tipo: 'ficha'; filas: readonly { etiqueta: string; valor: readonly Trozo[] }[] }
type SeccionLegal = { titulo: string; bloques: readonly Bloque[] }
export type TextoLegal = { actualizado: string; secciones: readonly SeccionLegal[] }

const { razonSocial, cif, registroMercantil: rm, autorizacion, email, nombre } = site
const correo: Trozo = { texto: email, href: `mailto:${email}` }
const parrafo = (...trozos: Trozo[]): Bloque => ({ tipo: 'parrafo', trozos })
// Fecha de la última revisión de estos textos. Cambiarla cuando se cambien.
const ACTUALIZADO = '13 de noviembre de 2026'

export const avisoLegal: TextoLegal = {
  actualizado: ACTUALIZADO,
  secciones: [
    {
      titulo: 'Quién está detrás de esta web',
      bloques: [
        parrafo(
          `Esta web es de ${razonSocial}, la empresa titular de la ${nombre}. Estos son sus datos, como pide la Ley 34/2002 de servicios de la sociedad de la información (LSSI):`,
        ),
        {
          tipo: 'ficha',
          filas: [
            { etiqueta: 'Titular', valor: [razonSocial] },
            { etiqueta: 'Nombre comercial', valor: [nombre] },
            { etiqueta: 'CIF', valor: [cif] },
            { etiqueta: 'Domicilio', valor: [direccionCompleta] },
            { etiqueta: 'Email', valor: [correo] },
            { etiqueta: 'Teléfono', valor: [{ texto: formatoPantalla(telefonoLlamadas.numero), href: enlaceTel(telefonoLlamadas.numero) }] },
            { etiqueta: 'Registro Mercantil', valor: [`Registro Mercantil de ${rm.provincia}, hoja ${rm.hoja}, tomo ${rm.tomo}, folio ${rm.folio}`] },
          ],
        },
      ],
    },
    {
      titulo: 'Autorización como centro educativo',
      bloques: [
        parrafo(`La ${nombre} es un centro de Primer Ciclo de Educación Infantil (de 0 a 3 años) autorizado:`),
        {
          tipo: 'ficha',
          filas: [
            { etiqueta: 'Autorización', valor: [autorizacion.tipo] },
            { etiqueta: 'Código de centro', valor: [autorizacion.numero] },
            { etiqueta: 'Organismo', valor: [autorizacion.organismo] },
          ],
        },
      ],
    },
    {
      titulo: 'Para qué es esta web',
      bloques: [
        parrafo(
          'Para contaros cómo es la escuela (las aulas, el horario, el calendario, la adaptación…) y para que podáis pedir una visita o escribirnos. Al usarla, aceptáis estas condiciones.',
        ),
      ],
    },
    {
      titulo: 'La información de la web',
      bloques: [
        parrafo(
          'Intentamos que todo esté al día, pero algunos datos pueden cambiar: por ejemplo, el calendario escolar está sujeto a lo que decidan la Junta de Comunidades de Castilla-La Mancha y el Ayuntamiento de Carranque. Si tenéis cualquier duda, preguntadnos.',
        ),
      ],
    },
    {
      titulo: 'Textos, dibujos y logo',
      bloques: [
        parrafo(
          `Los textos, las ilustraciones, el logo y el diseño de esta web son de ${razonSocial} o se usan con permiso. No se pueden copiar ni usar con otros fines sin su autorización.`,
        ),
      ],
    },
    {
      titulo: 'Enlaces a otras webs',
      bloques: [
        parrafo(
          'Desde aquí podéis ir a otras webs y aplicaciones (WhatsApp, Instagram, Facebook, Google Maps, Google o Baby Control). Se abren en otra pestaña y tienen sus propias condiciones y su propia política de privacidad; no somos responsables de su contenido.',
        ),
      ],
    },
    {
      titulo: 'Vuestros datos',
      bloques: [
        parrafo('Lo que hacemos con los datos que nos enviáis desde la web lo explicamos en la ', { texto: 'política de privacidad', href: paginas.privacidad.ruta }, '.'),
      ],
    },
    {
      titulo: 'Ley aplicable',
      bloques: [parrafo('Estas condiciones se rigen por la ley española.')],
    },
  ],
}

export const privacidad: TextoLegal = {
  actualizado: ACTUALIZADO,
  secciones: [
    {
      titulo: 'Quién guarda vuestros datos',
      bloques: [
        parrafo(`El responsable de vuestros datos es ${razonSocial}, titular de la ${nombre}:`),
        {
          tipo: 'ficha',
          filas: [
            { etiqueta: 'Responsable', valor: [razonSocial] },
            { etiqueta: 'CIF', valor: [cif] },
            { etiqueta: 'Domicilio', valor: [direccionCompleta] },
            { etiqueta: 'Email', valor: [correo] },
          ],
        },
      ],
    },
    {
      titulo: 'Qué datos nos dais',
      bloques: [
        parrafo('Solo los que escribís en el formulario de solicitud de visita:'),
        {
          tipo: 'lista',
          elementos: [
            ['Vuestro nombre.'],
            ['La fecha de nacimiento de vuestro peque (o la fecha prevista, si aún no ha nacido), para saber en qué aula le tocaría estar.'],
            ['Un teléfono o un email, para contestaros.'],
            ['Si queréis, un mensaje.'],
          ],
        },
        parrafo(
          'No os pedimos datos de salud ni de alergias: por favor, no los pongáis en el mensaje. Ya hablaremos de todo eso en persona. Si nos escribís por email, WhatsApp o teléfono, también usamos esos datos solo para contestaros.',
        ),
      ],
    },
    {
      titulo: 'Para qué los usamos',
      bloques: [
        parrafo(
          'Solo para contestar a vuestra solicitud y quedar con vosotros para enseñaros la escuela. No los usamos para enviaros publicidad, no hacemos perfiles y no tomamos decisiones automáticas con ellos.',
        ),
      ],
    },
    {
      titulo: 'Por qué podemos usarlos',
      bloques: [
        parrafo(
          'Porque nos dais vuestro consentimiento al marcar la casilla del formulario (artículo 6.1.a del Reglamento General de Protección de Datos). Podéis retirarlo cuando queráis escribiéndonos a ',
          correo,
          '.',
        ),
      ],
    },
    {
      titulo: 'Cuánto tiempo los guardamos',
      bloques: [
        parrafo(
          'El tiempo necesario para atender vuestra solicitud. Después los borramos, salvo que os matriculéis en la escuela: entonces pasan a formar parte de la relación con vuestra familia, y os informamos aparte.',
        ),
      ],
    },
    {
      titulo: 'Quién más los ve',
      bloques: [
        parrafo(
          'Nadie más: no los cedemos ni los vendemos. Para que la web funcione, usamos dos servicios que tratan los datos por encargo nuestro, solo para eso:',
        ),
        {
          tipo: 'lista',
          elementos: [
            [
              'Netlify, Inc., que aloja esta web y recibe el formulario. Está en Estados Unidos y trata los datos con las garantías que pide el Reglamento General de Protección de Datos. Más información en su ',
              { texto: 'política de privacidad', href: 'https://www.netlify.com/privacy/', externo: true },
              '.',
            ],
            [
              'Google, que nos da el servicio de correo electrónico (Gmail): las solicitudes y los emails nos llegan ahí. Más información en su ',
              { texto: 'política de privacidad', href: 'https://policies.google.com/privacy', externo: true },
              '.',
            ],
          ],
        },
      ],
    },
    {
      titulo: 'Vuestros derechos',
      bloques: [
        parrafo(
          'Podéis pedirnos ver vuestros datos, corregirlos, borrarlos, oponeros a que los usemos, limitar su uso o recibirlos para llevarlos a otro sitio. Basta con escribirnos a ',
          correo,
          ' diciendo qué queréis. Os contestamos en el plazo que marca la ley (un mes como máximo).',
        ),
        parrafo(
          'Si creéis que no hemos tratado bien vuestros datos, podéis reclamar ante la ',
          { texto: 'Agencia Española de Protección de Datos', href: 'https://www.aepd.es', externo: true },
          '.',
        ),
      ],
    },
    {
      titulo: 'Cookies y servicios de otras empresas',
      bloques: [
        parrafo('Esta web no usa cookies propias de análisis ni de publicidad. Solo hay dos cosas que conviene que sepáis:'),
        {
          tipo: 'lista',
          elementos: [
            [
              'El menú del móvil recuerda si ya habéis visto su animación, para no repetirla. Lo guarda vuestro navegador mientras la pestaña está abierta (no es una cookie) y se borra al cerrarla.',
            ],
            [
              'El mapa de la página de contacto es de Google Maps y solo se carga si pulsáis "Ver el mapa". Entonces Google puede usar sus propias cookies. Si no lo pulsáis, la web no se conecta con Google. Más información en la ',
              { texto: 'política de privacidad de Google', href: 'https://policies.google.com/privacy', externo: true },
              '.',
            ],
          ],
        },
        parrafo(
          'Los botones de WhatsApp, Instagram, Facebook y Baby Control son solo enlaces: no cargan nada de esas empresas hasta que los pulsáis y salís a su web o a su aplicación.',
        ),
      ],
    },
  ],
}

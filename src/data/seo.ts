// Todo lo que leen los buscadores, construido con los datos de site.ts y paginas.ts (nada escrito a mano).
// Lo usan dos sitios: vite.config.ts, al compilar (robots.txt, sitemap.xml y las etiquetas de index.html), y
// useMetadatos.ts, en el navegador (canonical y noindex de cada página).
// Los imports llevan ".ts" porque este archivo también lo lee vite.config.ts, que se comprueba con las reglas de Node.
import { paginas, type Pagina } from './paginas.ts'
import { site } from './site.ts'
import { enlaceTel, telefonoLlamadas } from './telefonos.ts'

const { url } = site.web

// "/contacto" -> "https://escuelainfantil.netlify.app/contacto". Inicio ("/") queda con su barra.
export function urlPagina(ruta: string): string {
  return `${url}${ruta}`
}

// Si Google puede guardar la página: la web entera tiene que estar abierta (site.web.indexar) y la página no
// tiene que haberse cerrado a propósito (la 404).
export function seIndexa(pagina: Pagina): boolean {
  return site.web.indexar && pagina.indexar !== false
}

// Páginas que van en el sitemap: todas menos las que no se indexan (la 404, cuya ruta "*" no es una dirección).
const todasLasPaginas: readonly Pagina[] = Object.values(paginas)
const paginasSitemap = todasLasPaginas.filter((p) => p.indexar !== false)

// Lista de las páginas para Google (https://www.sitemaps.org/protocol.html). Sin fecha de cambio ni prioridad:
// Google ignora la prioridad, y una fecha que no se actualiza de verdad le hace desconfiar del sitemap.
export function sitemapXml(): string {
  const urls = paginasSitemap.map((p) => `  <url><loc>${urlPagina(p.ruta)}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

// Instrucciones para los robots. Se les deja entrar siempre (Allow): si no pudieran entrar, no verían el
// "noindex" de las páginas y podrían guardar la dirección igualmente. El sitemap solo se anuncia cuando la web se
// puede indexar.
export function robotsTxt(): string {
  const sitemap = site.web.indexar ? `\nSitemap: ${urlPagina('/sitemap.xml')}\n` : ''
  return `User-agent: *\nAllow: /\n${sitemap}`
}

// Días de site.ts en el formato de schema.org.
const DIAS_SCHEMA = {
  lunes: 'Monday',
  martes: 'Tuesday',
  miércoles: 'Wednesday',
  jueves: 'Thursday',
  viernes: 'Friday',
} as const satisfies Record<(typeof site.horario.dias)[number], string>

// "7:00" -> "07:00": schema.org pide la hora con dos cifras.
function horaSchema(hora: string): string {
  return hora.padStart(5, '0')
}

// Datos estructurados (JSON-LD, https://schema.org): la ficha de la escuela tal y como la entiende Google
// (nombre, dirección, teléfono, horario, redes). Se comprueba con la Prueba de resultados enriquecidos de Google.
// ChildCare (guardería, un tipo de negocio local) y Preschool (centro de educación infantil).
export function datosEstructurados(): Record<string, unknown> {
  const { direccion, horario, redes } = site
  return {
    '@context': 'https://schema.org',
    '@type': ['ChildCare', 'Preschool'],
    '@id': `${urlPagina('/')}#escuela`,
    name: site.nombre,
    legalName: site.razonSocial,
    description: paginas.inicio.descripcion,
    url: urlPagina('/'),
    logo: urlPagina('/favicon-192.png'),
    image: urlPagina('/imagen-compartir.jpg'),
    telephone: enlaceTel(telefonoLlamadas.numero).replace('tel:', ''),
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: direccion.calle,
      postalCode: direccion.codigoPostal,
      addressLocality: direccion.municipio,
      addressRegion: direccion.provincia,
      addressCountry: 'ES',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: horario.dias.map((dia) => DIAS_SCHEMA[dia]),
      opens: horaSchema(horario.apertura),
      closes: horaSchema(horario.cierre),
    },
    sameAs: [redes.instagram, redes.facebook],
  }
}

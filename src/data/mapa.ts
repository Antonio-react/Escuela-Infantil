import { site } from './site'

const { calle, codigoPostal, municipio, provincia } = site.direccion

// "Calle Orión, 38, 45216 Carranque, Toledo": se construye desde site.ts (no se repite la dirección).
export const direccionCompleta = `${calle}, ${codigoPostal} ${municipio}, ${provincia}`

// Enlace de búsqueda de Google Maps. Es solo un enlace (abre Maps en otra pestaña): no carga
// ningún mapa ni pone cookies en nuestra web.
export const enlaceMapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccionCompleta)}`

// Mapa de Google para incrustar (iframe) en Contacto. No necesita clave de API. Solo se carga cuando alguien
// pulsa "Ver el mapa": hasta entonces no se conecta con Google ni pone cookies (por eso no hace falta banner).
export const mapaIncrustado = `https://maps.google.com/maps?q=${encodeURIComponent(direccionCompleta)}&z=16&output=embed`

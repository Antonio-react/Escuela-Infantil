import imagenCalendario from '../assets/calendario-escolar.webp'

// Datos sacados de docs/referencias/calendario (curso 2026-2027).
// Fechas en formato ISO (año-mes-día): se ordenan bien y el componente las formatea en español.
// Imágenes sacadas del PDF (renderizado a 2000 px de ancho):
//  - imagen: WebP de 1000 × 1415 para la web (al pulsarla se abre el visor con el JPG).
//  - jpg: 1600 × 2264, para el visor (la imagen ampliada) y para DESCARGAR (atributo download) y guardarla en la galería del móvil. JPG y no
//    WebP: lo abre cualquier galería. Nombre fijo, sin año: al cambiar de curso se sustituye el archivo.
// Cada curso nuevo: cambiar el PDF de public/, volver a sacar las dos imágenes y actualizar estos datos.
export const calendario = {
  curso: '2026-2027',
  pdf: '/calendario-escolar.pdf',
  jpg: { src: '/calendario-escolar.jpg', ancho: 1600, alto: 2264 },
  imagen: { src: imagenCalendario, ancho: 1000, alto: 1415 },
  aviso:
    'Calendario sujeto a modificaciones por la Comunidad de Castilla-La Mancha o el Ayuntamiento de Carranque.',
  categorias: [
    {
      nombre: 'Festivos nacionales',
      fechas: ['2026-10-12', '2026-11-02', '2026-12-08', '2026-12-25', '2027-01-01', '2027-01-06', '2027-03-25', '2027-03-26'],
    },
    {
      nombre: 'Festivos en Castilla-La Mancha (Educación y Comunidad)',
      fechas: ['2026-09-04', '2026-11-20', '2027-05-27', '2027-05-31'],
    },
    {
      nombre: 'Días no lectivos',
      fechas: ['2026-12-07', '2026-12-24', '2026-12-31', '2027-01-04', '2027-01-05', '2027-05-28'],
    },
  ],
} as const

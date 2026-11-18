export const site = {
  nombre: 'Escuela Infantil Árbol de Nubes',
  razonSocial: 'Tres Pequeños Mundos, S.L.',
  cif: 'B10982296',
  registroMercantil: { provincia: 'Toledo', hoja: 'TO-45048', tomo: '1746', folio: '132' },
  autorizacion: {
    tipo: 'Autorización de apertura y funcionamiento (Primer Ciclo de Educación Infantil)',
    numero: '45013996', // código de centro
    organismo: 'Consejería de Educación, Cultura y Deportes de Castilla-La Mancha',
  },
  direccion: { calle: 'Calle Orión, 38', municipio: 'Carranque', provincia: 'Toledo', codigoPostal: '45216' },
  email: 'e.i.arboldenubes@gmail.com',
  telefonos: [
    { numero: '666017437' },
    { numero: '656526291' },
    { numero: '639969095', whatsapp: true },
  ],
  redes: {
    instagram: 'https://www.instagram.com/e.i.arboldenubes',
    facebook: 'https://www.facebook.com/arboldenubes/',
    googleFicha: 'https://share.google/ti3i8cFbNmFIzzJRi',
  },
  babyControl: 'https://www.babycontrol.com/',
  // Dirección de la propia web, sin barra al final. De aquí salen og:url, og:image, canonical, robots.txt, el sitemap
  // y los datos para Google (src/data/seo.ts). Cambiando esta línea, cambia en todos esos sitios.
  // TODO: poner el dominio definitivo cuando lo tenga la escuela (ahora, la web de pruebas en la cuenta de Antonio).
  web: {
    url: 'https://escuelainfantil.netlify.app',
    // false mientras se revisa la web: todas las páginas llevan "noindex" y Google no las guarda. Al publicar con el
    // dominio definitivo, se pone a true (Antonio, 2026-11-18).
    indexar: false,
  },
  // Años que lleva abierta la escuela. Las dueñas no saben el año exacto de apertura: "más de 20" (2026-11-13).
  // Por eso es un mínimo y no un año (si fuera un año, se calcularía solo).
  aniosAbiertaMinimo: 20,
  aulas: [
    { nombre: 'Bebés', edades: '0-1 años' },
    { nombre: 'Aula 1-2', edades: '1-2 años' },
    { nombre: 'Aula 2-3', edades: '2-3 años', excursiones: true }, // excursiones extraescolares: solo 2-3 años
  ],
  horario: {
    // De lunes a viernes (Antonio, 2026-11-18). Lo usan los datos para Google (seo.ts).
    dias: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
    apertura: '7:00',
    cierre: '17:00',
    general: { desde: '9:00', hasta: '15:00', incluyeComida: true },
    // Dentro de la jornada general, dos horarios reducidos (Antonio, 2026-11-16, de su hermana). Salen debajo de
    // "Jornada general" en Horario y en la pregunta del horario de Familias.
    reducidos: [
      { desde: '9:00', hasta: '12:00' },
      { desde: '9:00', hasta: '13:00' },
    ],
    // Sin desayuno ni merienda (Antonio, 2026-11-16: no estaban confirmadas; las ampliaciones solo dicen "se paga
    // aparte").
  },
  curso: { inicio: 'septiembre', fin: 'junio', julioOpcional: true },
} as const

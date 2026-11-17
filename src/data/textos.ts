import { calendario } from './calendario'
import { site } from './site'

// "Matrícula abierta todo el año" en dos partes: el sello del hero pinta cada una de un color.
const matricula = { estado: 'Matrícula abierta', cuando: 'todo el año' } as const

// Siempre cierta (sin cifras exactas de Google, que se quedan desfasadas). La usan la barra de datos y la
// sección de testimonios de Inicio.
const resenasGoogle = 'Más de 90 reseñas de familias en Google'

export const textos = {
  // Pizarra en la que se puede pintar (cierre de las páginas y 404; MarcoPizarra.tsx).
  pizarra: {
    pista: 'Dibuja en la pizarra o coge una tiza de color',
    // Después de pintar con la blanca (la de por defecto) sin haber cogido nada: que hay más colores y borrador.
    pistaOtrosColores: 'Elige otro color o coge el borrador para borrar',
    // Mientras hay algo en la mano (en el móvil, el dedo pinta o borra en vez de hacer scroll): cómo dejarlo.
    pistaSoltar: 'Para soltar la tiza, tócala otra vez',
    pistaSoltarBorrador: 'Para soltar el borrador, tócalo otra vez',
    tiza: (color: string) => `Coger la tiza ${color}`,
    soltar: (color: string) => `Soltar la tiza ${color}`,
    cogerBorrador: 'Coger el borrador',
    soltarBorrador: 'Soltar el borrador',
    colores: { morada: 'morada', blanca: 'blanca', verde: 'verde', naranja: 'naranja', azul: 'azul' },
  },
  // Lo escriben o aprueban las dueñas. Mientras sea 'TODO', la sección no se pinta (tieneValor, en todo.ts).
  proyectoEducativo: 'TODO',
  // Aprobado (CLAUDE.md).
  instalaciones:
    'Aulas climatizadas todo el año, para que los peques estén siempre a gusto, haga frío o calor.',
  // Aprobado (CLAUDE.md). Si algún día contratan cocinera, se cambia aquí.
  cocina:
    'Cocinamos nosotras mismas cada día, con cariño y adaptando el menú a las alergias, las intolerancias y el ritmo de cada peque.',
  // Aprobado por Antonio (fase 1).
  adaptacion:
    'Empezamos poco a poco: estancias cortas de aproximadamente una hora que vamos alargando al ritmo de cada peque, para que la adaptación sea tranquila y respetuosa.',
  // Textos de las secciones de contenido (títulos sin punto final).
  secciones: {
    // Inicio: presentación de la escuela. BORRADOR (Antonio, 2026-11-12): se mejorará y lo verán las dueñas.
    // Los nombres salen de equipo.ts y los años, de site.aniosAbiertaMinimo ("más de 20").
    presentacion: {
      titulo: 'Quiénes somos',
      // Dice qué es y dónde (de 0 a 3 años, en el municipio): lo que no decía la primera pantalla con texto.
      inicio: `Somos una escuela infantil de 0 a 3 años, pequeña y familiar, en ${site.direccion.municipio}. Detrás estamos`,
      tras: ': dirigimos la escuela y estamos en las aulas con los peques.', // sin "cocinamos para ellos cada día" (Antonio, 2026-11-16)
      anios: (n: number) => `Desde hace más de ${n} años`,
      final: 'acompañamos a las familias en esta primera etapa, con calma, con cariño y respetando el ritmo de cada peque.',
    },
    // La escuela: galería de fotos (solo se pinta cuando haya fotos en src/data/fotos.ts).
    galeria: {
      titulo: 'Así es la escuela',
    },
    // Familias: fotos de actividades pinchadas en un corcho. BORRADOR.
    actividades: {
      titulo: 'Algunas *actividades*',
      entradilla: 'Rincones que preparamos para jugar, explorar y celebrar.',
    },
    // Visor de fotos a pantalla completa (VisorFotos.tsx): galería de La escuela y actividades de Familias.
    visorFotos: {
      nombre: 'Fotos ampliadas',
      anterior: 'Foto anterior',
      siguiente: 'Foto siguiente',
      cerrar: 'Cerrar la foto ampliada',
      contador: (numero: number, total: number) => `${numero} de ${total}`,
    },
    // Cierre de las páginas (antes del footer): la llamada a la acción. BORRADOR (Antonio, 2026-11-12).
    cierre: {
      titulo: 'Ven a conocer la escuela',
      texto: `${matricula.estado} ${matricula.cuando}. Pide una visita y te enseñamos las aulas y te contamos cómo es el día a día.`,
      // Por email, no por WhatsApp: las dueñas prefieren que les escriban al correo.
      escribenos: 'Escríbenos',
      escribenosAria: `Escríbenos un email a ${site.email}`,
      llamar: 'Llámanos',
      // En dos partes: la calle va en tiza naranja (como el osito), para que destaque.
      direccionIntro: 'Estamos en',
      direccion: `${site.direccion.calle}, ${site.direccion.municipio} (${site.direccion.provincia})`,
      comoLlegar: 'Cómo llegar',
      comoLlegarAria: 'Cómo llegar a la escuela en Google Maps, se abre en otra pestaña',
    },
    // Inicio: resumen con una tarjeta por página (el texto de cada una es su descripción, de paginas.ts).
    resumen: {
      titulo: 'Conoce la *escuela*',
      entradilla: 'Todo lo que necesitáis saber, a un toque: las aulas, el horario, el día a día de las familias y cómo venir a vernos.',
      verMas: 'Ver más',
    },
    testimonios: {
      titulo: 'Lo que dicen las *familias*',
      resenas: resenasGoogle,
      // Debajo del autor de cada tarjeta: de dónde sale el texto (sin logo de Google en la tarjeta, CLAUDE.md).
      origen: 'Reseña en Google',
      boton: 'Ver reseñas en Google',
      botonAria: 'Ver reseñas en Google, se abre en otra pestaña',
    },
    // Títulos de La escuela: una frase en vez de una etiqueta. PROVISIONALES (Antonio, 2026-11-12): se
    // revisarán más adelante.
    aulas: {
      titulo: 'Un aula para cada *edad*',
      excursiones: 'Excursiones extraescolares',
      // Bloque de excursiones (debajo de las aulas). BORRADOR (2026-11-13): los destinos los ha dado una de las
      // dueñas; falta saber cómo se organizan (cuándo, transporte, quién acompaña, autorizaciones) para contarlo.
      excursionesBloque: {
        titulo: 'Excursiones del aula de 2 a 3 años',
        texto:
          'A lo largo del curso, los mayores de la escuela salen a conocer el mundo de cerca: ven animales de verdad, descubren sitios nuevos y se asoman a la que será su siguiente etapa, el cole.',
        destinos: ['Granja escuela', 'Zoo', 'Un colegio de la zona'],
      },
    },
    instalaciones: {
      // El título, por partes: "frío" va en rojo (la calefacción) y "calor" en azul (el aire acondicionado). Antonio.
      titulo: { antes: 'Siempre a gusto, haga', frio: 'frío', entre: 'o', calor: 'calor' },
      // Tarjetas de invierno y verano (dato aprobado: aulas acondicionadas para frío y calor). BORRADOR.
      invierno: { cuando: 'En invierno', como: 'Aulas calentitas' },
      verano: { cuando: 'En verano', como: 'Aulas fresquitas' },
      // Comparador invierno / verano (la ventana del aula): lo que lee el lector de pantalla al moverlo.
      comparadorAria: 'Desliza para pasar del invierno al verano por la ventana del aula',
      comparadorValor: (verano: number) => `${100 - verano} % invierno, ${verano} % verano`,
      // Botones del termostato: llevan la ventana al invierno, a medias o al verano.
      botonInvierno: 'Ver la ventana del aula en invierno',
      botonAGusto: 'Ver la ventana del aula mitad invierno, mitad verano',
      botonVerano: 'Ver la ventana del aula en verano',
    },
    // La escuela: solo se pinta cuando textos.proyectoEducativo deje de ser 'TODO'.
    proyecto: {
      titulo: 'Nuestro proyecto educativo',
    },
    // La escuela: la frase grande es textos.cocina (aprobada). Los puntos de la ficha son datos aprobados
    // en el CLAUDE.md (el menú no va en la web: solo se dice que se da a las familias).
    cocina: {
      // No empieza como textos.cocina ("Cocinamos nosotras mismas…"), que va justo debajo.
      titulo: 'Comida *casera*, hecha en la escuela',
      ficha: 'Así es nuestra cocina',
      puntos: [
        `Incluida en la jornada de ${site.horario.general.desde} a ${site.horario.general.hasta}`,
        'Adaptada a alergias e intolerancias',
        'En puré o en sólido, según el momento de cada peque',
        'Cada mes os damos el menú',
      ],
    },
    // La escuela: las personas salen de equipo.ts. Entradilla: BORRADOR (la verán las dueñas).
    equipo: {
      titulo: 'Las que dirigen la escuela están en las *aulas*',
      entradilla: 'Las personas que cuidan de vuestros peques cada día.',
    },
    horario: {
      titulo: `Abierto de *${site.horario.apertura} a ${site.horario.cierre}*`,
      ampliacion: 'Ampliación',
      comidaIncluida: 'Comida incluida',
      aparte: 'Se paga aparte',
      // "También con horario reducido: de 9:00 a 12:00 o de 9:00 a 13:00" (debajo de Jornada general), por partes: solo
      // las horas van en el verde de su reloj y el resto, en el color normal del texto (Antonio, 2026-11-17).
      reducido: {
        antes: 'También con horario reducido:',
        de: 'de',
        o: 'o',
        tramos: site.horario.reducidos.map(({ desde, hasta }) => `${desde} a ${hasta}`),
      },
      flexible: 'Podéis ampliar horas o cambiar de horario en cualquier momento.',
      // "De septiembre a junio, con julio opcional", por partes: septiembre va en el color del otoño y junio y julio en
      // el del verano, como en la tira de meses (Antonio).
      curso: { de: 'De', inicio: site.curso.inicio, a: 'a', fin: site.curso.fin, con: ', con', julio: 'julio' },
      opcional: 'opcional',
    },
    // Horario y calendario: la imagen del calendario (enlazada al PDF), los festivos en texto y la descarga.
    calendario: {
      titulo: `Calendario *escolar* ${calendario.curso}`,
      alt: `Calendario escolar ${calendario.curso} de la Escuela Infantil Árbol de Nubes: los meses de septiembre a julio con los festivos nacionales en rojo, los festivos de Castilla-La Mancha en morado y los días no lectivos en verde.`,
      // La imagen se amplía al pulsarla (visor a pantalla completa).
      ampliar: 'Ampliar',
      cerrarVisor: 'Cerrar el calendario ampliado',
      // Recuadro para llevárselo: guardar la imagen en el móvil o abrir el PDF.
      aManoTitulo: 'Tenedlo siempre a mano',
      aManoTexto: 'Guardad el calendario en la galería del móvil y consultadlo cuando queráis.',
      descargar: 'Guardar calendario',
      descargarAria: `Guardar calendario escolar ${calendario.curso} como imagen`, // empieza por lo que se lee en el botón (WCAG 2.5.3)
      verPdf: 'Ver PDF',
      verPdfAria: `Ver PDF del calendario escolar ${calendario.curso}, se abre en otra pestaña`,
    },

    // --- Contacto. Todo BORRADOR (2026-11-13): lo verán Antonio y las dueñas. ---
    // El formulario "Solicitar visita" es una hoja de cuaderno que se rellena como una carta: el texto de la carta
    // va alrededor de los huecos, y cada hueco lleva su etiqueta pequeña debajo (visible: también es su <label>).
    // No se piden datos de salud ni alergias (CLAUDE.md).
    formulario: {
      titulo: 'Solicitud de *visita*',
      carta: {
        saludo: 'Hola, me llamo',
        peque: 'Mi peque', // + "nació / nacerá" (se rodea una) + "el" + la fecha
        el: 'el',
        // "contestarme en" con espacio que no parte (U+00A0): en móvil, "en" se quedaba sola en una línea.
        visita: 'y nos gustaría conocer la escuela. Podéis contestarme en',
        mas: 'Y algo más que queráis contarnos:',
      },
      // Fecha de nacimiento en vez de la edad (las dueñas, 2026-11-16: con la edad las familias se equivocaban de
      // aula). Puede que aún no haya nacido y estén mirando escuela: se rodea "nació" o "nacerá", como en una ficha.
      // valor: lo que llega en el email de Netlify; palabra: lo que se lee en la carta.
      nacido: {
        pregunta: '¿Tu peque ya ha nacido?',
        rodea: 'Rodea una',
        opciones: [
          { valor: 'Ya ha nacido', palabra: 'nació' },
          { valor: 'Aún no ha nacido', palabra: 'nacerá' },
        ],
      },
      etiquetas: {
        nombre: 'Tu nombre',
        nacimiento: 'Fecha de nacimiento',
        prevista: 'Fecha prevista',
        contacto: 'Teléfono o email',
        mensaje: 'Mensaje (opcional)',
      },
      errores: {
        nombre: 'Escribe tu nombre, para saber cómo llamarte.',
        nacido: 'Rodea "nació" o "nacerá".',
        nacimiento: 'Escribe la fecha de nacimiento.',
        prevista: 'Escribe la fecha prevista.',
        nacimientoFuera: 'Revisa la fecha: tiene que ser de los últimos 4 años.',
        previstaFuera: 'Revisa la fecha: tiene que ser de los próximos 10 meses.',
        contacto: 'Escribe un teléfono de 9 cifras o un email, para poder contestarte.',
      },
      // Debajo del botón, mientras no se puede enviar: qué falta (se unen como en español: "a, b y c").
      falta: {
        antes: 'Para enviarla, falta',
        nombre: 'tu nombre',
        nacido: 'rodear "nació" o "nacerá"',
        nacimiento: 'la fecha del peque',
        contacto: 'un teléfono o un email',
        casilla: 'marcar la casilla',
      },
      consentimientoAntes: 'He leído la',
      consentimientoEnlace: 'política de privacidad',
      consentimientoDespues: 'y acepto que la escuela use mis datos solo para contestar a esta solicitud.',
      // Alternativa al formulario (idea de Antonio), con el email como enlace.
      escribenosDirecto: 'O, si lo preferís, escribidnos directamente a',
      // Información básica de protección de datos (la "primera capa": lo mínimo que la ley pide decir al recoger los
      // datos; el resto está en la política de privacidad). BORRADOR para la gestoría.
      infoBasica: {
        antes: `${site.razonSocial} usará vuestros datos solo para contestar a esta solicitud, con vuestro consentimiento, y no los cederá a nadie. Podéis ver, corregir o borrar vuestros datos cuando queráis: os lo explicamos en la`,
        enlace: 'política de privacidad',
      },
      enviar: 'Enviar', // va pintado en el camión de bomberos (CamionEnviar.tsx): corto, para que quepa grande
      enviando: 'Enviando…',
      enviado: {
        gracias: 'Gracias,', // + el nombre (en su color)
        texto: 'Hemos recibido vuestra solicitud de visita. Os contestamos en cuanto podamos para quedar un día.',
        otra: 'Enviar otra solicitud',
      },
      error: `No se ha podido enviar. Probad otra vez en un momento o escribidnos a ${site.email}.`,
    },
    vias: {
      titulo: 'Otras formas de *hablar* con nosotras',
      whatsapp: 'WhatsApp',
      telefono: 'Teléfono',
      email: 'Email',
      nuevaPestana: ', se abre en otra pestaña', // solo para el lector de pantalla, tras el WhatsApp
      redes: 'También estamos en Instagram y Facebook',
    },
    donde: {
      titulo: 'Dónde *estamos*',
      comoLlegar: 'Cómo llegar',
      comoLlegarAria: 'Cómo llegar a la escuela en Google Maps, se abre en otra pestaña',
      // El mapa de Google solo se carga al pulsar el botón (hasta entonces, sin cookies de Google).
      verMapa: 'Ver el mapa',
      avisoMapa: 'Al pulsar se carga Google Maps, que usa sus propias cookies.',
      tituloMapa: `Mapa de Google con la ubicación de la escuela, en ${site.direccion.calle}, ${site.direccion.municipio}`,
    },

    // --- Familias. Todo BORRADOR (2026-11-13): lo verán Antonio y las dueñas. ---
    // Adaptación: la entradilla es textos.adaptacion (aprobada). Los tres pasos solo dicen lo aprobado
    // (estancias de una hora que se alargan poco a poco), sin inventar días ni horas.
    adaptacion: {
      titulo: 'Adaptación a su *ritmo*',
      pasos: [
        { cuando: 'Los primeros días', como: 'Más o menos una hora' },
        { cuando: 'Después', como: 'Cada día, un rato más' },
        { cuando: 'Cuando está a gusto', como: 'Su jornada completa' },
      ],
    },
    babyControl: {
      titulo: 'Su día a día, en *Baby Control*',
      texto: 'Baby Control es la agenda digital de la escuela. Cada día os compartimos fotos y novedades de vuestro peque, y las veis en el móvil en tiempo real.',
      boton: 'Conoce la app Baby Control',
      botonAria: 'Conoce la app Baby Control, se abre en otra pestaña',
      // Lo que se lee en el móvil dibujado (decorativo, aria-hidden: ya lo dice el texto).
      pantalla: { hoy: 'Hoy', fotos: 'Fotos del día', novedades: 'Novedades' },
    },
    facilidades: {
      titulo: '*Descuentos* y pago por empresa',
      vales: [
        { titulo: 'Descuento por hermanos', texto: 'Si viene más de un peque de la familia, se nota en la cuota.' },
        { titulo: 'Pago a través de empresa', texto: 'Aceptamos cheque guardería y los beneficios sociales de vuestra empresa.' },
      ],
      // Sin cifras: las tarifas se cuentan en persona (CLAUDE.md, Descartado).
      nota: 'Os contamos todos los detalles en la visita.',
    },
    preguntas: {
      titulo: 'Preguntas de las *familias*',
      // Junto a la paloma mensajera; debajo va el email como enlace.
      escribenos: 'Si os queda alguna duda, escribidnos',
      escribenosAria: `Escribidnos un email a ${site.email}`,
    },
  },

  // Textos fijos de la interfaz (botones, etiquetas, avisos para lectores de pantalla).
  // Páginas legales (PaginaLegal.tsx).
  legal: {
    actualizado: 'Última actualización:',
    externo: ', se abre en otra pestaña',
  },
  hero: {
    badge: `${matricula.estado} ${matricula.cuando}`,
    matricula,
    botonVisita: 'Solicitar visita',
  },
  saltarContenido: 'Saltar al contenido',
  menu: {
    principal: 'Principal',
    abrir: 'Abrir menú',
    cerrar: 'Cerrar menú',
    irInicio: 'Escuela Infantil Árbol de Nubes, ir al inicio',
    tituloPizarra: 'Árbol de nubes', // título escrito a tiza en el menú de móvil (como el rótulo del logo)
    llamanos: 'Llámanos',
    llamanosAria: 'Llámanos al', // + el número (lo añade el componente)
  },
  redes: {
    instagram: 'Instagram de la escuela, se abre en otra pestaña',
    facebook: 'Facebook de la escuela, se abre en otra pestaña',
  },
  whatsapp: {
    texto: 'WhatsApp',
    aria: 'Escribir por WhatsApp, se abre en otra pestaña',
  },
  footer: {
    paginas: 'Páginas',
    paginasAria: 'Páginas de la web',
    verMapa: 'ver en Google Maps, se abre en otra pestaña',
    contacto: 'Contacto',
    horario: 'Horario',
    redes: 'Síguenos',
    legal: 'Información legal',
  },
  noEncontrada: {
    titulo: 'Esta página no está en la pizarra',
    texto: 'Puede que el enlace esté mal escrito o que la página ya no exista. Te llevamos de vuelta al inicio.',
    boton: 'Volver al inicio',
  },
} as const

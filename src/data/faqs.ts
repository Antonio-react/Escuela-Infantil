import { horariosReducidos } from './horario'
import { site } from './site'
import { textos } from './textos'

export type Faq = {
  pregunta: string
  respuesta: string
}

const { horario, curso } = site

export const faqs: readonly Faq[] = [
  {
    pregunta: '¿Cómo es el periodo de adaptación?',
    respuesta:
      'Es progresivo y respetuoso. Los primeros días son estancias cortas, de aproximadamente una hora, que vamos ampliando poco a poco según cómo se encuentre cada peque. Así la llegada a la escuela es tranquila para el peque y para su familia.',
  },
  {
    pregunta: '¿Qué horario tenéis? ¿Se puede ampliar?',
    respuesta: `La escuela abre de ${horario.apertura} a ${horario.cierre}. La jornada general es de ${horario.general.desde} a ${horario.general.hasta}, con la comida incluida; también hay horario reducido, ${horariosReducidos}. Si lo necesitáis, podéis ampliarla con la acogida temprana (de ${horario.apertura} a ${horario.general.desde}) o con el horario de tarde (de ${horario.general.hasta} a ${horario.cierre}). La acogida temprana y el horario de tarde se pagan aparte. Podéis ampliar horas o cambiar de horario en cualquier momento.`,
  },
  {
    pregunta: '¿Cómo es la comida? ¿Adaptáis el menú a alergias e intolerancias?',
    respuesta: `Sí. ${textos.cocina} La comida es casera, hecha a diario en la escuela, en puré o en sólido según el momento de cada niño, y cada mes os facilitamos el menú.`,
  },
  {
    pregunta: '¿Cómo puedo solicitar plaza o una visita?',
    respuesta:
      'Lo mejor es venir a conocernos. Podéis pedir una visita con el formulario «Solicitar visita» de esta web, escribirnos por WhatsApp, llamarnos o mandarnos un email. Os enseñamos la escuela y resolvemos todas vuestras dudas en persona.',
  },
  {
    pregunta: '¿Puedo matricular a mi peque a mitad de curso?',
    respuesta:
      'Sí. La matrícula está abierta todo el año: podéis incorporaros en cualquier momento, siempre que haya plaza en el aula que le corresponde por edad.',
  },
  {
    pregunta: '¿Cómo me informáis de su día a día?',
    respuesta:
      'Usamos la app Baby Control, una agenda digital en la que cada día compartimos con las familias fotos y novedades de su peque. Y para cualquier cosa, podéis llamarnos o escribirnos.',
  },
  {
    pregunta: '¿Tenéis descuentos? ¿Aceptáis cheque guardería?',
    respuesta:
      'Sí. Tenemos descuento por hermanos y aceptamos el pago a través de empresa (cheque guardería o beneficios sociales). Os contamos todos los detalles en la visita.',
  },
  {
    pregunta: '¿Abrís en julio? ¿Cuándo hay vacaciones?',
    respuesta: `El curso va de ${curso.inicio} a ${curso.fin}. Julio es opcional y la escuela sigue abierta para las familias que lo necesiten. Los festivos y días no lectivos los tenéis en el calendario escolar de esta web.`,
  },
]

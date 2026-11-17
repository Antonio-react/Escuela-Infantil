import { site } from './site'

const { apertura, cierre, general } = site.horario

export type Tramo = {
  desde: string
  hasta: string
  nombre: string
  tipo: 'general' | 'ampliacion'
}

// Los tres tramos del día, en orden. Todo sale de site.ts: si cambia una hora, cambia aquí sola.
export const tramosHorario: readonly Tramo[] = [
  { desde: apertura, hasta: general.desde, nombre: 'Acogida temprana', tipo: 'ampliacion' },
  { desde: general.desde, hasta: general.hasta, nombre: 'Jornada general', tipo: 'general' },
  { desde: general.hasta, hasta: cierre, nombre: 'Tarde', tipo: 'ampliacion' },
]

// "7:00" → 7, "15:30" → 15.5. Sirve para dibujar el tramo de horas en los relojes.
export function enHoras(hora: string): number {
  const [h = 0, m = 0] = hora.split(':').map(Number)
  return h + m / 60
}

// Los meses del curso, para la tira de meses de Horario: de site.curso.inicio a site.curso.fin (septiembre → junio,
// dando la vuelta al año) y, si julio es opcional, julio al final marcado como opcional. Los nombres los da el
// navegador en español (Intl), así no se escriben a mano: "sept", "oct"…
const formatoLargo = new Intl.DateTimeFormat('es', { month: 'long' })
const formatoCorto = new Intl.DateTimeFormat('es', { month: 'short' })
const mesLargo = (mes: number) => formatoLargo.format(new Date(2026, mes, 1))
const indiceMes = (nombre: string) => Array.from({ length: 12 }, (_, mes) => mesLargo(mes)).indexOf(nombre)

// Estación de cada mes (Antonio: que se vea si hace frío o calor): otoño de septiembre a noviembre, invierno de
// diciembre a febrero, primavera de marzo a mayo y verano de junio a agosto.
export type Estacion = 'otono' | 'invierno' | 'primavera' | 'verano'
export const estaciones: readonly { clave: Estacion; nombre: string }[] = [
  { clave: 'otono', nombre: 'Otoño' },
  { clave: 'invierno', nombre: 'Invierno' },
  { clave: 'primavera', nombre: 'Primavera' },
  { clave: 'verano', nombre: 'Verano' },
]
function estacionDe(mes: number): Estacion {
  if (mes >= 8 && mes <= 10) return 'otono'
  if (mes === 11 || mes <= 1) return 'invierno'
  if (mes <= 4) return 'primavera'
  return 'verano'
}

export type MesCurso = { corto: string; largo: string; opcional: boolean; estacion: Estacion }

function mesesDelCurso(): MesCurso[] {
  const meses: MesCurso[] = []
  const desde = indiceMes(site.curso.inicio)
  const hasta = indiceMes(site.curso.fin)
  for (let mes = desde; ; mes = (mes + 1) % 12) {
    meses.push({ corto: formatoCorto.format(new Date(2026, mes, 1)).replace('.', ''), largo: mesLargo(mes), opcional: false, estacion: estacionDe(mes) })
    if (mes === hasta) break
  }
  if (site.curso.julioOpcional) meses.push({ corto: formatoCorto.format(new Date(2026, 6, 1)), largo: mesLargo(6), opcional: true, estacion: estacionDe(6) })
  return meses
}
export const mesesCurso = mesesDelCurso()

// Los horarios reducidos de la jornada general (site.ts), en una frase: "de 9:00 a 12:00 o de 9:00 a 13:00" (la "o"
// la pone el navegador en español, Intl.ListFormat de tipo "disyunción"). Lo usan Horario y la pregunta del horario.
// Con espacios que no se parten (el carácter 160, "espacio duro"): cada horario, entero en una línea ("de 9:00 a
// 12:00", nunca "de / 9:00…").
const ESPACIO_DURO = String.fromCharCode(160)
export const horariosReducidos = new Intl.ListFormat('es', { type: 'disjunction' }).format(
  site.horario.reducidos.map(({ desde, hasta }) => ['de', desde, 'a', hasta].join(ESPACIO_DURO)),
)

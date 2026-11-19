import { Fragment } from 'react'
import { enHoras, estaciones, mesesCurso, tramosHorario, type Estacion } from '../../data/horario'
import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'
import { SelloMatricula } from '../SelloMatricula'

const t = textos.secciones.horario

// Color de cada estación en la tira de meses (los suaves del árbol): otoño naranja (las hojas), invierno azul (el
// frío), primavera verde y verano rojo (el calor). Clases escritas enteras para que Tailwind las encuentre.
const colorEstacion: Record<Estacion, string> = {
  otono: 'bg-arbol-naranja',
  invierno: 'bg-arbol-azul',
  primavera: 'bg-arbol-verde',
  verano: 'bg-arbol-rojo',
}
// RELOJES (Antonio, 2026-11-16: "los cuadros de la hora podían ser relojes"): cada tramo del día es un despertador de
// juguete (campanitas, patas y aro de color) y en su esfera va coloreado el TRAMO DE HORAS que cubre (de 7 a 9, de 9 a
// 15, de 15 a 17); las agujas marcan la hora de empezar. Así el reloj no es solo adorno: enseña el tramo. Decorativo
// (aria-hidden): las horas están en el texto de al lado. Sustituye a las tarjetas y a la barra del día.
// Color de cada tramo: mañana naranja (amanece), jornada verde (la de la página) y tarde coral (atardecer).
const coloresTramo = ['var(--color-arbol-naranja-intenso)', 'var(--color-arbol-verde-intenso)', 'var(--color-arbol-rojo-intenso)'] as const
// El mismo color de cada reloj, en su versión oscura para texto (se lee sobre crema): para el "Se paga aparte" de las
// ampliaciones, en el color de su reloj (Antonio).
const textoTramo = ['text-arbol-naranja-texto', 'text-verde', 'text-coral'] as const

// Punto de la esfera para una hora (en un reloj de 12 horas) a una distancia r del centro (50, 54).
const CX = 50
const CY = 54
function punto(horas: number, r: number): [number, number] {
  const angulo = ((horas % 12) / 12) * 2 * Math.PI - Math.PI / 2
  return [CX + r * Math.cos(angulo), CY + r * Math.sin(angulo)]
}
// El "quesito" de la esfera de una hora a otra (en el sentido de las agujas).
function quesito(desde: number, hasta: number, r: number): string {
  const [x1, y1] = punto(desde, r)
  const [x2, y2] = punto(hasta, r)
  const grande = hasta - desde > 6 ? 1 : 0
  return `M${CX} ${CY}L${x1} ${y1}A${r} ${r} 0 ${grande} 1 ${x2} ${y2}Z`
}

function RelojTramo({ desde, hasta, color, className = '' }: { desde: number; hasta: number; color: string; className?: string }) {
  const [hx, hy] = punto(desde, 17) // aguja de las horas, a la hora de empezar
  return (
    <svg viewBox="0 0 100 104" aria-hidden="true" focusable="false" className={`shrink-0 overflow-visible ${className}`}>
      {/* Patas y campanitas de despertador, con su martillo en medio */}
      <path d="M30 88 22 99M70 88 78 99" stroke="var(--color-tinta)" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 26a15 15 0 0 1 22-14z" fill={color} />
      <path d="M86 26a15 15 0 0 0-22-14z" fill={color} />
      <path d="M50 10v5" stroke="var(--color-tinta)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="8" r="3.5" fill="var(--color-tinta)" />
      {/* Aro de color y esfera */}
      <circle cx={CX} cy={CY} r="40" fill={color} />
      <circle cx={CX} cy={CY} r="33" fill="var(--color-crema)" />
      {/* El tramo de horas, coloreado */}
      <path d={quesito(desde, hasta, 31)} fill={color} opacity="0.35" />
      {/* Marcas de las 12 horas (las de 12, 3, 6 y 9, más largas) */}
      {Array.from({ length: 12 }, (_, h) => {
        const [x1, y1] = punto(h, h % 3 === 0 ? 25 : 28)
        const [x2, y2] = punto(h, 31)
        return <path key={h} d={`M${x1} ${y1}L${x2} ${y2}`} stroke="var(--color-tinta)" strokeOpacity="0.55" strokeWidth={h % 3 === 0 ? 2.6 : 1.6} strokeLinecap="round" />
      })}
      {/* Agujas: la de las horas en la hora de empezar y la de los minutos en punto */}
      <path d={`M${CX} ${CY}L${hx} ${hy}`} stroke="var(--color-tinta)" strokeWidth="4.5" strokeLinecap="round" />
      <path d={`M${CX} ${CY}L${CX} ${CY - 25}`} stroke="var(--color-tinta)" strokeWidth="3" strokeLinecap="round" />
      <circle cx={CX} cy={CY} r="3.5" fill={color} stroke="var(--color-tinta)" strokeWidth="1.5" />
    </svg>
  )
}

export function Horario() {
  return (
    // max-md:pb-4: en móvil, menos margen por abajo, para que el calendario no quede tan lejos (Antonio).
    <Seccion titulo={t.titulo} resalte={{ forma: 'subrayado', color: 'azul' }} entradilla={t.flexible} className="max-md:pb-4">
      {/* Los tres tramos, cada uno con su reloj (RelojTramo). Sin cajas. En móvil, el reloj a la izquierda y el texto a
          la derecha; desde md, en tres columnas con el reloj arriba (el de la jornada general, más grande). */}
      {/* Desde md, cada reloj en una caja del mismo alto (h-50) y apoyado abajo: así los tres textos empiezan a la misma
          altura aunque el reloj de la jornada sea más grande. En móvil, los tres relojes iguales (el texto, alineado). */}
      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {tramosHorario.map((tramo, i) => {
          const general = tramo.tipo === 'general'
          return (
            // En móvil, los tres iguales: reloj a la izquierda y texto a la derecha (Antonio probó el zigzag y prefiere así),
            // con el reloj grande (w-28), que cabe de sobra.
            <li key={tramo.nombre} className="flex items-center gap-5 md:flex-col md:items-center md:text-center">
              {/* En móvil, el reloj de la jornada general (la base) más grande que los otros dos (Antonio), cada uno
                  centrado en una caja del mismo ancho (w-32): así los textos siguen alineados. */}
              <div className="flex w-32 shrink-0 justify-center md:h-50 md:w-auto md:items-end">
                <RelojTramo
                  desde={enHoras(tramo.desde)}
                  hasta={enHoras(tramo.hasta)}
                  color={coloresTramo[i % coloresTramo.length]}
                  className={general ? 'w-32 md:w-48' : 'w-24 md:w-36'}
                />
              </div>
              <div className="flex flex-col gap-2 md:items-center">
                <p className="font-titulo text-3xl font-semibold whitespace-nowrap">
                  {tramo.desde} – {tramo.hasta}
                </p>
                <h3 className="text-xl font-semibold">{tramo.nombre}</h3>
                <p className={`self-start rounded-full px-3 py-1 text-sm font-semibold md:self-center ${general ? 'bg-arbol-verde' : 'bg-white ring-1 ring-tinta/10'}`}>
                  {general ? t.comidaIncluida : t.ampliacion}
                </p>
                {/* Las ampliaciones: "Se paga aparte", en el color de su reloj (Antonio quitó el desayuno y la merienda). */}
                {!general && <p className={`font-semibold ${textoTramo[i % textoTramo.length]}`}>{t.aparte}</p>}
                {/* La jornada general: sus dos horarios reducidos (site.ts), debajo (Antonio: la misma línea que el "Se
                    paga aparte" de los otros dos). Solo las horas destacan, como pasadas con un SUBRAYADOR azul claro
                    (fondo arbol-azul con letra tinta, 11:1; Antonio, 2026-11-17: en verde no se apreciaban, y el azul claro
                    como letra no se lee sobre crema). box-decoration-clone: si un tramo se partiera, cada trozo lleva su
                    fondo; whitespace-nowrap: no se parte. */}
                {general && (
                  <p className="max-w-60 font-semibold text-balance">
                    {t.reducido.antes}{' '}
                    {t.reducido.tramos.map((tramo, j) => (
                      <Fragment key={tramo.horas}>
                        {j > 0 && ` ${t.reducido.o} `}
                        {t.reducido.de}{' '}
                        <span className="rounded-[0.3em_0.5em_0.4em_0.6em] bg-arbol-azul box-decoration-clone px-1 whitespace-nowrap">{tramo.horas}</span>{' '}
                        <span className="whitespace-nowrap">{tramo.comida}</span>
                      </Fragment>
                    ))}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {/* El curso y la matrícula (Antonio: las dos píldoras quedaban genéricas). El curso, como una tira de meses, cada
          uno con el color de su estación (colorEstacion), y julio con borde de puntos rojo (es verano, como junio) y el texto en verde, "opcional". Debajo, la leyenda
          de las estaciones. La tira es dibujo (aria-hidden): la frase de encima ya lo dice. Al lado, la matrícula
          abierta como el sello del osito (el mismo del hero; su texto lo lee el lector de pantalla). */}
      <div className="mt-[clamp(2.5rem,6svh,4rem)] grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
        <div>
          {/* Septiembre en el color del otoño y junio y julio en el del verano (versiones oscuras, para leerse como texto). */}
          <p className="font-titulo text-2xl font-semibold sm:text-3xl">
            {t.curso.de} <span className="text-arbol-naranja-texto">{t.curso.inicio}</span> {t.curso.a}{' '}
            <span className="text-coral">{t.curso.fin}</span>
            {t.curso.con} <span className="text-coral">{t.curso.julio}</span> {t.opcional}
          </p>
          {/* Móvil (Antonio: los meses quedaban mal organizados): una fila por estación, con su nombre delante. */}
          <ul aria-hidden="true" className="mt-5 flex flex-col gap-2.5 sm:hidden">
            {estaciones.map(({ clave, nombre }) => (
              <li key={clave} className="grid grid-cols-[5.5rem_1fr] items-center gap-2">
                <span className="text-sm font-semibold text-tinta/75">{nombre}</span>
                <span className="flex gap-2">
                  {mesesCurso
                    .filter((mes) => mes.estacion === clave)
                    .map((mes) => (
                      <span
                        key={mes.largo}
                        className={`relative grid h-11 w-14 place-items-center rounded-xl font-titulo font-semibold capitalize ${mes.opcional ? 'border-2 border-dashed border-coral/60 text-verde' : colorEstacion[mes.estacion]}`}
                      >
                        {mes.corto}
                        {mes.opcional && <span className="absolute -bottom-4.5 text-xs font-semibold text-verde">{t.opcional}</span>}
                      </span>
                    ))}
                </span>
              </li>
            ))}
          </ul>
          {/* Desde sm: la tira de los 11 meses en una fila y, debajo, la leyenda de las estaciones. */}
          <div aria-hidden="true" className="hidden sm:block">
            <ol className="mt-5 grid grid-cols-11 gap-2">
              {mesesCurso.map((mes) => (
                <li key={mes.largo} className="flex flex-col items-center gap-1">
                  <span
                    className={`grid h-12 w-full place-items-center rounded-xl font-titulo font-semibold capitalize ${mes.opcional ? 'border-2 border-dashed border-coral/60 text-verde' : colorEstacion[mes.estacion]}`}
                  >
                    {mes.corto}
                  </span>
                  {mes.opcional && <span className="text-xs font-semibold text-verde">{t.opcional}</span>}
                </li>
              ))}
            </ol>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-tinta/75">
              {estaciones.map(({ clave, nombre }) => (
                <li key={clave} className="flex items-center gap-1.5">
                  <span className={`size-3 rounded-full ${colorEstacion[clave]}`} />
                  {nombre}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* En móvil (Antonio): ni centrado ni pegado a la derecha, a medio camino: su centro al 75 % del ancho (ml = 75 %
            menos la mitad del sello). Un poco subido hacia la fila de Verano (Antonio): -mt-6 desde 400 px; en móviles más
            estrechos solo pegado a los meses (mt-0), porque subido tocaría el "opcional" de Jul. */}
        <SelloMatricula className="mt-0 ml-[calc(75%-3rem)] size-24 min-[25rem]:-mt-6 min-[25rem]:ml-[calc(75%-3.5rem)] min-[25rem]:size-28 sm:mx-auto sm:mt-0 sm:size-36" />
      </div>
    </Seccion>
  )
}

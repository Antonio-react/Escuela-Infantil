import { useInView } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { testimonioDe } from '../../data/destacados'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { textos } from '../../data/textos'
import { Cita } from '../Cita'
import { Patito } from '../Juguetes'
import { Seccion } from '../Seccion'

// "Adaptación a su ritmo": tres caminos, uno por paso. En cada uno, el tramo recorrido (de color) es más largo y
// el patito (el juguete de Familias) llega más lejos: se VE que la estancia crece poco a poco sin dar días ni horas
// que no tenemos. Al lado, el testimonio que habla de la adaptación, en su tarjeta de reseña (Cita.tsx).

// Hasta dónde llega cada paso (en % del camino). Solo dibujo: no son medidas reales.
const recorrido = [16, 55, 100] as const
const colorTramo = ['bg-arbol-naranja', 'bg-arbol-rojo', 'bg-arbol-verde'] as const

// Animación (idea de Antonio): al verse la sección, cada tramo crece desde la izquierda y su patito lo recorre
// andando despacio, contoneándose, hasta su sitio. Una sola vez, cada patito un poco después del anterior. La
// duración va según la distancia: los tres andan a la misma velocidad. Clases .camino-* en index.css.
const PASO_CONTONEO = 0.32 // segundos de cada balanceo del patito
function tiempos(hasta: number, i: number): CSSProperties {
  const duracion = 0.8 + 2 * (hasta / 100)
  return {
    '--duracion': `${duracion}s`,
    '--retraso': `${i * 0.35}s`,
    // Cuántos balanceos caben mientras anda (número par: termina derecho).
    '--contoneos': String(Math.round(duracion / PASO_CONTONEO / 2) * 2),
    '--recorrido': String(hasta / 100),
  } as CSSProperties
}

export function Adaptacion() {
  const t = textos.secciones.adaptacion
  const cita = testimonioDe('adaptacion')
  const ref = useRef<HTMLOListElement>(null)
  const visto = useInView(ref, { once: true, amount: 0.4 })
  const reducido = usePrefersReducedMotion()
  // Hasta que se ve, la animación espera en su primer fotograma (patitos a la izquierda). Con movimiento
  // reducido no se pone la pausa: el bloque global deja todo ya en su sitio.
  const pausa = !reducido && !visto ? 'caminos-pausados' : ''
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'subrayado', color: 'verde' }} colorTitulo="text-ciruela">
      <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        <ol ref={ref} className={`flex flex-col gap-9 ${pausa}`}>
          {t.pasos.map((paso, i) => {
            const hasta = recorrido[i % recorrido.length]
            return (
              // group: el patito da un saltito al pasar el ratón por su camino (solo con ratón).
              <li key={paso.cuando} className="group" style={tiempos(hasta, i)}>
                <p className="text-tinta/70">{paso.cuando}</p>
                <p className="font-titulo text-2xl font-semibold sm:text-3xl">{paso.como}</p>
                {/* El camino: una línea de puntos de punta a punta y, encima, el tramo recorrido. El patito se
                    sienta al final del tramo: left = (ancho − patito) × %, así el último no se sale por la derecha. */}
                {/* @container: el camino es un "contenedor" y 100cqw es su ancho; así el patito sabe cuánto andar. */}
                <div aria-hidden="true" className="@container relative mt-3 h-12">
                  <span className="absolute inset-x-0 bottom-2 border-b-[3px] border-dotted border-tinta/15" />
                  <span className={`camino-tramo absolute bottom-1 left-0 h-3 rounded-full ${colorTramo[i % colorTramo.length]}`} style={{ width: `${hasta}%` }} />
                  {/* -scale-x-100: el patito dibujado mira a la izquierda; volteado, "camina" hacia delante. */}
                  <Patito
                    className="camino-pato absolute bottom-3 size-10 -scale-x-100 transition-transform duration-300 ease-salida group-hover:-translate-y-1.5 group-hover:rotate-6"
                    style={{ left: `calc((100% - 2.5rem) * ${hasta / 100})` }}
                  />
                </div>
              </li>
            )
          })}
        </ol>
        {cita && (
          // La misma tarjeta de reseña que en Inicio (Cita.tsx), sola y un poco girada (antes colgaba de una rama).
          // indice 2: con la mochila de avatar (Antonio: la mochila, que es lo del primer día de cole).
          <Cita texto={cita.texto} autor={cita.autor} indice={2} className="-rotate-1" />
        )}
      </div>
    </Seccion>
  )
}

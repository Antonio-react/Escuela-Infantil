import { textos } from '../../data/textos'
import { Hucha, Patito } from '../Juguetes'
import { Seccion } from '../Seccion'

// "Descuentos y pago por empresa": dos vales recortables (clase .vale de index.css: las muescas del troquel). A la
// izquierda, la matriz con su juguete: dos patitos (hermanos, uno grande y uno pequeño) o la hucha (pago por
// empresa); una línea de puntos separa la matriz del vale. Sin cifras: las tarifas se cuentan en la visita.

// Matriz del vale de hermanos: dos patitos, el mayor detrás.
function Hermanos() {
  return (
    <span className="relative block h-14 w-16">
      <Patito className="absolute top-0 left-0 size-11 -scale-x-100" />
      <Patito className="absolute right-0 bottom-0 size-8 -scale-x-100" />
    </span>
  )
}
function HuchaVale() {
  return <Hucha className="size-16 -rotate-6" />
}

const estiloVales = [
  { Dibujo: Hermanos, fondo: 'bg-arbol-naranja', giro: 'sm:-rotate-1' },
  { Dibujo: HuchaVale, fondo: 'bg-arbol-verde', giro: 'sm:rotate-1' },
] as const

export function Facilidades() {
  const t = textos.secciones.facilidades
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'circulo', color: 'coral' }} colorTitulo="text-arbol-azul-texto">
      <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
        {t.vales.map((vale, i) => {
          const { Dibujo, fondo, giro } = estiloVales[i % estiloVales.length]
          return (
            // drop-shadow (y no box-shadow) en el li: la máscara del vale recortaría su propia sombra. Es fija, no se anima.
            <li key={vale.titulo} className={`drop-shadow-[0_0.6rem_0.9rem_rgb(43_40_48/0.1)] ${giro}`}>
              <div className={`vale flex h-full rounded-[1.25rem] ${fondo}`}>
                <div aria-hidden="true" className="grid w-(--matriz) shrink-0 place-items-center border-r-[3px] border-dotted border-tinta/20">
                  <Dibujo />
                </div>
                <div className="flex flex-col gap-2 p-6 sm:p-7">
                  <h3 className="font-titulo text-2xl leading-tight font-semibold">{vale.titulo}</h3>
                  <p className="text-lg text-tinta/80">{vale.texto}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-10 text-center font-titulo text-xl font-medium text-tinta/80">{t.nota}</p>
    </Seccion>
  )
}

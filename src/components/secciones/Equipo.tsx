import { equipo } from '../../data/equipo'
import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'

// "Nuestro equipo": una tarjeta por persona (de equipo.ts). Sin fotos de momento: el avatar es una mancha
// de color del árbol (con forma orgánica, como las del logo) con la inicial grande. Una cara dibujada
// genérica no se parecería a nadie. Si algún día hay fotos, solo con el consentimiento de cada persona.

const avatares = [
  { fondo: 'bg-arbol-naranja', forma: 'rounded-[42%_58%_55%_45%/48%_42%_58%_52%]' },
  { fondo: 'bg-arbol-azul', forma: 'rounded-[55%_45%_42%_58%/45%_55%_48%_52%]' },
  { fondo: 'bg-arbol-rojo', forma: 'rounded-[48%_52%_58%_42%/55%_45%_52%_48%]' },
  { fondo: 'bg-arbol-verde', forma: 'rounded-[58%_42%_48%_52%/42%_58%_45%_55%]' },
] as const

export function Equipo() {
  const t = textos.secciones.equipo
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'chispas', color: 'verde' }} entradilla={t.entradilla} colorTitulo="text-ciruela" panel="bg-ciruela-suave">
      {/* De dos en dos en móvil y tablet (en columna ocuparía demasiado), las cuatro en fila en escritorio. */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {equipo.map((persona, i) => {
          const { fondo, forma } = avatares[i % avatares.length]
          // "Directora y educadora infantil · Tutora de aula" → una línea por cargo.
          const cargos = persona.cargo.split(' · ')
          return (
            <li key={persona.nombre} className="flex flex-col items-center text-center">
              <div
                aria-hidden="true"
                className={`grid size-24 place-items-center font-titulo text-5xl font-semibold text-tinta sm:size-32 sm:text-6xl lg:size-36 ${fondo} ${forma}`}
              >
                {persona.nombre.charAt(0)}
              </div>
              <h3 className="mt-4 text-xl font-semibold sm:mt-5 sm:text-2xl">{persona.nombre}</h3>
              {cargos.map((cargo) => (
                <p key={cargo} className="mt-1 text-sm text-tinta/75 sm:text-base">
                  {cargo}
                </p>
              ))}
            </li>
          )
        })}
      </ul>
    </Seccion>
  )
}

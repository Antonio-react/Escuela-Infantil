import { useState } from 'react'
import arbol from '../../assets/logo-arbol.webp'
import { fotoFachada, srcSet } from '../../data/fotos'
import { enlaceMapa, mapaIncrustado } from '../../data/mapa'
import { site } from '../../data/site'
import { IconoMapa } from '../Iconos'
import { textos } from '../../data/textos'
import { Seccion } from '../Seccion'

// "Dónde estamos": la dirección en grande (el momento tipográfico de la página) con "Cómo llegar" (Google Maps en
// otra pestaña) y, al lado, un plano de papel doblado DIBUJADO por nosotros (calles, manzanas, un parque y el árbol
// del logo como chincheta: no es un mapa real, solo dice "aquí estamos"). El botón "Ver el mapa" lo cambia por el
// mapa de Google en el mismo hueco (mismo tamaño: nada se mueve). Hasta pulsarlo, no se conecta con Google ni hay
// cookies de Google, así que no hace falta banner de cookies (CLAUDE.md, Contacto).

const t = textos.secciones.donde
const { calle, codigoPostal, municipio, provincia } = site.direccion

// El plano dibujado (decorativo). Calles blancas sobre el verde suave, manzanas en crema, un parque redondo y una
// calle principal más ancha. El árbol (la imagen del logo) marca la escuela.
function Plano() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="size-full">
        <rect width="400" height="300" fill="var(--color-verde-suave)" />
        {/* Manzanas */}
        <g fill="var(--color-crema)">
          <rect x="18" y="18" width="110" height="74" rx="6" />
          <rect x="150" y="18" width="92" height="74" rx="6" />
          <rect x="18" y="118" width="110" height="80" rx="6" />
          <rect x="264" y="118" width="118" height="80" rx="6" />
          <rect x="18" y="222" width="110" height="64" rx="6" />
          <rect x="150" y="222" width="92" height="64" rx="6" />
          <rect x="264" y="222" width="118" height="64" rx="6" />
        </g>
        {/* Parque */}
        <circle cx="322" cy="56" r="40" fill="var(--color-arbol-verde)" />
        <circle cx="306" cy="48" r="9" fill="var(--color-arbol-verde-intenso)" opacity="0.6" />
        <circle cx="336" cy="66" r="7" fill="var(--color-arbol-verde-intenso)" opacity="0.6" />
        {/* Calle principal, un poco más ancha y con su raya */}
        <path d="M0 106h400" stroke="var(--color-white)" strokeWidth="18" />
        <path d="M0 106h400" stroke="var(--color-mostaza)" strokeWidth="1.5" strokeDasharray="10 9" />
        {/* La parcela de la escuela, en el color de la página de Contacto */}
        <rect x="150" y="118" width="92" height="80" rx="6" fill="var(--color-arbol-morado)" />
      </svg>
      {/* El árbol del logo, plantado en la parcela de la escuela, con su sombra en el suelo. */}
      <span className="absolute top-[47%] left-[49%] h-[30%] w-[15%] -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -bottom-1 left-1/2 h-2 w-3/4 -translate-x-1/2 rounded-[50%] bg-tinta/20" />
        <img src={arbol} alt="" width={600} height={805} className="absolute inset-0 size-full object-contain object-bottom" />
      </span>
    </div>
  )
}

export function DondeEstamos() {
  const [mapaCargado, setMapaCargado] = useState(false)
  // El iframe ya ha terminado de cargar (hasta entonces se ve la foto de la fachada encima).
  const [mapaListo, setMapaListo] = useState(false)
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'circulo', color: 'verde' }} colorTitulo="text-coral">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <address className="flex flex-col items-start gap-2 not-italic">
          <span className="font-titulo text-[clamp(2rem,5vw,3.5rem)] leading-tight font-semibold">{calle}</span>
          <span className="font-titulo text-[clamp(1.25rem,2.8vw,1.75rem)] text-tinta/75">
            {codigoPostal} {municipio} ({provincia})
          </span>
          {/* El mismo subrayado que se dibuja de las vías de contacto, en ciruela. */}
          <a
            href={enlaceMapa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.comoLlegarAria}
            className="group mt-4 inline-flex min-h-11 items-center gap-2 font-titulo text-xl font-semibold text-ciruela"
          >
            <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-salida group-hover:after:scale-x-100">
              {t.comoLlegar}
            </span>
            <span aria-hidden="true" className="transition-transform duration-300 ease-salida group-hover:translate-x-1">
              →
            </span>
          </a>
        </address>

        {/* El plano: papel doblado en tres (los pliegues, .plano-pliegues en index.css), un poco girado. Con el mapa
            ya cargado, recto y sin pliegues (es un mapa de verdad que se mueve con el dedo). */}
        <div className={`relative aspect-4/3 overflow-hidden bg-white shadow-[0_1rem_2.5rem_rgb(43_40_48/0.14)] ring-1 ring-tinta/5 ${mapaCargado ? '' : 'lg:rotate-1'}`}>
          {mapaCargado ? (
            <>
              <iframe
                src={mapaIncrustado}
                title={t.tituloMapa}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapaListo(true)}
                className="absolute inset-0 size-full border-0"
              />
              {/* Mientras carga el mapa de Google, la escuela por fuera (idea de Antonio): así se reconoce al llegar.
                  Cuando el mapa está listo se funde y deja de estorbar (pointer-events-none: el mapa ya se puede
                  mover con el dedo). */}
              {fotoFachada && (
                <img
                  src={fotoFachada.src}
                  srcSet={srcSet(fotoFachada)}
                  sizes="(min-width: 1024px) 600px, calc(100vw - 2rem)"
                  alt={mapaListo ? '' : fotoFachada.alt}
                  width={fotoFachada.ancho}
                  height={fotoFachada.alto}
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ease-salida ${mapaListo ? 'pointer-events-none opacity-0' : ''}`}
                />
              )}
            </>
          ) : (
            <>
              <Plano />
              <span aria-hidden="true" className="plano-pliegues absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-linear-to-t from-white/95 via-white/80 to-transparent px-4 pt-10 pb-5 text-center">
                {/* Sin caja de botón (Antonio): la chincheta y el texto, que se subraya dibujándose al pasar el ratón,
                    como "Cómo llegar". min-h-11: fácil de pulsar con el dedo. */}
                <button type="button" onClick={() => setMapaCargado(true)} className="group inline-flex min-h-11 items-center gap-2 font-titulo text-xl font-semibold text-tinta transition-transform duration-150 active:scale-[0.97]">
                  <IconoMapa className="size-7 text-coral transition-transform duration-300 ease-salida group-hover:-translate-y-0.5" />
                  <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-salida group-hover:after:scale-x-100">
                    {t.verMapa}
                  </span>
                </button>
                <p className="text-sm text-tinta/70">{t.avisoMapa}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Seccion>
  )
}

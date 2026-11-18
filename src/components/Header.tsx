import { lazy, Suspense, useEffect, useRef, useState, type ComponentType, type CSSProperties, type SVGProps } from 'react'
import { Link, NavLink } from 'react-router'
import rotuloNubes from '../assets/logo-rotulo-nubes-700.webp' // aquí se ve a ~150 px: la de 700 basta incluso a ×3
import { paginas, paginasMenu, rutaSolicitarVisita, type Pagina } from '../data/paginas'
import { textos } from '../data/textos'
import { IconoMenu } from './Iconos'
import { BALANCEO_BOTON } from './balanceo'
import { Bloque, Osito, Patito, Reloj, TelefonoJuguete } from './Juguetes'
import { useHeaderEscondido } from '../hooks/useHeaderEscondido'
import { ID_MENU } from './idMenu'
import { trasCargarYLibre } from '../utils/cuandoEsteLibre'

// El menú de pizarra solo se usa en móvil y tablet, y al abrirlo: se descarga aparte, la primera vez que se va a
// abrir (cargarMenu se llama ya al tocar el botón o pasar el ratón, antes del clic, para que no haya espera).
// Cuando ya está descargado se guarda aquí y se usa tal cual: con lazy + Suspense, React espera a propósito unos
// 300 ms antes de enseñarlo aunque ya esté descargado (para evitar parpadeos), y el menú tardaba en reaccionar.
let MenuYaCargado: (typeof import('./MenuPizarra'))['MenuPizarra'] | null = null
const cargarMenu = () =>
  import('./MenuPizarra').then((m) => {
    MenuYaCargado = m.MenuPizarra
    return m
  })
const MenuPizarra = lazy(() => cargarMenu().then((m) => ({ default: m.MenuPizarra })))

// Página activa: fondo con el color de esa página (un color del árbol del logo) y texto tinta.
function claseSegunEstado(pagina: Pagina, isActive: boolean): string {
  return isActive ? `${pagina.colorActivo} text-tinta` : 'text-tinta hover:bg-white'
}

// Menú de escritorio: cada página con su juguete, los mismos que en la pizarra del móvil (idea de Antonio:
// que la barra no sea tan simple a su lado). Juguetes rellenos (los de la barra de datos), no de tiza.
const juguetePorTipo: Record<NonNullable<Pagina['juguete']>, ComponentType<SVGProps<SVGSVGElement>>> = {
  osito: Osito,
  bloque: Bloque,
  reloj: Reloj,
  patito: Patito,
  telefono: TelefonoJuguete,
}

// Colores del juguete con las variables de Juguetes.tsx: el color intenso de su página, los detalles con ese
// color aclarado y el pico del patito naranja (como en la pizarra).
function colorJuguete(pagina: Pagina): CSSProperties {
  const color = pagina.colorIntenso ?? 'var(--color-mostaza)'
  return {
    '--juguete': color,
    '--juguete-claro': `color-mix(in oklab, ${color} 35%, white)`,
    '--juguete-pico': 'var(--color-arbol-naranja-intenso)',
  } as CSSProperties
}

export function Header() {
  const [abierto, setAbierto] = useState(false)
  const botonRef = useRef<HTMLButtonElement>(null)
  const cerrar = () => setAbierto(false)
  // Se esconde al bajar y aparece al subir (useHeaderEscondido); con el menú abierto, siempre visible.
  const headerRef = useRef<HTMLElement>(null)
  const escondido = useHeaderEscondido(headerRef, abierto)

  // En móvil y tablet (donde sale la hamburguesa), el código del menú y la letra de tiza se descargan ANTES de tocar
  // el botón: cuando la página ya ha cargado y el navegador está libre (no compite con la carga). Si no, el primer
  // toque esperaba a descargarlos y el menú tardaba en reaccionar (Antonio, 2026-11-17; medido: ~300 ms más la
  // primera vez). 62rem: el punto de cambio del menú (--breakpoint-menu, index.css).
  useEffect(
    () =>
      trasCargarYLibre(() => {
        if (!window.matchMedia('(width < 62rem)').matches) return
        void cargarMenu()
        void document.fonts?.load('1em "Patrick Hand"')
      }),
    [],
  )

  return (
    <>
    {/* Solo se anima transform (sube fuera de la pantalla). Con movimiento reducido, el bloque global de index.css lo
        deja instantáneo. */}
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b border-tinta/5 bg-crema transition-transform duration-300 ease-salida ${escondido ? '-translate-y-full' : ''}`}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={paginas.inicio.ruta} onClick={cerrar} className="shrink-0 rounded-lg">
          <img src={rotuloNubes} alt={textos.menu.irInicio} width={1100} height={269} className="h-9 w-auto" />
        </Link>

        {/* Escritorio */}
        <nav aria-label={textos.menu.principal} className="hidden menu:block">
          <ul className="flex items-center gap-1">
            {paginasMenu.map((p) => {
              const Juguete = p.juguete ? juguetePorTipo[p.juguete] : null
              return (
                <li key={p.ruta}>
                  {/* El juguete se sienta en la esquina de arriba a la derecha del enlace, un poco girado (como
                      en la pizarra). En la página activa se queda siempre; en las demás asoma con un bote al
                      pasar el ratón o con el foco del teclado. Posición absoluta: no ensancha la barra (ya mide
                      unos 964 px de 992). Decorativo: aria-hidden (lo pone Base). */}
                  <NavLink
                    to={p.ruta}
                    end
                    className={({ isActive }) =>
                      `group relative block rounded-full px-4 py-2.5 font-titulo font-medium transition-colors duration-200 ${claseSegunEstado(p, isActive)}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {p.nombre}
                        {Juguete && (
                          <Juguete
                            style={colorJuguete(p)}
                            className={`pointer-events-none absolute -top-3.5 -right-2 size-7 rotate-12 transition-[opacity,translate,scale] duration-300 ease-salida ${
                              isActive
                                ? ''
                                : 'translate-y-1.5 scale-75 opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100'
                            }`}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
        {/* En reposo se mece un poco (.balancea, BALANCEO_BOTON); al hacer scroll, fija. */}
        <Link to={rutaSolicitarVisita} className="boton boton-visita balancea hidden menu:inline-flex" style={BALANCEO_BOTON}>
          {textos.hero.botonVisita}
        </Link>

        {/* Móvil y tablet */}
        <button
          ref={botonRef}
          type="button"
          onClick={() => setAbierto(true)}
          onPointerDown={cargarMenu}
          onPointerEnter={cargarMenu}
          onFocus={cargarMenu}
          aria-expanded={abierto}
          aria-controls={ID_MENU}
          aria-label={textos.menu.abrir}
          className="grid size-12 place-items-center rounded-full text-tinta transition-transform duration-150 active:scale-95 menu:hidden"
        >
          <IconoMenu />
        </button>
      </div>
    </header>

      {/* El panel va FUERA del <header> (un transform o un filtro en el header harían que se midiera respecto a él) y, además,
          MenuPizarra lo lleva a <body> con un portal. Solo existe mientras está abierto. */}
      {/* Si ya está descargado (lo normal: se descarga tras cargar la página), directamente. Si no, con Suspense, sin
          nada que enseñar mientras tanto: la descarga ya empezó al tocar el botón y es pequeña. */}
      {abierto &&
        (MenuYaCargado ? (
          <MenuYaCargado alCerrar={cerrar} botonMenu={botonRef} />
        ) : (
          <Suspense fallback={null}>
            <MenuPizarra alCerrar={cerrar} botonMenu={botonRef} />
          </Suspense>
        ))}
    </>
  )
}

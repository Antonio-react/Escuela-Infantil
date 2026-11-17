import { useEffect, useEffectEvent, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router'
import { paginas, paginasMenu, rutaSolicitarVisita, type Pagina } from '../data/paginas'
import { textos } from '../data/textos'
import { enlaceTel, formatoPantalla, telefonoLlamadas } from '../data/telefonos'
import { IconoTelefono } from './Iconos'
import { SocialLinks } from './SocialLinks'
import {
  CruzTiza,
  JugueteTiza,
  NubecitaTiza,
  NubeTiza,
  PajaroTiza,
  SubrayadoTiza,
  SueloTiza,
  type EstiloConVariables,
} from './Tiza'
import { colorTiza, conTiempo, despues, duracionTexto } from './utilidadesTiza'

import { ID_MENU } from './idMenu'

// Tizas de colores: el color intenso del árbol aclarado con blanco (colorTiza, en utilidadesTiza.ts).
const TIZA_VERDE = colorTiza('var(--color-arbol-verde-intenso)')
const TIZA_AZUL = colorTiza('var(--color-arbol-azul-intenso)')
const TIZA_NARANJA = colorTiza('var(--color-arbol-naranja-intenso)') // picos de la familia de patos

// Algunos juguetes, un poco girados, como dibujados a mano (referencia de Antonio).
const giroJuguete: Partial<Record<NonNullable<Pagina['juguete']>, string>> = {
  osito: '-rotate-8',
  telefono: 'rotate-6',
}

// --- Orden de escritura: de arriba abajo y de izquierda a derecha, como si alguien lo escribiera ---
// Todo en milisegundos. Cada línea empieza cuando la anterior va por la mitad (así no se hace eterno),
// y el texto tarda más cuanto más largo es (duracionTexto, en utilidadesTiza.ts).
const JUGUETE = 200 // lo que tarda en dibujarse cada juguete
const TEXTO_TRAS_JUGUETE = 110 // el nombre empieza un poco después que su juguete

// Filas que llevan decoración a su derecha (pájaros en Inicio, nubecita en La escuela): se dibuja después
// del nombre, porque está más a la derecha.
const RUTAS_CON_DECORACION: readonly string[] = [paginas.inicio.ruta, paginas.laEscuela.ruta]
const DECORACION = 280
// Si una fila tiene dos piezas de decoración (los pájaros), la segunda va este tiempo después de la primera.
const ESCALONADO = 150

function calcularTiempos() {
  // Cabecera: el título, la X (a su derecha) y, debajo, el subrayado.
  const titulo = { retraso: 0, duracion: 420 }
  const cruz = { retraso: 380, duracion: 240 }
  const subrayado = { retraso: 520, duracion: 240 }

  let cursor = 640
  const filas = paginasMenu.map((p) => {
    const juguete = { retraso: cursor, duracion: JUGUETE }
    const texto = { retraso: cursor + TEXTO_TRAS_JUGUETE, duracion: duracionTexto(p.nombre) }
    cursor = texto.retraso + texto.duracion / 2
    // La decoración empieza cuando el nombre está casi escrito, y la fila siguiente espera a que vaya por la mitad.
    const decoracion = RUTAS_CON_DECORACION.includes(p.ruta)
      ? { retraso: texto.retraso + texto.duracion * 0.85, duracion: DECORACION }
      : null
    if (decoracion) cursor = decoracion.retraso + ESCALONADO + decoracion.duracion / 2
    return { juguete, texto, decoracion }
  })
  const tiempoDecoracion = (ruta: string) =>
    filas[paginasMenu.findIndex((p) => p.ruta === ruta)].decoracion ?? { retraso: 0, duracion: DECORACION }

  // La nube se pinta a la izquierda y, al terminar, se desliza a su sitio, a la derecha.
  const nubeTrazo = { retraso: cursor, duracion: 360 }
  const nubeTexto = { retraso: cursor + 150, duracion: duracionTexto(textos.hero.botonVisita) }
  const nubeDesliza = { retraso: nubeTexto.retraso + nubeTexto.duracion + 60, duracion: 700 }
  // Después, lo de más abajo: el suelo de nubes y el pie (llamar a la izquierda, redes a la derecha).
  // Se dibujan mientras la nube se desliza, para que no se alargue.
  const suelo = { retraso: nubeTexto.retraso + nubeTexto.duracion * 0.7, duracion: 460 }
  const pie = { retraso: suelo.retraso + 220, duracion: duracionTexto(textos.menu.llamanos) }
  const subrayadoPie = { retraso: pie.retraso + pie.duracion, duracion: 200 } // bajo "Llámanos"
  const redes = { retraso: subrayadoPie.retraso + subrayadoPie.duracion / 2, duracion: 300 } // a la derecha: lo último

  return { titulo, subrayado, cruz, filas, tiempoDecoracion, nubeTrazo, nubeTexto, nubeDesliza, suelo, pie, subrayadoPie, redes }
}
const T = calcularTiempos()

// Cuánto dura todo con los tiempos de arriba (lo último en terminar).
const fin = (t: { retraso: number; duracion: number } | null) => (t ? t.retraso + t.duracion : 0)
const DURACION_BASE = Math.max(
  ...[T.titulo, T.cruz, T.subrayado, T.nubeTrazo, T.nubeTexto, T.nubeDesliza, T.suelo, T.pie, T.subrayadoPie, T.redes].map(fin),
  ...T.filas.flatMap((f) => [fin(f.juguete), fin(f.texto), fin(f.decoracion) + ESCALONADO]),
)
// La primera vez que se abre en la visita, el efecto completo (--escala-tiza, en index.css, ajusta la
// velocidad sin cambiar el orden). Las siguientes, ya pintado (escala 0): quien ya lo ha visto solo quiere
// cambiar de página, y acelerado se ve atropellado. Sale ya pintado con un fundido de solo 0,12 s (Antonio,
// 2026-11-17: de golpe, el paso del crema a la pizarra oscura se notaba brusco).
const DURACION_PRIMERA_VEZ = 3000
// sessionStorage: dura lo que la pestaña y no sale del navegador (no es una cookie). En modo privado puede
// fallar: entonces se trata como primera vez.
const CLAVE_VISTO = 'menu-pizarra-visto'
function yaSeHaVisto(): boolean {
  try {
    return sessionStorage.getItem(CLAVE_VISTO) === '1'
  } catch {
    return false
  }
}
function marcarVisto() {
  try {
    sessionStorage.setItem(CLAVE_VISTO, '1')
  } catch {
    // Sin almacenamiento, la próxima vez vuelve a ir entero: no pasa nada.
  }
}

// Decoración de la esquina (en vez de las rayas y estrellas de la referencia), anclada a una fila corta:
// así va siempre a su lado, mida lo que mida la pantalla, y no choca con "Horario y calendario", la más larga
// (antes iba a una altura fija y, según el móvil, se juntaba con ella cuando era la página activa).
const decoracionFila: Partial<Record<string, ReactNode>> = {
  [paginas.inicio.ruta]: (
    <>
      <PajaroTiza className="pointer-events-none absolute top-[5%] right-10 w-8 text-tiza sm:right-16 sm:w-11" style={conTiempo(despues(T.tiempoDecoracion(paginas.inicio.ruta), ESCALONADO))} />
      <PajaroTiza className="pointer-events-none absolute top-[60%] right-24 w-5 text-tiza sm:right-36 sm:w-7" style={conTiempo(T.tiempoDecoracion(paginas.inicio.ruta))} />
    </>
  ),
  [paginas.laEscuela.ruta]: (
    <NubecitaTiza
      className="pointer-events-none absolute top-1/2 right-3 w-[min(3.5rem,13vw)] -translate-y-1/2 sm:right-8 sm:w-20"
      style={conTiempo(T.tiempoDecoracion(paginas.laEscuela.ruta), { color: TIZA_AZUL })}
    />
  ),
}

type MenuPizarraProps = {
  alCerrar: () => void
  botonMenu: RefObject<HTMLButtonElement | null>
}

// Menú de móvil y tablet: una pizarra a pantalla completa (por encima del header).
// Solo existe mientras está abierto (Header lo monta y lo desmonta), así la escritura se repite cada vez.
export function MenuPizarra({ alCerrar, botonMenu }: MenuPizarraProps) {
  const panel = useRef<HTMLElement>(null)
  // useState con función: se decide una vez, al abrir, y no cambia mientras el menú está abierto.
  const [primeraVez] = useState(() => !yaSeHaVisto())
  const escala = primeraVez ? DURACION_PRIMERA_VEZ / DURACION_BASE : 0
  const estiloPanel: EstiloConVariables = { '--escala-tiza': String(escala) }
  // Al cerrar CON EL TECLADO (Escape, o la X con Enter o espacio) el foco vuelve al botón del menú, para
  // seguir navegando desde ahí. Con el dedo o el ratón, no: Safari le pintaba el anillo de foco (un círculo
  // morado alrededor del botón). Al elegir una página, tampoco (cambia la página).
  const devolverFoco = useRef(false)

  // Entrada en dos tiempos, SOLO LA PRIMERA VEZ (Antonio, 2026-11-17: al tocar, el menú tardaba un pelín en salir y no
  // pasaba nada): al tocar sale YA el fondo de la pizarra, con un fundido corto (.menu-entra); el contenido (letras,
  // dibujos, nube) se monta dos fotogramas después, con la pizarra ya en pantalla, y se escribe. Las siguientes veces,
  // todo a la vez, ya pintado (Antonio: "como ya está todo pintado, que aparezca del tirón"), con un fundido de 0,12 s.
  const [conContenido, setConContenido] = useState(!primeraVez)
  useEffect(() => {
    if (!primeraVez) return
    let fotograma = requestAnimationFrame(() => {
      fotograma = requestAnimationFrame(() => setConContenido(true))
    })
    return () => cancelAnimationFrame(fotograma)
  }, [primeraVez])

  const cerrar = (conTeclado: boolean) => {
    devolverFoco.current = conTeclado
    alCerrar()
  }
  // useEffectEvent: la función siempre ve el alCerrar actual, sin que el efecto de abajo se repita.
  const alPulsarTecla = useEffectEvent((evento: KeyboardEvent) => {
    if (evento.key === 'Escape') cerrar(true)
  })
  const alPasarAEscritorio = useEffectEvent(() => alCerrar())

  useEffect(() => {
    // 1) La web de detrás queda "inerte": ni el tabulador ni un lector de pantalla pueden llegar a ella.
    const raiz = document.getElementById('root')
    raiz?.setAttribute('inert', '')
    marcarVisto()
    // 2) Sin scroll de fondo.
    document.body.style.overflow = 'hidden'
    // 3) Barras del navegador del color de la pizarra (theme-color), para que no corten el efecto.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    const colorAnterior = meta?.content
    const colorPizarra = getComputedStyle(document.documentElement).getPropertyValue('--color-pizarra').trim()
    if (meta && colorPizarra) meta.content = colorPizarra
    // El Safari del iPhone tiñe la barra de arriba con el fondo de la página, no con theme-color.
    document.documentElement.style.backgroundColor = colorPizarra
    document.body.style.backgroundColor = colorPizarra
    // 4) El foco, al propio panel (tabIndex -1): el siguiente Tab llega al primer enlace. No se pone en la X
    //    porque algunos navegadores (Safari al tocar) le pintan el anillo de foco aunque no se use teclado.
    panel.current?.focus()

    document.addEventListener('keydown', alPulsarTecla)
    // Si la pantalla se ensancha hasta el menú de escritorio (girar la tablet), se cierra: si no, la web
    // se quedaría inerte con el panel oculto.
    const escritorio = window.matchMedia('(min-width: 62rem)') // --breakpoint-menu de index.css
    escritorio.addEventListener('change', alPasarAEscritorio)

    const boton = botonMenu.current
    return () => {
      document.removeEventListener('keydown', alPulsarTecla)
      escritorio.removeEventListener('change', alPasarAEscritorio)
      raiz?.removeAttribute('inert')
      document.body.style.overflow = ''
      if (meta && colorAnterior) meta.content = colorAnterior
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
      if (devolverFoco.current) boton?.focus()
    }
  }, [botonMenu])

  // createPortal: el panel se pinta directamente en <body>, fuera de #root, que es lo que se vuelve inerte.
  return createPortal(
    <nav
      ref={panel}
      style={estiloPanel}
      tabIndex={-1}
      id={ID_MENU}
      aria-label={textos.menu.principal}
      // isolate: capa propia, así la decoración (-z-10) queda detrás del contenido pero dentro del panel.
      className={`menu-entra ${primeraVez ? '' : '[--entrada-menu:120ms]'} pizarra fixed inset-0 isolate z-50 outline-none flex flex-col overflow-y-auto px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[min(8.5rem,17svh)] font-tiza [--margenes:2.75rem] sm:px-10 sm:pt-[max(2rem,env(safe-area-inset-top))] sm:pb-[min(11.5rem,17svh)] sm:[--margenes:5.25rem] menu:hidden`}
    >
      {conContenido && (
      <>
      {/* Desde tablet (sm:, 640 px: incluye el iPad mini en vertical, 744 px) los topes suben un 40 %: si no, el menú se queda del tamaño de un móvil.
          Los tamaños verticales van en proporción al alto de la pantalla (svh), no fijos: en Safari el alto útil
          es menor (barras) y en móviles pequeños más aún; así nada se monta (la nube sobre el suelo).
          Decoración: el suelo de nubes. Los pájaros y la nubecita van en sus filas (ver decoracionFila). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <SueloTiza className="absolute inset-x-0 bottom-[min(2.75rem,5.5svh)] h-[min(6rem,12svh)] w-full text-tiza sm:bottom-[min(3.75rem,5.5svh)] sm:h-[min(8rem,12svh)]" style={conTiempo(T.suelo)} />
      </div>

      {/* Cabecera: el título a tiza verde (lleva al inicio) y la X. Título y subrayado también se limitan por el
          ancho (vw): en móviles de 320 px empujaban la X fuera de la pantalla. */}
      <div className="flex items-start justify-between gap-3">
        <Link to={paginas.inicio.ruta} onClick={alCerrar} aria-label={textos.menu.irInicio} className="rounded-lg">
          <span
            className="tiza tiza-escribe block text-[min(2.9rem,6svh,11vw)] leading-none sm:text-[min(4rem,6svh)]"
            style={conTiempo(T.titulo, { color: TIZA_VERDE })}
          >
            {textos.menu.tituloPizarra}
          </span>
          <SubrayadoTiza className="mt-1.5 block h-3.5 w-[min(16rem,62vw)] text-tiza sm:h-5 sm:w-88" style={conTiempo(T.subrayado)} />
        </Link>
        <button
          type="button"
          // detail === 0: el botón se ha activado con el teclado (con un toque o un clic vale 1 o más).
          onClick={(evento) => cerrar(evento.detail === 0)}
          aria-label={textos.menu.cerrar}
          aria-controls={ID_MENU}
          className="-mr-1 grid size-12 shrink-0 place-items-center sm:size-16 rounded-full transition-transform duration-150 active:scale-95"
        >
          <CruzTiza className="size-9 text-tiza sm:size-12" style={conTiempo(T.cruz)} />
        </button>
      </div>

      <ul className="mt-[min(2.25rem,3svh)] mb-[min(1.5rem,2svh)] flex flex-col gap-[min(0.375rem,0.6svh)] sm:mt-[min(3.25rem,3svh)] sm:gap-[min(0.75rem,0.8svh)]">
        {paginasMenu.map((p, i) => {
          const color = colorTiza(p.colorIntenso ?? 'var(--color-tiza)')
          const { juguete, texto } = T.filas[i]
          return (
            // relative: la decoración de la fila (si la tiene) se coloca respecto a ella.
            <li key={p.ruta} className="relative">
              <NavLink
                to={p.ruta}
                end
                onClick={alCerrar}
                className="relative isolate flex w-fit items-center gap-5 rounded-full py-[min(0.875rem,1.4svh)] pr-8 pl-4 text-[min(2.2rem,4.6svh)] leading-tight sm:gap-7 sm:py-[min(1.2rem,1.4svh)] sm:pr-11 sm:pl-6 sm:text-[min(3.1rem,4.6svh)]"
              >
                {({ isActive }) => (
                  <>
                    {/* Página activa: un borrón de tiza de su color, con el borde repasado. */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="tiza tiza-aparece absolute inset-0 -z-10 rounded-[2rem_2.6rem_2.2rem_2.8rem/2.4rem_2rem_2.6rem_2.1rem] border-[2.5px]"
                        style={conTiempo(juguete, {
                          borderColor: color,
                          background: `color-mix(in oklab, ${color} 30%, transparent)`,
                        })}
                      />
                    )}
                    {p.juguete && (
                      <JugueteTiza tipo={p.juguete} className={`size-[min(3rem,6svh)] shrink-0 sm:size-[min(4.25rem,6svh)] ${giroJuguete[p.juguete] ?? ''}`} style={conTiempo(juguete, { color, '--tiza-pico': TIZA_NARANJA })} />
                    )}
                    <span className="tiza tiza-escribe" style={conTiempo(texto)}>
                      {p.nombre}
                    </span>
                  </>
                )}
              </NavLink>
              {decoracionFila[p.ruta]}
            </li>
          )
        })}
      </ul>

      {/* "Solicitar visita": nube de contorno azul. Se pinta a la izquierda y se desliza a la derecha.
          mt-auto: baja hasta cerca del suelo de nubes, como en la referencia (el ul deja un mínimo con su margen).
          --recorrido: desde el borde izquierdo del menú hasta su sitio (100vw - su ancho - márgenes, --margenes del panel). */}
      <Link
        to={rutaSolicitarVisita}
        onClick={alCerrar}
        className="tiza-desliza relative mt-auto mr-1 mb-[min(1.5rem,2.5svh)] ml-auto grid h-[min(7.35rem,14svh)] w-[calc(min(7.35rem,14svh)*240/110)] shrink-0 sm:h-[min(10.25rem,14svh)] sm:w-[calc(min(10.25rem,14svh)*240/110)] place-items-center transition-transform duration-150 active:scale-[0.97]"
        style={conTiempo(T.nubeDesliza, { '--recorrido': 'calc(-100vw + 100% + var(--margenes))' })}
      >
        <NubeTiza className="absolute inset-0 size-full" style={conTiempo(T.nubeTrazo, { color: TIZA_AZUL })} />
        <span className="tiza tiza-escribe relative mt-2 -rotate-3 text-[min(1.75rem,3.6svh)] sm:text-[min(2.45rem,3.6svh)]" style={conTiempo(T.nubeTexto)}>
          {textos.hero.botonVisita}
        </span>
      </Link>

      {/* Pie, bajo el suelo de nubes: llamar a la izquierda (con subrayado verde) y redes a la derecha. */}
      <div className="absolute inset-x-0 bottom-0 flex h-[min(4.5rem,9svh)] items-start justify-between px-4 pb-[env(safe-area-inset-bottom)] sm:h-[min(6.25rem,9svh)] sm:px-9">
        <a
          href={enlaceTel(telefonoLlamadas.numero)}
          aria-label={`${textos.menu.llamanosAria} ${formatoPantalla(telefonoLlamadas.numero)}`}
          className="flex min-h-11 items-center gap-2.5 rounded-full px-2 text-[1.6rem] sm:gap-3.5 sm:text-[2.2rem]"
        >
          <span className="tiza tiza-aparece" style={conTiempo(T.pie, { color: TIZA_VERDE })}>
            <IconoTelefono className="size-7 sm:size-9" />
          </span>
          <span className="relative">
            <span className="tiza tiza-escribe block" style={conTiempo(T.pie)}>
              {textos.menu.llamanos}
            </span>
            <SubrayadoTiza
              className="absolute -bottom-1.5 left-0 h-2 w-full"
              style={conTiempo(T.subrayadoPie, { color: TIZA_VERDE })}
            />
          </span>
        </a>
        <span className="tiza tiza-aparece" style={conTiempo(T.redes)}>
          <SocialLinks tamano="pizarra" />
        </span>
      </div>
      </>
      )}
    </nav>,
    document.body,
  )
}

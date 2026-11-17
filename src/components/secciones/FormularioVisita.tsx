import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { anclaSolicitarVisita, paginas } from '../../data/paginas'
import { site } from '../../data/site'
import { textos } from '../../data/textos'
import { useLetraQueCabe } from '../../hooks/useLetraQueCabe'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { CamionEnviar } from '../CamionEnviar'
import { SelloMatricula } from '../SelloMatricula'
import { Seccion } from '../Seccion'

// "Solicitud de visita": una hoja de cuaderno escolar (cuadrícula, margen rojo y agujeros de anilla: .cuaderno en
// index.css) que se rellena como una carta: "Hola, me llamo ___. Mi peque tiene ___…". El sello "Matrícula
// abierta" va estampado en la esquina, como el sello de una carta.
//
// Cómo funciona el envío (Netlify Forms):
// - Netlify busca los formularios en el HTML al publicar. Como esta web la pinta React (en el navegador), no los
//   encontraría: por eso en index.html hay un formulario "fantasma" (oculto) con el mismo nombre y los mismos
//   campos. Ese le dice a Netlify qué guardar.
// - Este formulario envía los datos con fetch a "/", con el campo oculto form-name (el nombre del formulario).
// - bot-field es el "honeypot" (tarro de miel): un campo invisible para las personas. Los robots de spam lo
//   rellenan, y Netlify descarta los envíos que lo traen relleno.
// Validación: cada hueco se comprueba al salir de él (no mientras se escribe la primera vez: molestaría); si ya
// tenía error, se vuelve a comprobar al escribir, para que el aviso se vaya en cuanto se corrige.

const t = textos.secciones.formulario
const NOMBRE_FORMULARIO = 'solicitar-visita'
const MINIMO_ENVIANDO = 1000 // ms: lo mínimo que se ve el osito con la pelota (si no, sería un parpadeo)

type Campos = { nombre: string; nacido: string; nacimiento: string; contacto: string; mensaje: string }
type Campo = keyof Campos
type Estado = 'editando' | 'enviando' | 'enviado' | 'error'
const CAMPOS_VACIOS: Campos = { nombre: '', nacido: '', nacimiento: '', contacto: '', mensaje: '' }

// Fechas en el formato de <input type="date"> (AAAA-MM-DD), en la hora de aquí (no en UTC).
function fechaISO(fecha: Date): string {
  const dos = (n: number) => String(n).padStart(2, '0')
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`
}
function desdeHoy({ anios = 0, meses = 0 }: { anios?: number; meses?: number }): string {
  const fecha = new Date()
  fecha.setFullYear(fecha.getFullYear() + anios, fecha.getMonth() + meses)
  return fechaISO(fecha)
}
// Qué fechas valen: si ya ha nacido, de los últimos 4 años (la escuela es de 0 a 3 y se pide plaza con tiempo);
// si aún no, de los próximos 10 meses. Sin elegir todavía, cualquiera de las dos.
const YA_NACIDO = t.nacido.opciones[0].valor
const SIN_NACER = t.nacido.opciones[1].valor
function rangoFechas(nacido: string): { min: string; max: string } {
  const hoy = fechaISO(new Date())
  if (nacido === YA_NACIDO) return { min: desdeHoy({ anios: -4 }), max: hoy }
  if (nacido === SIN_NACER) return { min: hoy, max: desdeHoy({ meses: 10 }) }
  return { min: desdeHoy({ anios: -4 }), max: desdeHoy({ meses: 10 }) }
}

// Teléfono español (9 cifras, empieza por 6, 7, 8 o 9; se admiten espacios, puntos, guiones y el +34) o email.
function esTelefono(valor: string): boolean {
  return /^[6789]\d{8}$/.test(valor.replace(/[\s.-]/g, '').replace(/^(\+34|0034)/, ''))
}
function esEmail(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim())
}

function validar(campos: Campos): Partial<Record<Campo, string>> {
  const errores: Partial<Record<Campo, string>> = {}
  if (!campos.nombre.trim()) errores.nombre = t.errores.nombre
  if (!campos.nacido) errores.nacido = t.errores.nacido
  const sinNacer = campos.nacido === SIN_NACER
  const { min, max } = rangoFechas(campos.nacido)
  if (!campos.nacimiento) errores.nacimiento = sinNacer ? t.errores.prevista : t.errores.nacimiento
  // Comparar textos AAAA-MM-DD sirve: van de mayor a menor (año, mes, día).
  else if (campos.nacimiento < min || campos.nacimiento > max) errores.nacimiento = sinNacer ? t.errores.previstaFuera : t.errores.nacimientoFuera
  if (!esTelefono(campos.contacto) && !esEmail(campos.contacto)) errores.contacto = t.errores.contacto
  return errores
}

const espera = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Clase de los huecos: solo una raya debajo (como escribir en el renglón) y letra de mano (Patrick Hand, la de la
// pizarra), fina, como si se escribiera con boli en el cuaderno. Cada hueco, de un color (colorHueco).
// Medidas en cuadros de la cuadrícula (1 cuadro = 1.25rem = 20 px, --cuadro en index.css): el campo mide 2 cuadros
// (h-10) y su etiqueta 1 (leading-5); la línea de la carta, 3 (leading-15). Así la raya de cada hueco cae
// sobre una línea de la cuadrícula y las frases se apoyan en ella (Antonio: "no coincidían con los cuadrados").
// Lo escrito se apoya en la raya, como en un cuaderno: .hueco-renglon (y .hueco-mensaje), en index.css.
// text-xl (20 px): lo escrito cabe en un cuadro de la cuadrícula (ver .hueco-renglon en index.css).
const claseLetra = 'w-full font-tiza text-xl font-normal'
// El interlineado va aquí (leading-*) y no en index.css: text-2xl trae el suyo y, como utilidad, ganaría.
const claseHueco = `hueco-renglon ${claseLetra} leading-none`
const claseMensaje = `hueco-mensaje ${claseLetra} leading-10`
// Color de lo que se escribe en cada hueco (Antonio, 2026-11-16), en versiones oscuras para que se lea sobre el papel
// blanco (todas de 5:1 o más): nombre ciruela, fecha mostaza (el "amarillo" que se lee), teléfono o email azul y
// mensaje verde. El email de abajo ("O, si lo preferís…"), en azul, como el teléfono o email de la carta.
const colorHueco = { nombre: 'text-ciruela', nacimiento: 'text-mostaza-texto', contacto: 'text-arbol-azul-texto', mensaje: 'text-verde' } as const
// Largo máximo de cada campo (seguridad, fase 4): nadie puede pegar un texto enorme para saturar el buzón. Un nombre,
// un email o un teléfono caben de sobra; el mensaje, unas 150 palabras. Netlify, además, limita lo que recibe.
const LARGO_MAXIMO = { nombre: 80, contacto: 120, mensaje: 1000 } as const

// El círculo de boli con el que se rodea "nació" o "nacerá": un óvalo a mano, que no llega a cerrarse del todo.
// En coral, como el boli rojo de las fichas (Antonio: no del mismo color que la fecha); la palabra, en tinta.
// Se estira a lo que rodea (preserveAspectRatio="none"); el trazo no engorda al estirarse (non-scaling-stroke).
function CirculoBoli() {
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="pointer-events-none absolute -top-0.5 -left-1.5 h-[calc(100%+0.25rem)] w-[calc(100%+0.75rem)] overflow-visible text-coral">
      <path
        className="rodea-traza"
        pathLength={1}
        d="M84 7C66 0 22 1 9 13 0 23 14 36 44 38 74 40 98 31 96 18 95 10 86 5 70 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// "nació / nacerá": dos opciones (radio) escritas en la carta; la elegida se rodea con boli. Los radio son de verdad
// (sr-only): se eligen con el teclado (flechas) y el lector de pantalla los anuncia con su pregunta.
function RodeaNacido({ valor, alElegir, error, idError }: { valor: string; alElegir: (valor: string) => void; error?: string; idError: string }) {
  return (
    <span
      role="radiogroup"
      aria-label={t.nacido.pregunta}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? idError : undefined}
      // mr-1.5: aire para el círculo, que si no rozaba la palabra de después ("el").
      className="mr-1.5 inline-flex flex-col align-top"
    >
      {/* relative top-2.5: las palabras bajan 10 px (solo se ve) para apoyarse en una línea del papel, como el resto
          de la frase; centradas en el hueco, la línea las cruzaba por la mitad. El círculo baja con ellas. */}
      <span className="relative top-2.5 inline-flex h-10 items-center gap-1 font-tiza text-2xl leading-10 font-normal max-sm:top-0 sm:text-[1.6rem]">
        {t.nacido.opciones.map((opcion, i) => {
          const elegida = valor === opcion.valor
          return (
            <span key={opcion.valor} className="inline-flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden="true" className="text-tinta/35">
                  /
                </span>
              )}
              <label className="relative cursor-pointer px-1.5">
                <input type="radio" name="nacido" value={opcion.valor} checked={elegida} onChange={() => alElegir(opcion.valor)} className="peer sr-only" />
                <span className={`rounded-sm transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-current ${elegida ? 'text-tinta' : 'text-tinta/70 hover:text-tinta'}`}>
                  {opcion.palabra}
                </span>
                {elegida && <CirculoBoli />}
              </label>
            </span>
          )
        })}
      </span>
      {/* "Rodea una": la pista, solo mientras no hay nada rodeado (después el círculo la tapaba). invisible y no
          hidden: deja su hueco y no se mueve nada. */}
      {/* En móvil la carta baja 10 px: la pista sube esos 10 px para no quedar cruzada por una línea del papel. */}
      <span className={`font-sans text-sm leading-5 font-normal text-tinta/70 max-sm:relative max-sm:-top-2.5 ${valor ? 'invisible' : ''}`}>{t.nacido.rodea}</span>
      {error && (
        <span id={idError} className="font-sans text-sm leading-5 font-semibold text-coral">
          {error}
        </span>
      )}
    </span>
  )
}

// Un hueco de la carta: el campo, su etiqueta pequeña debajo (como en las fichas de papel) y, si lo hay, el error.
function Hueco({ id, etiqueta, error, ancho, children }: { id: string; etiqueta: string; error?: string; ancho: string; children: ReactNode }) {
  return (
    // max-sm:-top-2.5: en móvil la carta baja 10 px (ver la carta); el hueco sube esos 10 px y su raya sigue sobre
    // una línea de la cuadrícula.
    <span className={`inline-flex flex-col align-top max-sm:relative max-sm:-top-2.5 ${ancho}`}>
      {children}
      <label htmlFor={id} className="font-sans text-sm leading-5 font-normal text-tinta/70">
        {etiqueta}
      </label>
      {error && (
        <span id={`${id}-error`} className="font-sans text-sm leading-5 font-semibold text-coral">
          {error}
        </span>
      )}
    </span>
  )
}

export function FormularioVisita() {
  const id = useId()
  const ids = {
    nombre: `${id}-nombre`,
    nacido: `${id}-nacido`,
    nacimiento: `${id}-nacimiento`,
    contacto: `${id}-contacto`,
    mensaje: `${id}-mensaje`,
    consentimiento: `${id}-consentimiento`,
  }
  const [campos, setCampos] = useState<Campos>(CAMPOS_VACIOS)
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({})
  const [consentimiento, setConsentimiento] = useState(false)
  const [estado, setEstado] = useState<Estado>('editando')
  const formulario = useRef<HTMLFormElement>(null)
  const gracias = useRef<HTMLHeadingElement>(null)
  const avisoError = useRef<HTMLParagraphElement>(null)
  const reducido = usePrefersReducedMotion()
  // Nombre y teléfono o email: si lo escrito no cabe en el hueco, la letra encoge (useLetraQueCabe).
  const { ref: refNombre, style: letraNombre } = useLetraQueCabe(campos.nombre)
  const { ref: refContacto, style: letraContacto } = useLetraQueCabe(campos.contacto)

  const errores = validar(campos)
  // Lista para enviar: los obligatorios bien (nombre, nació/nacerá, la fecha y teléfono o email) y la casilla marcada.
  // Hasta entonces el botón no se activa (Antonio: antes bastaba con la casilla para activarlo) y debajo se dice qué falta.
  const listo = Object.keys(errores).length === 0 && consentimiento
  const pendientes: string[] = []
  if (errores.nombre) pendientes.push(t.falta.nombre)
  if (errores.nacido) pendientes.push(t.falta.nacido)
  if (errores.nacimiento) pendientes.push(t.falta.nacimiento)
  if (errores.contacto) pendientes.push(t.falta.contacto)
  if (!consentimiento) pendientes.push(t.falta.casilla)
  const faltan = new Intl.ListFormat('es', { type: 'conjunction' }).format(pendientes)
  // Solo se enseña el error de un hueco que ya se ha tocado (o tras intentar enviar, que los marca todos).
  const errorDe = (campo: Campo) => (tocados[campo] ? errores[campo] : undefined)

  // Al terminar el envío, la pantalla va al resultado y lo deja en el centro (Antonio: sobre todo en móvil, donde
  // el mensaje podía quedar fuera de la vista o bajo el teclado). Suave, salvo con movimiento reducido.
  // Si sale bien, además el foco va al "Gracias": el lector de pantalla lo lee y nadie se queda en un botón que ya
  // no está (preventScroll: el desplazamiento ya lo hace scrollIntoView). Si falla, el aviso tiene role="alert".
  useEffect(() => {
    const destino = estado === 'enviado' ? gracias.current : estado === 'error' ? avisoError.current : null
    if (!destino) return
    destino.scrollIntoView({ block: 'center', behavior: reducido ? 'auto' : 'smooth' })
    if (estado === 'enviado') destino.focus({ preventScroll: true })
  }, [estado, reducido])

  const cambiar = (campo: Campo, valor: string) => setCampos((anteriores) => ({ ...anteriores, [campo]: valor }))
  const tocar = (campo: Campo) => setTocados((anteriores) => ({ ...anteriores, [campo]: true }))
  // Props comunes de los huecos obligatorios: el error unido al campo (aria-describedby) y marcado (aria-invalid).
  const accesible = (campo: Campo) => ({
    'aria-invalid': errorDe(campo) ? true : undefined,
    'aria-describedby': errorDe(campo) ? `${ids[campo]}-error` : undefined,
  })

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (estado === 'enviando') return
    const conErrores = Object.keys(errores) as Campo[]
    if (conErrores.length > 0) {
      setTocados({ nombre: true, nacido: true, nacimiento: true, contacto: true })
      // El foco al primer hueco que falla, para corregirlo sin buscarlo (en "nació / nacerá", a su primera opción).
      const primero = conErrores[0]
      if (primero === 'nacido') formulario.current?.querySelector<HTMLInputElement>('input[name="nacido"]')?.focus()
      else document.getElementById(ids[primero])?.focus()
      return
    }
    setEstado('enviando')
    // En desarrollo (npm run dev, en el ordenador) no hay Netlify y el envío fallaría: se SIMULA (1,5 s y "Gracias")
    // para poder ver la animación. import.meta.env.DEV es false en la web publicada: allí se envía de verdad.
    if (import.meta.env.DEV) {
      await espera(1500)
      setEstado('enviado')
      return
    }
    const datos = new FormData(formulario.current ?? undefined)
    try {
      const [respuesta] = await Promise.all([
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(datos as unknown as Record<string, string>).toString(),
        }),
        espera(MINIMO_ENVIANDO),
      ])
      setEstado(respuesta.ok ? 'enviado' : 'error')
    } catch {
      setEstado('error')
    }
  }

  function otraSolicitud() {
    setCampos(CAMPOS_VACIOS)
    setTocados({})
    setConsentimiento(false)
    setEstado('editando')
  }

  // Título en azul, el mismo de bolígrafo de los huecos (Antonio): así no coincide con la dirección de arriba.
  return (
    <Seccion id={anclaSolicitarVisita} titulo={t.titulo} resalte={{ forma: 'chispas', color: 'naranja' }} colorTitulo="text-arbol-azul-texto">
      <div className="cuaderno relative mx-auto max-w-3xl py-10 pr-5 pl-12 sm:py-15 sm:pr-12 sm:pl-24">
        {/* El sello, estampado en la esquina de la hoja (en móvil, más pequeño y dentro, para que no se corte). */}
        <SelloMatricula className="absolute -top-8 right-2 size-24 sm:-top-12 sm:-right-10 sm:size-32" />

        {estado === 'enviado' ? (
          <div className="flex flex-col items-start gap-4 py-6 font-titulo">
            {/* "Gracias," en tinta y el nombre en coral (Antonio: en ciruela quedaba poco colorido); el botón, en verde:
                ninguno repite el azul del título de la sección. */}
            <h3 ref={gracias} tabIndex={-1} className="text-3xl font-semibold text-tinta sm:text-4xl">
              {t.enviado.gracias} <span className="text-coral">{campos.nombre.trim()}</span>
            </h3>
            <p className="max-w-xl font-sans text-lg text-tinta/80">{t.enviado.texto}</p>
            <button type="button" onClick={otraSolicitud} className="mt-2 font-semibold text-verde underline underline-offset-4">
              {t.enviado.otra}
            </button>
          </div>
        ) : (
          <form ref={formulario} name={NOMBRE_FORMULARIO} method="POST" onSubmit={enviar} noValidate>
            <input type="hidden" name="form-name" value={NOMBRE_FORMULARIO} />
            {/* Honeypot: invisible para las personas (hidden) y fuera del tabulador. */}
            <p hidden>
              <label>
                No rellenes este campo: <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            {/* La carta: cada línea, 3 cuadros (los huecos, con su etiqueta debajo, caben justos). En móvil, 2 (Antonio:
                quedaban huecos grandes entre las frases); allí cada hueco va en su línea, de 3 cuadros con su etiqueta.
                En líneas de 2 cuadros el texto queda 10 px más arriba y la cuadrícula lo cruzaba: max-sm:py-2.5 baja
                todo 10 px (y suma un cuadro justo, para que lo de después siga cuadrando); los huecos suben esos 10 px
                (Hueco), y "nació / nacerá" no se baja aparte (RodeaNacido). */}
            <p className="font-titulo text-xl leading-10 max-sm:py-2.5 sm:text-2xl sm:leading-15">
              {t.carta.saludo}{' '}
              <Hueco id={ids.nombre} etiqueta={t.etiquetas.nombre} error={errorDe('nombre')} ancho="w-full sm:w-64">
                <input
                  id={ids.nombre}
                  ref={refNombre}
                  style={letraNombre}
                  name="nombre"
                  maxLength={LARGO_MAXIMO.nombre}
                  autoComplete="name"
                  value={campos.nombre}
                  onChange={(e) => cambiar('nombre', e.target.value)}
                  onBlur={() => tocar('nombre')}
                  className={`${claseHueco} ${colorHueco.nombre}`}
                  {...accesible('nombre')}
                />
              </Hueco>
              {/* En móvil cada hueco ocupa su línea entera y el punto quedaba suelto al empezar la siguiente: se oculta. */}
              <span className="hidden sm:inline">.</span> {t.carta.peque}{' '}
              <RodeaNacido
                valor={campos.nacido}
                alElegir={(valor) => {
                  cambiar('nacido', valor)
                  tocar('nacido')
                }}
                error={errorDe('nacido')}
                idError={`${ids.nacido}-error`}
              />{' '}
              {t.carta.el}{' '}
              <Hueco
                id={ids.nacimiento}
                etiqueta={campos.nacido === SIN_NACER ? t.etiquetas.prevista : t.etiquetas.nacimiento}
                error={errorDe('nacimiento')}
                ancho="w-full sm:w-52"
              >
                <input
                  id={ids.nacimiento}
                  type="date"
                  name="nacimiento"
                  {...rangoFechas(campos.nacido)}
                  value={campos.nacimiento}
                  onChange={(e) => {
                    const fecha = e.target.value
                    cambiar('nacimiento', fecha)
                    // Con la fecha ya se sabe si ha nacido (Antonio): hasta hoy, "nació"; después, "nacerá". Se rodea sola
                    // (y se mueve si cambian la fecha).
                    if (fecha) {
                      cambiar('nacido', fecha > fechaISO(new Date()) ? SIN_NACER : YA_NACIDO)
                      tocar('nacido')
                    }
                  }}
                  onBlur={() => tocar('nacimiento')}
                  // Vacía, en gris (el dd/mm/aaaa del navegador, como texto de ejemplo); con fecha, en mostaza.
                  className={`${claseHueco} cursor-pointer ${campos.nacimiento ? colorHueco.nacimiento : 'text-tinta/70'}`}
                  {...accesible('nacimiento')}
                />
              </Hueco>{' '}
              {t.carta.visita}{' '}
              <Hueco id={ids.contacto} etiqueta={t.etiquetas.contacto} error={errorDe('contacto')} ancho="w-full sm:w-80">
                <input
                  id={ids.contacto}
                  ref={refContacto}
                  style={letraContacto}
                  name="contacto"
                  maxLength={LARGO_MAXIMO.contacto}
                  autoComplete="email"
                  inputMode="email"
                  value={campos.contacto}
                  onChange={(e) => cambiar('contacto', e.target.value)}
                  onBlur={() => tocar('contacto')}
                  className={`${claseHueco} ${colorHueco.contacto}`}
                  {...accesible('contacto')}
                />
              </Hueco>
              <span className="hidden sm:inline">.</span>
            </p>

            {/* RITMO DE LA CUADRÍCULA (Antonio, 2026-11-16: había frases con la línea del papel cruzándolas): de aquí para
                abajo, márgenes de 20 en 20 px (mt-5, mt-10) y el texto pequeño con un renglón por cuadro (leading-5),
                así cada línea cae entre dos líneas del papel. relative top-2.5: baja esta frase 10 px (solo se ve, no
                mueve nada) para que se apoye en una línea en vez de quedar cruzada por la mitad. */}
            <p className="relative top-2.5 mt-5 font-titulo text-xl leading-10 max-sm:mt-0 sm:text-2xl">{t.carta.mas}</p>
            <div className="relative">
              {/* block: como elemento en línea, el textarea dejaba un hueco debajo que descuadraba lo de después.
                  Por debajo de escritorio (lg), 2 líneas en vez de 3 (h-25 = 100 px; desde lg, h-35 = 140 px) y sin la
                  esquina para estirarlo (los móviles no la enseñan): en su lugar, las dos rayitas dibujadas, de adorno
                  (Antonio: "como en desktop"). */}
              <textarea
                id={ids.mensaje}
                name="mensaje"
                maxLength={LARGO_MAXIMO.mensaje}
                rows={3}
                value={campos.mensaje}
                onChange={(e) => cambiar('mensaje', e.target.value)}
                className={`${claseMensaje} block h-25 resize-none lg:h-35 lg:resize-y ${colorHueco.mensaje}`}
              />
              <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false" className="pointer-events-none absolute right-0.5 bottom-6.5 size-2.5 text-tinta/45 lg:hidden">
                <path d="M9 2 2 9M9 6 6 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <label htmlFor={ids.mensaje} className="block text-sm leading-5 text-tinta/70">
                {t.etiquetas.mensaje}
              </label>
            </div>

            {/* Consentimiento: sin marcar; sin él, el botón no se activa (CLAUDE.md). */}
            {/* La casilla mide justo un cuadro (size-5) y cae sobre uno de la cuadrícula. */}
            <div className="mt-10 flex items-start gap-3">
              <input
                id={ids.consentimiento}
                type="checkbox"
                name="consentimiento"
                value="si"
                checked={consentimiento}
                onChange={(e) => setConsentimiento(e.target.checked)}
                className="m-0 size-5 shrink-0 cursor-pointer accent-ciruela"
              />
              <label htmlFor={ids.consentimiento} className="cursor-pointer leading-5 text-tinta/85">
                {t.consentimientoAntes}{' '}
                <Link to={paginas.privacidad.ruta} className="font-semibold text-ciruela underline underline-offset-4">
                  {t.consentimientoEnlace}
                </Link>{' '}
                {t.consentimientoDespues}
              </label>
            </div>

            <div className="mt-10 flex flex-col items-start">
              {/* El camión de bomberos (CamionEnviar.tsx): apagado hasta que esté todo (listo); al enviar, arranca y sale
                  por la derecha. disabled solo mientras falta algo o se envía. Va en una caja de alto justo (6 y 8
                  cuadros), apoyado abajo: el camión no mide cuadros exactos y descuadraría lo de debajo. */}
              <div className="flex h-30 items-end sm:h-40">
              <button
                type="submit"
                disabled={!listo || estado === 'enviando'}
                data-estado={estado === 'enviando' ? 'enviando' : listo ? 'listo' : 'apagado'}
                className={`camion -ml-1 rounded-2xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-ciruela ${!listo ? 'cursor-not-allowed' : estado === 'enviando' ? 'cursor-wait' : 'cursor-pointer'}`}
              >
                <CamionEnviar estado={estado === 'enviando' ? 'enviando' : listo ? 'listo' : 'apagado'} texto={t.enviar} className="w-52 sm:w-72" />
              </button>
              </div>
              {/* aria-live: al ir rellenando, el lector de pantalla dice qué falta todavía; al enviar, "Enviando…" solo para
                  el lector de pantalla (sr-only): a la vista, el envío lo cuenta el camión, que arranca y se va (Antonio:
                  el osito que salía debajo se solapaba con el camión, duraba muy poco y casi no se veía). min-h-10: dos
                  renglones, aunque esté vacío. */}
              <p aria-live="polite" className="mt-5 flex min-h-10 items-start gap-2 text-sm leading-5 text-tinta/70">
                {estado === 'enviando' ? <span className="sr-only">{t.enviando}</span> : !listo && `${t.falta.antes} ${faltan}.`}
              </p>
              {/* role="alert": si falla el envío, el lector de pantalla lo dice en cuanto aparece. */}
              {estado === 'error' && (
                <p ref={avisoError} role="alert" className="mt-5 leading-5 font-semibold text-coral">
                  {t.error}
                </p>
              )}
            </div>

            {/* La alternativa: escribir directamente por email. */}
            <p className="mt-5 leading-5 text-tinta/85">
              {t.escribenosDirecto}{' '}
              <a href={`mailto:${site.email}`} className="font-semibold text-arbol-azul-texto underline underline-offset-4 wrap-anywhere">
                {site.email}
              </a>
              .
            </p>

            <p className="mt-5 border-t border-dashed border-tinta/20 pt-5 text-sm leading-5 text-tinta/70">
              {t.infoBasica.antes}{' '}
              <Link to={paginas.privacidad.ruta} className="font-semibold underline underline-offset-2">
                {t.infoBasica.enlace}
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </Seccion>
  )
}

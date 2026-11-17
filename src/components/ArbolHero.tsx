import { trasCargarYLibre } from '../utils/cuandoEsteLibre'
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react'
import { useEffect, useState } from 'react'
import arbol from '../assets/logo-arbol.webp'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { marcarVisto, yaSeHaVisto } from '../utils/vistoEnLaVisita'
import { Nube, Pajaro } from './Decoracion'

const CLAVE_VISTO = 'arbol-hero-visto'

// Base del tronco dentro de la imagen del árbol (x = 290/600 ≈ 48 %, y = 690/805 ≈ 86 %).
// Es el punto que no se mueve: el árbol se dobla desde ahí y la copa es lo que más se desplaza.
const BASE_TRONCO = '48% 86%'

// Pájaros y nubecitas que salen de la copa al hacer scroll. Posiciones en % de la imagen del árbol;
// dx/dy: cuánto se desplazan (px) hasta desaparecer; retraso: en qué punto del tramo anclado del hero
// salen (0 = al empezar, 1 = al terminar). El primero sale al 15 %: antes, el árbol ya ha empezado a
// temblar. Con scroll normal, cada uno vuela durante el 50 % del tramo.
const voladores = [
  { tipo: 'pajaro', x: 60, y: 16, dx: 70, dy: -280, retraso: 0.15, ancho: 'w-10' },
  { tipo: 'nube', x: 42, y: 26, dx: -30, dy: -260, retraso: 0.21, ancho: 'w-16' },
  { tipo: 'pajaro', x: 34, y: 22, dx: -90, dy: -300, retraso: 0.28, ancho: 'w-8' },
  { tipo: 'pajaro', x: 72, y: 34, dx: 120, dy: -240, retraso: 0.35, ancho: 'w-7' },
  { tipo: 'nube', x: 24, y: 40, dx: -110, dy: -220, retraso: 0.42, ancho: 'w-12' },
] as const

// Temblor ligado al avance del scroll: oscila unas 9-10 veces a lo largo del tramo anclado (±2,5°).
// Aparece en el primer 8 % (sube), se mantiene y se apaga en el último 15 % (baja).
function temblorEn(avance: number): number {
  if (avance <= 0 || avance >= 1) return 0
  const intensidad = Math.min(1, avance / 0.08, (1 - avance) / 0.15)
  return Math.sin(avance * 60) * 2.5 * intensidad
}

type DatosVolador = (typeof voladores)[number]

const DURACION_EN_TRAMO = 0.5 // con scroll normal, el vuelo ocupa el 50 % del tramo anclado
const VUELO_MIN = 0.28 // si se para el scroll, sigue subiendo solo (≈ 3,5 s para el vuelo entero)
const VUELO_MAX = 0.9 // con scroll muy rápido, no pasa "de golpe": como mínimo ≈ 1,1 s

// Cada volador tiene su propio avance de vuelo (0 → 1). El scroll lo "suelta" al llegar a su retraso y
// marca el objetivo; en cada fotograma el vuelo se acerca al objetivo, pero nunca más despacio que
// VUELO_MIN (si se para, sigue subiendo) ni más rápido que VUELO_MAX (si se va rápido, se ve igual).
function Volador({ progreso, volador }: { progreso: MotionValue<number>; volador: DatosVolador }) {
  const { tipo, x, y, dx, dy, retraso, ancho } = volador
  const vuelo = useMotionValue(0)

  useAnimationFrame((_, msDesdeAnterior) => {
    const ida = progreso.get()
    const actual = vuelo.get()
    if (ida <= 0) {
      if (actual !== 0) vuelo.set(0) // arriba del todo: se rearma
      return
    }
    if (ida < retraso || actual >= 1) return // aún no ha salido, o ya se fue
    const segundos = msDesdeAnterior / 1000
    const objetivo = Math.min(1, (ida - retraso) / DURACION_EN_TRAMO)
    const paso = Math.min(Math.max(objetivo - actual, VUELO_MIN * segundos), VUELO_MAX * segundos)
    vuelo.set(Math.min(1, actual + paso))
  })

  // Aparece enseguida, vuela hacia arriba y se desvanece antes de llegar al menú.
  const opacity = useTransform(vuelo, [0, 0.08, 0.76, 1], [0, 1, 1, 0])
  const desplazaX = useTransform(vuelo, [0, 1], [0, dx])
  const desplazaY = useTransform(vuelo, [0, 1], [0, dy])

  return (
    <motion.span className={`pointer-events-none absolute ${ancho}`} style={{ left: `${x}%`, top: `${y}%`, x: desplazaX, y: desplazaY, opacity }}>
      {tipo === 'pajaro' ? <Pajaro className="w-full text-azul" /> : <Nube className="w-full text-arbol-azul" />}
    </motion.span>
  )
}

type ArbolHeroProps = {
  progreso: MotionValue<number> // 0 → 1 mientras el hero sale de la pantalla (lo calcula Hero.tsx)
  className: string // ancho del árbol (y su margen), según el tamaño de pantalla
}

/**
 * Árbol del logo en el hero. Al hacer scroll se mece a los lados, como si alguien lo empujara, y de la
 * copa salen volando pájaros y nubecitas hacia arriba. Con movimiento reducido, todo quieto.
 */
export function ArbolHero({ progreso, className }: ArbolHeroProps) {
  const reducido = usePrefersReducedMotion()

  // El efecto solo va hacia delante: se guarda el punto más lejano al que ha llegado el scroll.
  // Al subir, los pájaros y nubecitas que ya se fueron no regresan. Pero al volver ARRIBA DEL TODO
  // (progreso 0) el efecto se "rearma": si se vuelve a bajar, se repite desde el principio.
  const progresoIda = useMotionValue(0)
  useMotionValueEvent(progreso, 'change', (valor) => {
    if (valor <= 0) progresoIda.set(0)
    else if (valor > progresoIda.get()) progresoIda.set(valor)
  })

  // Dos movimientos que se suman:
  // - empujón por la velocidad del scroll (px/s → grados, limitado a ±4°);
  // - temblor ligado al avance (temblorEn), que se nota aunque se baje despacio.
  // Solo al BAJAR por delante (avance real = el más lejano): al subir, o con el efecto ya terminado,
  // el árbol se queda quieto (el hero es fijo).
  const { scrollY } = useScroll()
  const velocidad = useVelocity(scrollY)
  const inclinacion = useTransform(velocidad, [-2500, 0, 2500], [4, 0, -4], { clamp: true })
  // El temblor se multiplica por "cuánto se está moviendo" (0 con la rueda quieta, 1 desde 300 px/s):
  // así, si se para a mitad, el árbol no se queda torcido; el muelle lo devuelve a su sitio.
  // Sacudida al llegar: cada vez que se monta el árbol (al cargar la web o al entrar en Inicio desde otra
  // página) se sacude como si acabara de "aterrizar": oscila y se va apagando en ~1,4 s.
  // Empieza cuando la página ha terminado de cargar y el navegador está libre (trasCargarYLibre): si arrancaba a la
  // vez que la carga, competía con ella y la web tardaba más en responder (medido con Lighthouse).
  // La PRIMERA vez en la visita, no (Antonio, 2026-11-17): al abrir la web el árbol aparece quieto, como una foto, y
  // la página carga sin esa animación encima. Se mueve si lo tocan y con el scroll; la sacudida al llegar, desde la
  // segunda vez que se entra en Inicio. Se decide al montar y se recuerda en sessionStorage (vistoEnLaVisita.ts).
  const [primeraVez] = useState(() => !yaSeHaVisto(CLAVE_VISTO))
  const sacudida = useMotionValue(0)
  useEffect(() => {
    if (primeraVez) {
      marcarVisto(CLAVE_VISTO)
      return
    }
    if (reducido) return
    let control: ReturnType<typeof animate> | undefined
    const cancelar = trasCargarYLibre(() => {
      control = animate(sacudida, [0, 3.5, -3, 2.2, -1.5, 0.8, -0.3, 0], { duration: 1.4, ease: 'easeOut' })
    })
    return () => {
      cancelar()
      control?.stop() // si se sale de la página a medias, se para
    }
  }, [primeraVez, reducido, sacudida])

  // Sacudida SUAVE al pasar el ratón por el árbol o al tocarlo con el dedo (máx. 1,6°, ~1 s).
  const sacudirSuave = () => {
    if (reducido) return
    animate(sacudida, [0, 1.6, -1.3, 0.9, -0.5, 0.2, 0], { duration: 1, ease: 'easeOut' })
  }

  const empuje = useTransform(
    [inclinacion, progreso, progresoIda, velocidad, sacudida],
    ([grados, avance, ida, vel, llegada]: number[]) => {
      // Quieto si: ya terminó el efecto, se va por detrás de lo ya recorrido (subiendo), NO se está bajando (vel ≤ 0) o
      // se está arriba del todo (avance 0). Las dos últimas (2026-11-17): arriba del todo el efecto se rearma (ida = 0)
      // y el final de la subida, o el rebote del iPhone al llegar arriba, contaban como "bajar": el árbol temblaba ~1 s.
      if (ida >= 1 || avance <= 0 || vel <= 0 || avance < ida - 0.002) return llegada
      const moviendose = Math.min(1, Math.abs(vel) / 300)
      return grados + temblorEn(avance) * moviendose + llegada
    },
  )
  // Muelle poco amortiguado: al dejar de hacer scroll, el árbol se balancea un poco antes de pararse.
  const meneo = useSpring(empuje, { stiffness: 90, damping: 5, mass: 0.6 })

  return (
    // Ratón: al entrar en el árbol. Dedo (móvil y tablet): al tocarlo.
    <span
      className={`relative block ${className}`}
      onPointerEnter={(e) => e.pointerType === 'mouse' && sacudirSuave()}
      onPointerDown={(e) => e.pointerType !== 'mouse' && sacudirSuave()}
    >
      <motion.img
        src={arbol}
        alt=""
        width={720}
        height={965}
        fetchPriority="high"
        className="block h-auto w-full"
        style={reducido ? undefined : { skewX: meneo, transformOrigin: BASE_TRONCO }}
      />
      {!reducido && (
        <span aria-hidden="true">
          {voladores.map((volador, i) => (
            <Volador key={i} progreso={progresoIda} volador={volador} />
          ))}
        </span>
      )}
    </span>
  )
}

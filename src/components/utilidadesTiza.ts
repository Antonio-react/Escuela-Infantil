import type { EstiloConVariables } from './Tiza'

// Utilidades de la pizarra (menú de móvil y 404). Van aparte de Tiza.tsx porque no son componentes:
// un archivo que mezcla componentes y funciones rompe la recarga en caliente de Vite (react-refresh).

// Cuándo empieza una pieza y cuánto tarda en dibujarse, en milisegundos.
export type Tiempo = { retraso: number; duracion: number }

// Variables que leen las clases .tiza-* de index.css, más otros estilos que necesite la pieza.
export const conTiempo = ({ retraso, duracion }: Tiempo, extra: EstiloConVariables = {}): EstiloConVariables => ({
  '--retraso': `${retraso}ms`,
  '--duracion': `${duracion}ms`,
  ...extra,
})

// El mismo tiempo, desplazado: para lo que está a la derecha de otra pieza de su misma línea.
export const despues = ({ retraso, duracion }: Tiempo, ms: number): Tiempo => ({ retraso: retraso + ms, duracion })

// Lo que tarda en escribirse un texto corto de una línea: más cuanto más largo, como al escribirlo de verdad.
export const duracionTexto = (texto: string) => 60 + texto.length * 11

// Lo que tarda TextoTiza (palabra a palabra) en escribir un texto, a tantos milisegundos por letra.
export const duracionPalabras = (texto: string, msPorLetra: number) => texto.length * msPorLetra

// Color de tiza: un color intenso aclarado con blanco, como una tiza de color.
export const colorTiza = (color: string) => `color-mix(in oklab, ${color} 68%, white)`

// Las tizas de colores de la web: los colores intensos del árbol aclarados (colorTiza) y la tiza blanca.
export const tizas = {
  blanca: 'var(--color-tiza)',
  verde: colorTiza('var(--color-arbol-verde-intenso)'),
  azul: colorTiza('var(--color-arbol-azul-intenso)'),
  naranja: colorTiza('var(--color-arbol-naranja-intenso)'),
  morada: colorTiza('var(--color-arbol-morado-intenso)'),
} as const

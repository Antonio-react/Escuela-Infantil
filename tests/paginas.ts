import type { Page } from '@playwright/test'
import { paginas } from '../src/data/paginas'

// Las páginas que se prueban (todas las de paginas.ts) y una ruta que no existe (la 404).
export const rutas = [
  ...Object.values(paginas)
    .filter((p) => p.ruta !== '*')
    .map((p) => ({ nombre: p.nombre, ruta: p.ruta })),
  { nombre: 'Página no encontrada', ruta: '/esta-pagina-no-existe' },
]

// Tamaños de pantalla (sección 11 de CLAUDE.md): de móvil pequeño a monitor grande, pasando por portátiles bajos.
export const pantallas = [
  { nombre: 'móvil pequeño', width: 320, height: 568 },
  { nombre: 'iPhone Pro Max', width: 440, height: 956 },
  { nombre: 'tablet', width: 768, height: 1024 },
  { nombre: 'tablet horizontal', width: 1024, height: 768 },
  { nombre: 'portátil bajo', width: 1280, height: 620 },
  { nombre: 'monitor', width: 1920, height: 1080 },
] as const

// Baja hasta el final poco a poco: así se activa todo lo que aparece "al verse" (reseñas, puzzle, cubos...).
export async function recorrerHastaAbajo(page: Page) {
  await page.evaluate(async () => {
    const paso = Math.round(window.innerHeight * 0.6)
    for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await new Promise((r) => setTimeout(r, 400))
  })
}

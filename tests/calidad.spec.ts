import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { paginas } from '../src/data/paginas'
import { rutas } from './paginas'

// Lo de la sección 11 de CLAUDE.md que axe no comprueba solo: saltar al contenido, foco visible, rutas al refrescar,
// empezar arriba, metadatos y enlaces externos.

const paginasReales = Object.values(paginas).filter((p) => p.ruta !== '*')

test.describe('Saltar al contenido', () => {
  test('es lo primero al pulsar Tab, se ve y lleva el foco al contenido', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const saltar = page.locator('a[href="#contenido"]')
    await expect(saltar).toBeFocused()
    await expect(saltar).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page.locator('#contenido')).toBeFocused()
  })
})

test.describe('Foco visible', () => {
  // Recorre con Tab los primeros 40 elementos de cada página: cada uno, con un contorno (outline) o una sombra de foco.
  for (const { nombre, ruta } of paginasReales) {
    test(`${nombre}: todo lo que coge el foco lo enseña`, async ({ page }) => {
      await page.goto(ruta)
      const sinFoco: string[] = []
      for (let i = 0; i < 40; i++) {
        await page.keyboard.press('Tab')
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null
          if (!el || el === document.body) return null
          const s = getComputedStyle(el)
          const contorno = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
          const sombra = s.boxShadow !== 'none'
          return { visible: contorno || sombra, que: `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 40)}"` }
        })
        if (!info) break
        if (!info.visible) sinFoco.push(info.que)
      }
      expect(sinFoco, 'elementos sin foco visible').toEqual([])
    })
  }
})

test.describe('Rutas al refrescar o abrir directamente', () => {
  test('Netlify sirve index.html en cualquier ruta (public/_redirects)', () => {
    expect(readFileSync('public/_redirects', 'utf8')).toMatch(/^\/\*\s+\/index\.html\s+200/m)
  })
  for (const { nombre, ruta } of rutas) {
    test(`${nombre}: se abre directamente y se puede refrescar`, async ({ page }) => {
      const errores: string[] = []
      page.on('pageerror', (e) => errores.push(e.message))
      await page.goto(ruta)
      await expect(page.locator('h1')).toBeVisible()
      await page.reload()
      await expect(page.locator('h1')).toBeVisible()
      expect(errores).toEqual([])
    })
  }
})

test.describe('Empezar arriba al navegar', () => {
  test('desde abajo de Inicio, ir a cada página deja el scroll arriba', async ({ page, isMobile }) => {
    test.skip(isMobile)
    for (const destino of paginasReales.filter((p) => p.enMenu && p.ruta !== '/')) {
      await page.goto('/')
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      // Navegación de la propia web (sin recargar), como al pulsar un enlace.
      await page.locator(`footer a[href="${destino.ruta}"]`).first().click()
      await expect(page).toHaveURL(destino.ruta)
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
    }
  })
})

test.describe('Metadatos', () => {
  for (const p of paginasReales) {
    test(`${p.nombre}: título, descripción y lang`, async ({ page }) => {
      await page.goto(p.ruta)
      await expect(page).toHaveTitle(p.titulo)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', p.descripcion)
      await expect(page.locator('html')).toHaveAttribute('lang', 'es')
      await expect(page.locator('h1')).toHaveCount(1)
    })
  }
  test('favicon e imagen para compartir existen', async ({ request, page }) => {
    await page.goto('/')
    for (const sel of ['link[rel="icon"]', 'link[rel="apple-touch-icon"]', 'meta[property="og:image"]']) {
      const url = (await page.locator(sel).first().getAttribute(sel.startsWith('meta') ? 'content' : 'href')) ?? ''
      // Solo la ruta, pedida a la web que se prueba: og:image es una dirección absoluta (con el dominio) y, si el
      // dominio aún no está conectado, saldría a internet y fallaría aunque el archivo exista.
      const ruta = new URL(url, 'http://localhost').pathname
      expect((await request.get(ruta)).ok(), `${sel} → ${url}`).toBe(true)
    }
  })
})

test.describe('Enlaces externos', () => {
  for (const { nombre, ruta } of paginasReales) {
    test(`${nombre}: se abren en otra pestaña con rel="noopener noreferrer"`, async ({ page }) => {
      await page.goto(ruta)
      const malos = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')]
          .filter((a) => new URL(a.href).host !== location.host)
          .filter((a) => a.target !== '_blank' || !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel))
          .map((a) => a.href),
      )
      expect(malos).toEqual([])
    })
  }
})

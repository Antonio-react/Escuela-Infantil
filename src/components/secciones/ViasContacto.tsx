import type { ComponentType, SVGProps } from 'react'
import { site } from '../../data/site'
import { enlaceTel, enlaceWhatsApp, formatoPantalla, telefonoWhatsApp } from '../../data/telefonos'
import { textos } from '../../data/textos'
import { IconoEmail, IconoTelefono, IconoWhatsApp } from '../Iconos'
import { Seccion } from '../Seccion'
import { SocialLinks } from '../SocialLinks'

// "Otras formas de hablar con nosotras": tipografía grande, sin tarjetas (Antonio: nada de cajas genéricas). Cada
// vía es una línea entera que se pulsa: icono, etiqueta pequeña, el número o el email en grande y una flecha.
// Separadas por rayas de puntos. Al pasar el ratón, el valor se subraya "dibujándose" (una raya que crece desde la
// izquierda: scale en X) y la flecha avanza. Debajo, las redes (SocialLinks, el mismo de todo el sitio).
// Sin aria-label: el lector de pantalla lee lo que se ve ("Email e.i…", "Teléfono 666…"). Con un aria-label distinto,
// quien maneja el móvil con la voz y dice lo que lee no podía pulsarlo (axe: label-content-name-mismatch, WCAG 2.5.3).

const t = textos.secciones.vias

type Via = {
  clave: string
  Icono: ComponentType<SVGProps<SVGSVGElement>>
  color: string
  etiqueta: string
  valor: string
  href: string
  externo?: boolean
}

// Orden (Antonio): email, los teléfonos que no son el de WhatsApp y WhatsApp el último, porque es por donde las
// dueñas prefieren que menos les escriban.
// Todo sale de site.ts: si cambia un número, cambia aquí solo.
const vias: readonly Via[] = [
  {
    clave: 'email',
    Icono: IconoEmail,
    color: 'text-coral',
    etiqueta: t.email,
    valor: site.email,
    href: `mailto:${site.email}`,
  },
  ...site.telefonos
    .filter((telefono) => !('whatsapp' in telefono))
    .map((telefono) => ({
      clave: telefono.numero,
      Icono: IconoTelefono,
      color: 'text-arbol-azul-texto',
      etiqueta: t.telefono,
      valor: formatoPantalla(telefono.numero),
      href: enlaceTel(telefono.numero),
    })),
  {
    clave: 'whatsapp',
    Icono: IconoWhatsApp,
    color: 'text-verde',
    etiqueta: t.whatsapp,
    valor: formatoPantalla(telefonoWhatsApp.numero),
    href: enlaceWhatsApp(telefonoWhatsApp.numero),
    externo: true,
  },
]

export function ViasContacto() {
  return (
    <Seccion titulo={t.titulo} resalte={{ forma: 'subrayado', color: 'coral' }} colorTitulo="text-verde">
      <ul className="border-y-2 border-dotted border-tinta/15">
        {vias.map(({ clave, Icono, color, etiqueta, valor, href, externo }) => (
          <li key={clave} className="border-b-2 border-dotted border-tinta/15 last:border-b-0">
            <a
              href={href}
              {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center gap-4 py-5 sm:gap-6 sm:py-6"
            >
              <Icono className={`size-8 shrink-0 sm:size-10 ${color}`} />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold text-tinta/70 sm:text-base">{etiqueta}</span>
                {/* El subrayado que se dibuja: un ::after a lo ancho del texto, a escala 0 en X, que crece al pasar
                    el ratón (solo transform). El email, con la letra algo más pequeña en móvil: es largo y se partía a
                    trozos ("…gmail.co / m"); wrap-anywhere solo lo parte si aun así no cabe. */}
                <span className={`relative self-start font-titulo leading-tight font-semibold wrap-anywhere ${clave === 'email' ? 'text-[clamp(0.9rem,4.6vw,2.75rem)]' : 'text-[clamp(1.5rem,5vw,2.75rem)]'} after:absolute after:inset-x-0 after:-bottom-1 after:h-0.75 after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 after:ease-salida group-hover:after:scale-x-100`}>
                  {/* Si el email no cabe (móviles muy estrechos), se parte por la arroba (<wbr>: "aquí se puede partir"). */}
                  {clave === 'email' ? (
                    <>
                      {valor.split('@')[0]}@<wbr />
                      {valor.split('@')[1]}
                    </>
                  ) : (
                    valor
                  )}
                </span>
              </span>
              <span aria-hidden="true" className={`font-titulo text-3xl transition-transform duration-300 ease-salida group-hover:translate-x-1.5 sm:text-4xl ${color}`}>
                →
              </span>
              {/* Solo para el lector de pantalla: que el WhatsApp se abre fuera. */}
              {externo && <span className="sr-only">{t.nuevaPestana}</span>}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-lg text-tinta/75">{t.redes}</p>
        <SocialLinks />
      </div>
    </Seccion>
  )
}

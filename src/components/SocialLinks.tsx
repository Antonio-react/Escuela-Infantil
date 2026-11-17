import { site } from '../data/site'
import { textos } from '../data/textos'
import { IconoFacebook, IconoInstagram } from './Iconos'

type SocialLinksProps = {
  // "pequeno" para el hero (discreto, sin competir con "Solicitar visita"); "normal" para contacto y footer;
  // "pizarra": como el pequeño, pero en blanco tiza para el menú de móvil.
  tamano?: 'pequeno' | 'normal' | 'pizarra'
  className?: string
}

// En el tamaño "normal" (footer y contacto) cada icono va siempre con los colores REALES de su red,
// sin círculo (en móvil no hay hover, así se ve igual en todas partes): Instagram con su degradado y
// Facebook con su azul (3,6:1 sobre el verde del footer). En el pequeño, el color del texto.
// icono(clase, colorReal): cada red pinta su icono a su manera (solo Instagram tiene degradado).
const redes = [
  {
    href: site.redes.instagram,
    etiqueta: textos.redes.instagram,
    icono: (clase: string, colorReal: boolean) => <IconoInstagram className={clase} colorReal={colorReal} />,
    colorNormal: '',
  },
  {
    href: site.redes.facebook,
    etiqueta: textos.redes.facebook,
    icono: (clase: string) => <IconoFacebook className={clase} />,
    colorNormal: 'text-facebook',
  },
] as const

// Solo iconos con enlace al perfil: sin widgets ni scripts de Meta (rendimiento, cookies y fotos de niños).
export function SocialLinks({ tamano = 'normal', className = '' }: SocialLinksProps) {
  const pequeno = tamano !== 'normal'
  const colorPequeno = tamano === 'pizarra' ? 'text-tiza' : 'text-tinta/70 hover:bg-white hover:text-ciruela'
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {redes.map(({ href, etiqueta, icono, colorNormal }) => (
        <li key={href}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={etiqueta}
            // 44px como mínimo (WCAG 2.5.5): el icono puede ser pequeño, la zona de toque no.
            className={`grid size-11 place-items-center rounded-full ${pequeno ? 'lg:size-12' : ''} ${tamano === 'pizarra' ? 'sm:size-14' : ''} transition-[background-color,color,transform] duration-200 ease-salida active:scale-95 ${
              // Normal: sin círculo, el icono en su color; con ratón, sube un poco al pasar por encima.
              pequeno ? colorPequeno : `${colorNormal} hover:-translate-y-0.5`
            }`}
          >
            {/* En el hero (pequeño) crecen algo en escritorio, donde sobra sitio. */}
            {icono(tamano === 'pizarra' ? 'size-7 sm:size-9' : pequeno ? 'size-5 lg:size-6.5' : 'size-7', !pequeno)}
          </a>
        </li>
      ))}
    </ul>
  )
}

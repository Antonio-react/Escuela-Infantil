// Textos reales recortados con "…" y "[…]" a propósito: no retocarlos ni reescribirlos.
// permiso es un candado: el componente solo muestra los que tienen permiso: true.
// textoMovil (opcional): el mismo texto, cortado antes, solo para móvil (por debajo de 640 px). Las dueñas,
// 2026-11-19: en Inicio, en el móvil, las reseñas enteras se veían muy largas. Lo eligieron ellas.
type Testimonio = {
  texto: string
  textoMovil?: string
  autor: string
  permiso: boolean
}

export const testimonios: readonly Testimonio[] = [
  {
    texto: 'Desde el primer día nos dieron una confianza y una tranquilidad que desde luego para nosotros vale oro. Mi hija sale de la escuela tirando besos a las profes así que con eso lo digo todo.',
    textoMovil: 'Desde el primer día nos dieron una confianza y una tranquilidad que desde luego para nosotros vale oro…',
    autor: 'Familia del aula de 1-2 años',
    permiso: true,
  },
  {
    texto: '…al poco tiempo supe que fue un acierto aunque al principio me diera mucha pena dejarle. Tuvieron mucha paciencia en la adaptación, y al poco ya entraba y salía tan feliz…',
    autor: 'Una familia de la escuela',
    permiso: true,
  },
  {
    texto: '…hay un trato súper cercano, mucha confianza y comunicación para cualquier asunto y los niños están encantados con sus educador@s. Las instalaciones muy cuidadas, muchas actividades, comida casera…',
    textoMovil: '…hay un trato súper cercano, mucha confianza y comunicación para cualquier asunto y los niños están encantados con sus educador@s…',
    autor: 'Familia que terminó su etapa en la escuela',
    permiso: true,
  },
  {
    texto: 'Nuestra peque va cada día con una sonrisa y cuando la recogemos sigue igual de contenta, lo que nos da mucha tranquilidad. Se nota el cariño y la profesionalidad del equipo.',
    textoMovil: 'Nuestra peque va cada día con una sonrisa y cuando la recogemos sigue igual de contenta…',
    autor: 'Una familia de la escuela',
    permiso: true,
  },
  {
    texto: 'Estamos súper contentos con el cuidado que recibe nuestra hija. […] La organización es muy buena y las actividades muy diversas.',
    autor: 'Una familia de la escuela',
    permiso: true,
  },
]

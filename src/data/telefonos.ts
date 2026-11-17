import { site } from './site'

// Tipo de un elemento del array de teléfonos, sacado de los propios datos.
type Telefono = (typeof site.telefonos)[number]

// "639969095" -> "639 96 90 95" (formato habitual de móviles en España: 3-2-2-2).
export function formatoPantalla(numero: string): string {
  return numero.replace(/^(\d{3})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4')
}

// "639969095" -> "tel:+34639969095". Con el prefijo funciona también desde móviles extranjeros.
export function enlaceTel(numero: string): string {
  return `tel:+34${numero}`
}

// "639969095" -> "https://wa.me/34639969095". wa.me exige el prefijo sin "+" ni espacios.
export function enlaceWhatsApp(numero: string): string {
  return `https://wa.me/34${numero}`
}

// Guarda de tipo: si devuelve true, TypeScript sabe que el teléfono tiene whatsapp: true.
function esWhatsApp(telefono: Telefono): telefono is Extract<Telefono, { whatsapp: true }> {
  return 'whatsapp' in telefono && telefono.whatsapp
}

const encontrado = site.telefonos.find(esWhatsApp)

// Si alguien quita el whatsapp: true de site.ts, el error salta al arrancar, no en producción a escondidas.
if (!encontrado) {
  throw new Error('site.ts: ningún teléfono tiene whatsapp: true')
}

export const telefonoWhatsApp: Telefono = encontrado

// Para "Llamar": el primer teléfono que NO es el de WhatsApp (así las llamadas van a los otros números).
const paraLlamar = site.telefonos.find((telefono) => !esWhatsApp(telefono))

if (!paraLlamar) {
  throw new Error('site.ts: hace falta al menos un teléfono sin whatsapp: true para las llamadas')
}

export const telefonoLlamadas: Telefono = paraLlamar

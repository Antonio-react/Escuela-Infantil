// En el orden en que salen en la foto del equipo (fotoEquipo, fotos.ts), de izquierda a derecha.
// enLaFoto: dónde está cada una en la foto, en % del ancho desde la izquierda (el centro de su cuerpo en la parte de
// abajo de la foto, que es donde va su nombre debajo). Si cambia la foto, se vuelve a medir.
export const equipo = [
  { nombre: 'Lorena', cargo: 'Maestra y apoyo de aula', enLaFoto: 16 },
  { nombre: 'Olga', cargo: 'Directora y educadora infantil · Tutora de aula', enLaFoto: 38 },
  { nombre: 'Cristina', cargo: 'Directora y educadora infantil · Tutora de aula', enLaFoto: 59 },
  { nombre: 'Beatriz', cargo: 'Directora y educadora infantil · Tutora de aula', enLaFoto: 82 },
] as const

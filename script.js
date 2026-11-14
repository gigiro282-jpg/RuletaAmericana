// GIGIRO RULETA - BET y Modo Manual
const orden = ['0','28','9','26','30','11','7','20','32','17','5','22','34','15','3','24','36','13','1','00','27','10','25','29','12','8','19','31','18','6','21','33','16','4','23','35','14','2'];
const rojos = new Set(['1','3','5','7','9','12','14','16','18','19','21','23','25','27','30','32','34','36']);

// Una línea por resultado. Se usan las correcciones del usuario para 28 y 29.
const datosBET = `
00: 14,2,0,28,9,17,5,22,19,8,12,29,25,10,27,00,1,13
0: 14,2,0,28,9,7,20,32,17,5,22,34,36,13,1,00,27,10
1: 35,14,2,0,28,32,17,5,22,34,36,13,1,00,27,6,18,31
2: 14,2,0,28,9,7,20,32,17,5,22,34,36,13,1,00,27,10
3: 28,9,26,30,11,34,15,3,24,36,18,6,21,33,16,4,23,35
4: 28,9,26,30,11,3,24,36,13,1,00,6,21,33,16,4,23,35
5: 14,2,0,32,17,5,22,34,36,13,1,00,27,18,6,21,23,35
6: 0,28,9,26,30,11,17,5,22,33,21,6,18,31,00,1,13,36
7: 2,0,28,9,26,30,11,7,20,32,33,16,4,31,19,8,12,29
8: 9,26,30,11,7,20,3,24,36,13,1,00,27,29,12,8,19,31
9: 0,28,9,26,30,11,7,15,3,24,21,6,18,31,19,8,12,29
10: 0,28,9,26,30,11,4,16,33,21,6,29,25,10,27,00,1,13
11: 28,9,26,30,11,7,20,34,15,3,10,25,29,12,8,21,33,16
12: 26,30,11,7,20,34,15,3,24,36,25,29,12,8,19,6,21,33
13: 00,1,13,36,24,32,17,5,31,19,8,4,23,35,14,2,16,33
14: 00,1,13,36,24,20,32,17,5,22,34,28,9,35,23,14,2,0
15: 28,9,26,30,11,22,34,15,3,24,36,13,1,21,33,16,4,23
16: 21,33,16,4,23,20,32,17,5,22,34,15,3,24,27,10,25,29
17: 00,1,13,36,20,32,17,5,22,34,18,6,21,33,16,4,23,35
18: 0,28,9,26,32,17,5,24,36,13,1,00,27,19,31,18,6,21
19: 0,28,9,11,7,20,32,17,3,24,36,13,1,12,8,19,31,18
20: 0,28,11,7,20,32,17,5,22,34,12,8,19,31,18,35,14,2
21: 36,13,1,00,27,10,25,29,18,6,21,33,16,4,23,35,14,2
22: 0,28,7,20,32,17,5,22,34,15,18,6,21,33,16,35,14,2
23: 20,32,17,5,22,3,24,36,10,25,29,12,16,4,23,35,14,2
24: 0,28,9,26,15,3,24,36,13,31,19,8,16,4,23,35,14,2
25: 9,26,30,22,34,15,00,27,10,25,29,12,21,33,16,4,23,35
26: 6,18,21,28,9,26,30,11,22,34,15,3,24,27,10,25,29,12
27: 0,28,9,26,24,36,13,1,00,27,10,25,19,31,18,6,21,2
28: 2,0,28,9,26,3,24,36,13,1,00,27,10,8,19,31,18,6
29: 28,9,26,30,11,7,20,34,15,3,10,25,29,12,8,21,33,16
30: 9,26,30,11,7,22,34,15,3,24,10,25,29,12,8,4,23,35
31: 8,19,31,18,6,2,0,28,9,26,20,32,17,3,24,36,13,1
32: 26,30,11,7,20,32,17,5,6,18,31,19,8,4,23,35,14,2
33: 2,14,35,23,4,16,33,21,6,12,29,25,10,27,15,34,22,5
34: 0,2,14,35,23,4,16,33,21,6,12,29,25,3,15,34,22,5
35: 26,9,28,0,2,14,35,23,4,16,33,21,6,1,13,36,24,3
36: 2,14,35,23,4,18,31,19,8,12,10,27,00,1,13,36,24,3
`;
const combinacionesBET = Object.fromEntries(datosBET.trim().split('\n').map(linea => {
  const [resultado, lista] = linea.split(':');
  return [resultado.trim(), lista.split(',').map(n => n.trim())];
}));

const ruleta = document.getElementById('ruleta');
const botonBET = document.getElementById('modoBET');
const botonManual = document.getElementById('modoManual');
const botonLimpiar = document.getElementById('limpiar');
const mensaje = document.getElementById('mensaje');
let modoBET = false;
let modoManual = false;

function restaurarColores() {
  document.querySelectorAll('.num').forEach(casilla => casilla.classList.remove('off'));
}
function resaltarNumeros(numeros) {
  restaurarColores();
  const conjunto = new Set(numeros);
  document.querySelectorAll('.num').forEach(casilla => {
    if (conjunto.has(casilla.dataset.numero)) casilla.classList.add('off');
  });
}
function actualizarBotones() {
  botonBET.setAttribute('aria-pressed', String(modoBET));
  botonBET.classList.toggle('seleccionado', modoBET);
  botonBET.textContent = modoBET ? '🎯 BET ACTIVADO' : '🎯 BET';
  botonManual.setAttribute('aria-pressed', String(modoManual));
  botonManual.classList.toggle('seleccionado', modoManual);
  botonManual.textContent = modoManual ? '✋ Modo Manual ACTIVADO' : '✋ Modo Manual';
}
function activarBET(resultado) {
  const numeros = combinacionesBET[resultado];
  resaltarNumeros(numeros);
  mensaje.textContent = `BET para el resultado ${resultado}: ${numeros.length} números resaltados.`;
}
function limpiarTodo() {
  restaurarColores();
  modoBET = false;
  modoManual = false;
  actualizarBotones();
  mensaje.textContent = 'Selecciona BET o Modo Manual para comenzar.';
}

const centro = 450;
const radio = 390;
orden.forEach((numero, indice) => {
  const casilla = document.createElement('div');
  casilla.className = 'num';
  casilla.textContent = numero;
  casilla.dataset.numero = numero;
  casilla.style.background = (numero === '0' || numero === '00') ? 'green' : (rojos.has(numero) ? '#c40000' : 'black');
  const angulo = indice / orden.length * 2 * Math.PI - Math.PI / 2;
  casilla.style.left = `${centro + Math.cos(angulo) * radio - 29}px`;
  casilla.style.top = `${centro + Math.sin(angulo) * radio - 29}px`;
  casilla.addEventListener('click', () => {
    if (modoBET) activarBET(numero);
    else if (modoManual) casilla.classList.toggle('off');
  });
  ruleta.appendChild(casilla);
});

botonBET.addEventListener('click', () => {
  modoBET = !modoBET;
  if (modoBET) {
    modoManual = false;
    restaurarColores();
    mensaje.textContent = 'BET activado: toca el resultado que acaba de salir para resaltar su combinación de 18 números.';
  } else mensaje.textContent = 'BET desactivado.';
  actualizarBotones();
});
botonManual.addEventListener('click', () => {
  modoManual = !modoManual;
  if (modoManual) {
    modoBET = false;
    restaurarColores();
    mensaje.textContent = 'Modo Manual activado: toca los números para resaltarlos o quitarles el resaltado individualmente.';
  } else mensaje.textContent = 'Modo Manual desactivado.';
  actualizarBotones();
});
botonLimpiar.addEventListener('click', limpiarTodo);

function validarBET() {
  if (orden.length !== 38 || new Set(orden).size !== 38 || Object.keys(combinacionesBET).length !== 38) {
    throw new Error('La ruleta y la tabla BET deben contener los 38 resultados.');
  }
  for (const resultado of orden) {
    const numeros = combinacionesBET[resultado];
    if (!numeros || numeros.length !== 18 || new Set(numeros).size !== 18 || numeros.some(n => !orden.includes(n))) {
      throw new Error(`La combinación BET del resultado ${resultado} no contiene 18 números únicos válidos.`);
    }
  }
}
actualizarBotones();
validarBET();

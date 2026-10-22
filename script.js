// GIGIRO RULETA - Calculadora por dos resultados
// Orden físico del cilindro americano en sentido de las manecillas del reloj.
const orden = [
  '0','28','9','26','30','11','7','20','32','17','5','22','34','15','3','24','36','13','1','00',
  '27','10','25','29','12','8','19','31','18','6','21','33','16','4','23','35','14','2'
];

const rojos = new Set([
  '1','3','5','7','9','12','14','16','18','19','21','23','25','27','30','32','34','36'
]);

const ruleta = document.getElementById('ruleta');
const campoAnterior = document.getElementById('resultadoAnterior');
const campoUltimo = document.getElementById('ultimoResultado');
const botonProcesar = document.getElementById('procesar');
const botonManual = document.getElementById('modoManual');
const botonLimpiar = document.getElementById('limpiar');
const mensaje = document.getElementById('mensaje');
const resumen = document.getElementById('resumen');
const salidaDesplazamiento = document.getElementById('desplazamiento');
const salidaBase = document.getElementById('numeroBase');
const salidaExcluidos = document.getElementById('excluidos');

let modoManual = false;

function restaurarColores() {
  document.querySelectorAll('.num').forEach(casilla => {
    casilla.classList.remove('off', 'manual-activo');
    casilla.style.background = casilla.dataset.baseColor;
    casilla.style.color = '#fff';
    casilla.style.border = '';
  });
}

function resaltarNumeros(numeros) {
  restaurarColores();
  const conjunto = new Set(numeros);
  document.querySelectorAll('.num').forEach(casilla => {
    if (!conjunto.has(casilla.textContent)) return;
    casilla.classList.add('off');
  });
}

function normalizarNumero(valor) {
  const n = String(valor).trim();
  if (n === '00' || n === '0') return n;
  if (!/^(?:[1-9]|[12][0-9]|3[0-6])$/.test(n)) return null;
  return n;
}

// Cuenta los pasos desde el resultado anterior hasta el último en sentido
// contrario a las manecillas del reloj. La casilla inicial es posición cero.
function calcularJugada(anterior, ultimo) {
  const total = orden.length;
  const indiceAnterior = orden.indexOf(anterior);
  const indiceUltimo = orden.indexOf(ultimo);

  // En el arreglo, el sentido antihorario retrocede índices.
  const desplazamiento = (indiceAnterior - indiceUltimo + total) % total;

  // Repetimos ese mismo desplazamiento desde el último resultado.
  const indiceBase = (indiceUltimo - desplazamiento + total * 2) % total;
  const base = orden[indiceBase];

  const excluidos = [];
  // Seis puertas antihorarias desde la base (la base no cuenta como puerta).
  for (let paso = 1; paso <= 6; paso++) {
    excluidos.push(orden[(indiceBase - paso + total) % total]);
  }
  // El número base.
  excluidos.push(base);
  // Cinco puertas horarias desde la base.
  for (let paso = 1; paso <= 5; paso++) {
    excluidos.push(orden[(indiceBase + paso) % total]);
  }

  const excluidosUnicos = new Set(excluidos);
  const resaltados = orden.filter(numero => !excluidosUnicos.has(numero));

  return { desplazamiento, base, excluidos, resaltados };
}

function procesar() {
  const anterior = normalizarNumero(campoAnterior.value);
  const ultimo = normalizarNumero(campoUltimo.value);

  if (anterior === null || ultimo === null) {
    mensaje.textContent = 'Número no válido. Ingresa 0, 00 o un número del 1 al 36 en ambos campos.';
    resumen.hidden = true;
    return;
  }

  modoManual = false;
  actualizarBotonManual();
  const resultado = calcularJugada(anterior, ultimo);
  resaltarNumeros(resultado.resaltados);

  salidaDesplazamiento.textContent = resultado.desplazamiento;
  salidaBase.textContent = resultado.base;
  salidaExcluidos.textContent = resultado.excluidos.join(' · ');
  resumen.hidden = false;
  mensaje.textContent = 'Cálculo realizado. Se resaltaron los 26 números que no están excluidos.';
}

function actualizarBotonManual() {
  botonManual.setAttribute('aria-pressed', String(modoManual));
  botonManual.classList.toggle('seleccionado', modoManual);
  botonManual.textContent = modoManual ? '✋ Modo Manual ACTIVADO' : '✋ Modo Manual';
}

function limpiarTodo() {
  restaurarColores();
  campoAnterior.value = '';
  campoUltimo.value = '';
  resumen.hidden = true;
  mensaje.textContent = 'Ingresa los dos resultados y pulsa PROCESAR o Enter.';
  modoManual = false;
  actualizarBotonManual();
}

const centro = 450;
const radio = 390;
orden.forEach((numero, indice) => {
  const casilla = document.createElement('div');
  casilla.className = 'num';
  casilla.textContent = numero;
  casilla.dataset.numero = numero;
  casilla.style.background = (numero === '0' || numero === '00')
    ? 'green'
    : (rojos.has(numero) ? '#c40000' : 'black');
  casilla.dataset.baseColor = casilla.style.background;

  const angulo = indice / orden.length * 2 * Math.PI - Math.PI / 2;
  casilla.style.left = `${centro + Math.cos(angulo) * radio - 29}px`;
  casilla.style.top = `${centro + Math.sin(angulo) * radio - 29}px`;

  casilla.addEventListener('click', () => {
    if (!modoManual) return;
    casilla.classList.toggle('off');
  });

  ruleta.appendChild(casilla);
});

botonProcesar.addEventListener('click', procesar);
[campoAnterior, campoUltimo].forEach(campo => {
  campo.addEventListener('keydown', evento => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      procesar();
    }
  });
});

botonManual.addEventListener('click', () => {
  modoManual = !modoManual;
  actualizarBotonManual();
  mensaje.textContent = modoManual
    ? 'Modo Manual activado: toca los números de la ruleta para resaltarlos o quitarles el resaltado.'
    : 'Modo Manual desactivado.';
});

botonLimpiar.addEventListener('click', limpiarTodo);

// Estado inicial.
actualizarBotonManual();

// Comprobaciones del algoritmo (no modifican la interfaz).
function validarAlgoritmo() {
  if (orden.length !== 38 || new Set(orden).size !== 38) {
    throw new Error('El orden del cilindro debe contener 38 números únicos.');
  }
  for (const anterior of orden) {
    for (const ultimo of orden) {
      const r = calcularJugada(anterior, ultimo);
      if (r.excluidos.length !== 12 || new Set(r.excluidos).size !== 12 ||
          r.resaltados.length !== 26 || r.excluidos.length + r.resaltados.length !== 38) {
        throw new Error(`Error en la pareja ${anterior}-${ultimo}`);
      }
    }
  }
}
validarAlgoritmo();

// Confeti de stickers dibujados, lluvia de palabras, caja musical y detector de soplido (opcional).
import { STICKERS } from "./arte.js";

const PIEZAS = [
  () => STICKERS.corazon("#ff5c8a"), () => STICKERS.corazon("#d81e4a"), () => STICKERS.estrella(),
  () => STICKERS.caramelo("#9b7bff"), () => STICKERS.caramelo("#2fc79b"), () => STICKERS.flor("#ff8fb1"),
  () => STICKERS.flor("#ffd23f"), () => STICKERS.cupcake(),
];
const al = (min, max) => min + Math.random() * (max - min);

export function confeti(contenedor, cantidad = 40) {
  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement("span");
    p.className = "pieza sticker";
    p.innerHTML = PIEZAS[i % PIEZAS.length]();
    p.style.left = `${al(-4, 96)}%`;
    p.style.width = `${al(22, 40)}px`;
    p.style.setProperty("--dur", `${al(2.4, 4.6)}s`);
    p.style.setProperty("--retraso", `${al(0, 0.9)}s`);
    p.style.setProperty("--giro", `${al(-540, 540)}deg`);
    p.style.setProperty("--deriva", `${al(-60, 60)}px`);
    contenedor.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

// "¡Que llueva!": la palabra cae como lluvia de letras pegadas.
const COLORES = ["#ff5c8a", "#ffd23f", "#2fc79b", "#9b7bff", "#4cb8ff", "#f4893b", "#fff"];
export function llover(contenedor, palabra, cantidad = 26) {
  for (let i = 0; i < cantidad; i++) {
    const g = document.createElement("span");
    g.className = "gota-palabra";
    g.textContent = palabra;
    g.style.left = `${al(-10, 90)}%`;
    g.style.setProperty("--tam", `${al(1, 2.3).toFixed(2)}rem`);
    g.style.setProperty("--color", COLORES[i % COLORES.length]);
    g.style.setProperty("--dur", `${al(2.6, 4.4)}s`);
    g.style.setProperty("--retraso", `${al(0, 1.6)}s`);
    g.style.setProperty("--giro", `${al(-40, 40)}deg`);
    g.style.setProperty("--deriva", `${al(-30, 30)}px`);
    contenedor.appendChild(g);
    g.addEventListener("animationend", () => g.remove());
  }
}

// Corazoncitos que salen de un punto (al tocar personajes y stickers).
export function corazones(contenedor, x, y, cantidad = 6) {
  for (let i = 0; i < cantidad; i++) {
    const c = document.createElement("span");
    c.className = "corazoncito sticker";
    c.innerHTML = STICKERS.corazon(i % 2 ? "#ff5c8a" : "#ffd23f");
    c.style.left = `${x - 13}px`;
    c.style.top = `${y - 13}px`;
    c.style.setProperty("--dx", `${al(-60, 60)}px`);
    c.style.animationDelay = `${i * 60}ms`;
    contenedor.appendChild(c);
    c.addEventListener("animationend", () => c.remove());
  }
}

// Canción de cuna original (compuesta para el álbum) con WebAudio: colchón suave, cajita musical
// arpegiada, bajo tenue y una melodía tranquila. 16 compases en Do mayor a 66 bpm (~58 s) en bucle.
const BPM = 66;
const PULSO = 60 / BPM;
const ACORDES = { C: [48, 60, 64, 67], G: [43, 59, 62, 67], Am: [45, 60, 64, 69], F: [41, 57, 60, 65] };
const PROGRESION = ["C", "G", "Am", "F", "C", "G", "F", "C", "Am", "F", "C", "G", "F", "G", "C", "C"];
// [pulso dentro del compás, nota MIDI, duración en pulsos]
const MELODIA = [
  [[0, 76, 2], [2, 74, 1], [3, 72, 1]], [[0, 74, 3], [3, 71, 1]], [[0, 72, 2], [2, 76, 2]], [[0, 77, 3], [3, 76, 1]],
  [[0, 76, 1.5], [1.5, 79, 0.5], [2, 76, 2]], [[0, 74, 2], [2, 71, 2]], [[0, 72, 1], [1, 74, 1], [2, 77, 2]], [[0, 76, 4]],
  [[0, 81, 2], [2, 79, 2]], [[0, 77, 2], [2, 76, 2]], [[0, 79, 1], [1, 76, 1], [2, 72, 2]], [[0, 74, 4]],
  [[0, 72, 1], [1, 74, 1], [2, 76, 2]], [[0, 79, 2], [2, 77, 1], [3, 74, 1]], [[0, 76, 2], [2, 74, 2]], [[0, 72, 4]],
];
const ARPEGIO = [0, 1, 2, 1, 3, 2, 1, 2];
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

export function cajaMusical() {
  let ctx = null;
  let salida = null;
  let temporizador = null;
  let sonando = false;

  function preparar() {
    if (ctx) return ctx.resume();
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    // volumen general → filtro cálido → altavoz, con un eco suave como "sala"
    salida = ctx.createGain();
    salida.gain.value = 0;
    const filtro = ctx.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = 2600;
    const eco = ctx.createDelay();
    eco.delayTime.value = PULSO * 0.75;
    const retorno = ctx.createGain();
    retorno.gain.value = 0.28;
    salida.connect(filtro).connect(ctx.destination);
    filtro.connect(eco).connect(retorno).connect(eco);
    retorno.connect(ctx.destination);
    return ctx.resume();
  }

  function voz(tipo, frecuencia, t, dur, volumen, ataque, caida) {
    const osc = ctx.createOscillator();
    const gan = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = frecuencia;
    gan.gain.setValueAtTime(0, t);
    gan.gain.linearRampToValueAtTime(volumen, t + ataque);
    gan.gain.setTargetAtTime(0, t + Math.max(ataque, dur - caida), caida / 3);
    osc.connect(gan).connect(salida);
    osc.start(t);
    osc.stop(t + dur + caida + 0.2);
  }

  function tocarVuelta(inicio) {
    const compas = PULSO * 4;
    PROGRESION.forEach((nombre, n) => {
      const t = inicio + n * compas;
      const [bajo, ...triada] = ACORDES[nombre];
      voz("sine", hz(bajo), t, compas, 0.07, 0.08, 1.2);
      for (const nota of triada) {
        voz("sine", hz(nota), t, compas, 0.022, 1.1, 1.4);
        voz("triangle", hz(nota) * 1.003, t, compas, 0.012, 1.3, 1.4);
      }
      const tonos = [triada[0] + 12, triada[1] + 12, triada[2] + 12, triada[0] + 24];
      ARPEGIO.forEach((k, i) => {
        const ti = t + i * (PULSO / 2);
        voz("sine", hz(tonos[k]), ti, 0.05, 0.03, 0.005, 1.1);
        voz("sine", hz(tonos[k]) * 4, ti, 0.02, 0.004, 0.003, 0.4);
      });
      for (const [pulso, nota, dur] of MELODIA[n]) {
        const tm = t + pulso * PULSO;
        voz("triangle", hz(nota), tm, dur * PULSO, 0.06, 0.03, 0.9);
        voz("sine", hz(nota) * 2, tm, dur * PULSO, 0.012, 0.03, 0.6);
      }
    });
    const fin = inicio + PROGRESION.length * compas;
    temporizador = setTimeout(() => tocarVuelta(fin), (fin - ctx.currentTime - 1.5) * 1000);
  }

  // Si ella sale de la pestaña o bloquea el celular, la música se pausa.
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !sonando) return;
    document.hidden ? ctx.suspend() : ctx.resume();
  });

  return {
    // Llamar dentro de un toque (iOS solo deja sonar audio creado en un gesto).
    preparar,
    tocar() {
      preparar();
      sonando = true;
      salida.gain.cancelScheduledValues(ctx.currentTime);
      salida.gain.setTargetAtTime(1, ctx.currentTime, 1.2);
      if (!temporizador) tocarVuelta(ctx.currentTime + 0.1);
    },
    parar() {
      if (!ctx) return;
      sonando = false;
      salida.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      setTimeout(() => {
        if (sonando) return;
        clearTimeout(temporizador);
        temporizador = null;
        ctx.suspend();
      }, 1500);
    },
  };
}

// Resuelve { detener } si pudo escuchar; null si no hay micrófono o permiso.
export async function escucharSoplido(onSoplo) {
  // El contexto se crea dentro del gesto (antes del await) para que iOS no lo deje suspendido.
  let ctx = null;
  let flujo = null;
  let activo = true;
  const detener = () => {
    activo = false;
    flujo?.getTracks().forEach((t) => t.stop());
    if (ctx && ctx.state !== "closed") ctx.close();
  };
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
    const analizador = ctx.createAnalyser();
    analizador.fftSize = 512;
    ctx.createMediaStreamSource(flujo).connect(analizador);
    const datos = new Uint8Array(analizador.fftSize);
    let seguidos = 0;
    const medir = () => {
      if (!activo) return;
      analizador.getByteTimeDomainData(datos);
      let suma = 0;
      for (const v of datos) suma += ((v - 128) / 128) ** 2;
      seguidos = Math.sqrt(suma / datos.length) > 0.18 ? seguidos + 1 : 0;
      if (seguidos > 6) {
        detener();
        onSoplo();
        return;
      }
      requestAnimationFrame(medir);
    };
    medir();
    return { detener };
  } catch {
    detener();
    return null;
  }
}

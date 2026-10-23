import { normalizar, descifrar } from "./cripto.js";
import { faltante } from "./reloj.js";
import { pochita, chibiMileni, flor, torta, STICKERS, ICONOS } from "./arte.js";
import { confeti, llover, corazones, cajaMusical, escucharSoplido } from "./efectos.js";
import { conectar, prepararFoto } from "./recuerdos.js";

const $ = (sel) => document.querySelector(sel);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const efectos = () => $("#capa-efectos");
const musica = cajaMusical();
let secreto = null;
let paginas = [];
let actual = -1;
let baul = null; // conexión a los recuerdos

// Vista previa en la PC de Jordy (http://localhost): sin cuenta regresiva y los recuerdos quedan solo en memoria,
// para no ensuciar el álbum real de ella. En GitHub Pages nunca se activa.
const DEMO = location.hostname === "localhost"; // las pruebas usan 127.0.0.1 y siguen el flujo real
const baulDeMentira = () => {
  let id = 0;
  return { listar: async () => [], guardar: async (r) => ({ id: ++id, creado: new Date().toISOString(), ...r }) };
};

const escapar = (t) => String(t).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// ---------- Piezas reutilizables ----------
const personaje = (tipo, extra = "") =>
  `<div class="personaje personaje-${tipo} ${extra}" data-p="${tipo}" role="button" aria-label="${tipo === "pochi" ? "Pochita" : "Mileni"}">${
    tipo === "pochi" ? pochita() : chibiMileni()
  }</div>`;

const quellueva = (palabra, visible = palabra) =>
  `<span class="palabra">${visible}</span><button class="llueve" data-palabra="${escapar(palabra)}">${STICKERS.nube()}¡Que llueva!</button>`;

const deco = (svg, clase) => `<span class="deco sticker ${clase}" role="button" aria-label="Sticker">${svg}</span>`;
const DECOS = [
  () => STICKERS.corazon(), () => STICKERS.estrella(), () => STICKERS.flor(), () => STICKERS.caramelo(),
  () => STICKERS.cupcake(), () => STICKERS.flor("#ffd23f"), () => STICKERS.corazon("#d81e4a"), () => STICKERS.shuriken(),
];

function polaroid(foto, i) {
  return `
  <figure class="polaroid" data-foto="${i}">
    <div class="marco">
      <img src="${foto.src}" alt="${escapar(foto.titulo)}" loading="lazy">
      <span class="esq e1"></span><span class="esq e2"></span><span class="esq e3"></span><span class="esq e4"></span>
    </div>
    <figcaption><b>${escapar(foto.titulo)}</b><span>${escapar(foto.texto)}</span></figcaption>
    ${deco(DECOS[i % DECOS.length](), "d-a")}
    ${i % 2 ? deco(DECOS[(i + 3) % DECOS.length](), "d-b") : ""}
  </figure>`;
}

// ---------- Páginas del álbum ----------
const PALABRAS_FOTOS = [["Hermosa"], ["Preciosa"], ["Bonita"], ["Mi Molly", "Molly"]];
const COLORES_FOTOS = ["f-naranja", "f-menta", "f-cielo", "f-cereza"];

function construirPaginas() {
  const lista = [];

  lista.push({ id: "portada", color: "f-chicle", html: `
    <div class="portada">
      ${deco(STICKERS.estrella(), "")}
      <p class="edicion">edición 23 · 1 de 1</p>
      <h1>El álbum<br>de <span>${quellueva("Molly")}</span></h1>
      <div class="portada-personajes">${personaje("pochi", "personaje-pochi")}${personaje("chibi", "personaje-chibi")}</div>
      <p class="bajada">Tócalos, despega los stickers,<br>y pasa las páginas como en un álbum de verdad.</p>
      <p class="pista-swipe">desliza o toca la flecha →</p>
    </div>` });

  lista.push({ id: "molly", color: "f-lila", html: `
    <h2 class="titulo-pag">Donde todo empezó</h2>
    <p class="bajada">Entre miles de jugadores de Naruto Online, me salió la carta más rara de todas.</p>
    <div class="carta-molly" id="carta-molly" role="button" aria-label="Voltear la carta">
      <div class="carta-giro">
        <div class="carta-frente">
          <span class="carta-rango">ULTRA RARA · 1/1</span>
          ${personaje("chibi")}
          <span class="carta-nombre">Molly</span>
        </div>
        <div class="carta-reverso">
          <p>&gt; Conectando a Naruto Online...</p>
          <p class="dorado">&gt; ¡Jugadora encontrada!</p>
          <p class="rosa-t">&nbsp; Nombre: Molly</p>
          <p class="rosa-t">&nbsp; Rango: Kage de mi corazón</p>
          <p>&gt; Misión: hacerla sonreír</p>
          <p class="dorado">&nbsp; todos los días ★</p>
        </div>
      </div>
    </div>
    <p class="pista">toca la carta para voltearla</p>
    <p class="bajada">Mejor drop de mi vida: ${quellueva("Molly")}</p>` });

  const fotos = secreto.fotos;
  for (let i = 0, n = 0; i < fotos.length; i += 2, n++) {
    const [palabra, lluvia = palabra] = PALABRAS_FOTOS[n % PALABRAS_FOTOS.length];
    lista.push({ id: `fotos-${n}`, color: COLORES_FOTOS[n % COLORES_FOTOS.length], html: `
      <h2 class="titulo-pag">${quellueva(lluvia, palabra)}</h2>
      <div class="fotos">${fotos.slice(i, i + 2).map((f, k) => polaroid(f, i + k)).join("")}</div>` });
  }

  lista.push({ id: "encantos", color: "f-limon", html: `
    <h2 class="titulo-pag">Lo que me encanta de ti</h2>
    <p class="bajada">Toca cada sticker. Eres ${quellueva("única")}</p>
    <div class="encantos">
      ${[
        ["risa", "Tu humor", "Me haces reír hasta en mis peores días."],
        ["hielo", "Tu \"frialdad\"", "Te haces la fría... pero conmigo eres puro dulce."],
        ["fuerza", "Tu fuerza", "Me motivas a seguir cuando quiero rendirme."],
        ["sonrojo", "Tu sonrojo", "Lo provoco a propósito. No me arrepiento."],
      ].map(([icono, frente, dorso]) => `
        <button class="encanto"><span class="encanto-giro">
          <span class="encanto-frente">${ICONOS[icono]}${frente}</span>
          <span class="encanto-dorso">${dorso}</span>
        </span></button>`).join("")}
    </div>
    <div class="zona-sonrojo"><button class="boton" id="no-sonrojar">No me hagas sonrojar</button></div>` });

  lista.push({ id: "jardin", color: "f-menta", html: `
    <h2 class="titulo-pag">Tu jardín</h2>
    <p class="bajada">Tú, que cuidas el planeta: toca la tierra y mira lo que florece.</p>
    <div class="jardin" id="jardin" role="button" aria-label="Toca para sembrar flores">
      <div class="tierra"></div>
      <p class="jardin-pista" id="jardin-pista">toca aquí</p>
    </div>
    <div class="informe tarjeta-papel" id="informe">
      <p class="mano"><b>Informe ambiental</b></p>
      <ul>
        <li>Flores sembradas: <b id="n-flores">0</b></li>
        <li>Huella de carbono: <b>0</b></li>
        <li>Corazones reforestados: <b>1 (el mío)</b></li>
      </ul>
      <p class="sello">Ingeniera certificada en hacer florecer corazones</p>
    </div>` });

  lista.push({ id: "torta", color: "f-cielo", html: `
    <h2 class="titulo-pag">Dulce 23</h2>
    <p class="bajada" id="torta-texto">Cierra los ojos, pide un deseo y apaga las 23 velitas.</p>
    <div class="torta-caja" id="torta">${torta(23)}</div>
    <div class="acciones">
      <button class="boton" id="soplar">Soplar al micrófono</button>
      <button class="boton suave" id="apagar">Apagar con un toque</button>
    </div>
    <p class="feliz" id="feliz">${quellueva("¡Feliz cumple!", "¡Feliz cumpleaños,")}<br><span>Mileni!</span></p>` });

  lista.push({ id: "final", color: "f-cereza", html: `
    <h2 class="titulo-pag" id="titulo-final">${escapar(secreto.titulo)}</h2>
    <button class="sobre" id="sobre" aria-label="Abrir el sobre">
      <span class="sobre-cuerpo"></span><span class="sobre-solapa"></span>
      <span class="sobre-sello sticker">${STICKERS.sello()}</span>
      <span class="sobre-pista">toca el sello</span>
    </button>
    <div class="confesion" id="confesion"></div>
    <div class="cierre" id="cierre">
      <p class="firma">— ${escapar(secreto.firma)}</p>
      <p class="bajada">${quellueva("Te quiero")}</p>
      ${personaje("pochi")}
      <a class="boton" href="https://discord.com/app" target="_blank" rel="noopener">Respóndeme en Discord</a>
      <button class="boton suave" id="a-recuerdos">Seguir a nuestro álbum</button>
    </div>` });

  lista.push({ id: "recuerdos", color: "f-naranja", html: `
    <div class="recuerdos-cabeza">
      <h2 class="titulo-pag">Nuestro álbum</h2>
      <p class="bajada">Estas páginas quedan en blanco a propósito: son para todo lo que nos falta vivir.
        Pega aquí los recuerdos que quieras, sin límite. Yo también voy a pegar los míos. ${quellueva("Nosotros")}</p>
      <button class="boton" id="pegar-recuerdo">Pegar un recuerdo</button>
    </div>
    <div class="recuerdos" id="recuerdos"><p class="recuerdos-vacio">Cargando recuerdos...</p></div>` });

  return lista;
}

function montarAlbum() {
  paginas = construirPaginas();
  $("#libro").innerHTML = paginas.map((p, i) => `
    <article class="pagina ${p.color}" id="pag-${p.id}" data-i="${i}" aria-label="Página ${i + 1}">
      <div class="pagina-cara">${p.html}<span class="num-pag">${i + 1}</span></div>
      <div class="pagina-dorso"></div>
    </article>`).join("");
  prepararCarta();
  prepararSonrojo();
  prepararJardin();
  prepararTorta();
  prepararFinal();
  prepararRecuerdos();
}

// ---------- Pasar páginas ----------
function irA(indice) {
  if (indice < 0 || indice >= paginas.length || indice === actual) return;
  actual = indice;
  const total = paginas.length;
  document.querySelectorAll(".pagina").forEach((el, j) => {
    const pasada = j < indice;
    el.classList.toggle("oculta", j < indice - 1 || j > indice + 1);
    el.style.zIndex = pasada ? j : total - j;
    if (pasada === el.classList.contains("pasada")) return;
    girar(el, pasada);
  });
  $("#libro").classList.toggle("abierto", indice > 0);
  $("#contador").textContent = `${indice + 1} / ${total}`;
  $("#atras").disabled = indice === 0;
  $("#adelante").disabled = indice === total - 1;
  const id = paginas[indice].id;
  if (id === "molly") animarCarta();
  if (id === "recuerdos") cargarRecuerdos();
}

// Gira una hoja en 3D y, al terminar, la deja plana (reposada) para que la GPU no dibuje costuras.
function girar(el, pasar) {
  clearTimeout(el._giro);
  el.style.transition = "none";
  el.classList.remove("reposada");
  el.classList.add("girando");
  void el.offsetWidth;
  el.style.transition = "";
  el.classList.toggle("pasada", pasar);
  el._giro = setTimeout(() => {
    el.classList.remove("girando");
    el.classList.toggle("reposada", pasar);
  }, 1050);
}

function prepararNavegacion() {
  $("#atras").addEventListener("click", () => irA(actual - 1));
  $("#adelante").addEventListener("click", () => irA(actual + 1));
  $("#musica").addEventListener("click", () => {
    const sonando = $("#musica").classList.toggle("sonando");
    sonando ? musica.tocar() : musica.parar();
  });
  let x0 = null;
  let y0 = 0;
  const libro = $("#libro");
  libro.addEventListener("touchstart", (e) => {
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
  }, { passive: true });
  libro.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      irA(actual + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  document.addEventListener("keydown", (e) => {
    if ($("#album").classList.contains("activa") && $("#visor").hidden && !$("#dialogo-recuerdo").open) {
      if (e.key === "ArrowRight") irA(actual + 1);
      if (e.key === "ArrowLeft") irA(actual - 1);
    }
  });
}

function encenderMusica() {
  if ($("#musica").classList.contains("sonando")) return;
  musica.tocar();
  $("#musica").classList.add("sonando");
}

// ---------- Interacciones que valen en todo el álbum ----------
const FRASES = {
  pochi: ["¡Guau!", "¡Wan wan!", "¡Feliz cumple, Molly!", "*motosierra feliz*", "¡Yo te cuido!", "¡Otra vez!"],
  chibi: ["¡Ay, no!", "Me sonrojé...", "¡Jijiji!", "¿Yo, linda? Bueno, sí", "¡Ya basta, tonto!"],
};

function tocarPersonaje(el, e) {
  el.classList.remove("salta");
  void el.offsetWidth;
  el.classList.add("salta");
  el.querySelector(".burbuja")?.remove();
  const frases = FRASES[el.dataset.p];
  const b = Object.assign(document.createElement("span"), { className: "burbuja", textContent: frases[Math.floor(Math.random() * frases.length)] });
  el.appendChild(b);
  setTimeout(() => b.remove(), 1700);
  corazones(efectos(), e.clientX, e.clientY);
}

function prepararToques() {
  document.addEventListener("click", (e) => {
    const llueve = e.target.closest(".llueve");
    if (llueve) return llover(efectos(), llueve.dataset.palabra);

    const p = e.target.closest(".personaje");
    if (p) {
      e.stopPropagation();
      if (!p.closest(".carta-molly")) return tocarPersonaje(p, e);
    }

    const d = e.target.closest(".deco");
    if (d) {
      e.stopPropagation();
      d.classList.add("despegada");
      corazones(efectos(), e.clientX, e.clientY, 4);
      setTimeout(() => d.classList.remove("despegada"), 4500);
      return;
    }

    const encanto = e.target.closest(".encanto");
    if (encanto) return encanto.classList.toggle("volteado");

    const foto = e.target.closest(".polaroid");
    if (foto) {
      const f = secreto.fotos[Number(foto.dataset.foto)];
      return abrirVisor({ src: f.src, titulo: f.titulo, texto: f.texto, pie: "" });
    }

    const rec = e.target.closest(".recuerdo");
    if (rec) {
      const r = recuerdos.find((x) => String(x.id) === rec.dataset.id);
      if (r) abrirVisor({ src: r.foto, titulo: r.titulo, texto: r.texto, pie: pieRecuerdo(r) });
    }
  });
  $("#visor-cerrar").addEventListener("click", cerrarVisor);
  $("#visor").addEventListener("click", (e) => e.target === $("#visor") && cerrarVisor());
}

function abrirVisor({ src, titulo, texto, pie }) {
  const img = $("#visor-img");
  img.hidden = !src;
  if (src) img.src = src;
  img.alt = titulo;
  $("#visor-titulo").textContent = titulo;
  $("#visor-texto").textContent = texto || "";
  $("#visor-pie").textContent = pie || "";
  $("#visor").hidden = false;
}
function cerrarVisor() {
  $("#visor").hidden = true;
  $("#visor-img").removeAttribute("src");
}

// ---------- Carta holográfica ----------
let cartaAnimada = false;
function prepararCarta() {
  const carta = $("#carta-molly");
  carta.addEventListener("click", () => {
    carta.classList.toggle("volteada");
    confeti(efectos(), 14);
  });
  carta.addEventListener("pointermove", (e) => {
    const c = carta.getBoundingClientRect();
    carta.style.setProperty("--hx", `${((e.clientX - c.left) / c.width) * 100}%`);
    carta.style.setProperty("--hy", `${((e.clientY - c.top) / c.height) * 100}%`);
  });
}
function animarCarta() {
  if (cartaAnimada) return;
  cartaAnimada = true;
  const carta = $("#carta-molly");
  let a = 0;
  const girar = () => {
    if (paginas[actual]?.id === "molly") {
      a = (a + 0.6) % 360;
      carta.style.setProperty("--angulo", `${a}deg`);
    }
    requestAnimationFrame(girar);
  };
  girar();
}

// ---------- Sonrojo ----------
function prepararSonrojo() {
  const boton = $("#no-sonrojar");
  let escapes = 0;
  const huir = (e) => {
    e.preventDefault();
    escapes++;
    if (escapes > 3) {
      boton.replaceWith(Object.assign(document.createElement("p"), { className: "sonrojo-mensaje", textContent: "Muy tarde... ya te sonrojaste" }));
      document.body.classList.add("sonrojada");
      corazones(efectos(), innerWidth / 2, innerHeight / 2, 10);
      setTimeout(() => document.body.classList.remove("sonrojada"), 2500);
      return;
    }
    const zona = boton.parentElement.getBoundingClientRect();
    const ancho = boton.offsetWidth;
    boton.style.left = `${ancho / 2 + Math.random() * Math.max(0, zona.width - ancho)}px`;
    boton.style.top = `${Math.random() * 24}px`;
  };
  boton.addEventListener("pointerdown", huir);
  boton.addEventListener("click", (e) => e.preventDefault());
}

// ---------- Jardín ----------
function prepararJardin() {
  const jardin = $("#jardin");
  let sembradas = 0;
  jardin.addEventListener("pointerdown", (e) => {
    const caja = jardin.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - caja.left, 30), caja.width - 30);
    const envoltura = document.createElement("div");
    envoltura.innerHTML = flor(Math.floor(Math.random() * 3));
    const svg = envoltura.firstElementChild;
    svg.style.left = `${x - 32}px`;
    svg.style.setProperty("--escala", (0.75 + Math.random() * 0.5).toFixed(2));
    svg.style.zIndex = String(Math.round(Math.random() * 10));
    jardin.appendChild(svg);
    sembradas++;
    $("#n-flores").textContent = sembradas;
    $("#jardin-pista").hidden = true;
    if (sembradas === 7) {
      $("#informe").classList.add("listo");
      confeti(efectos(), 18);
    }
  });
}

// ---------- Torta ----------
function prepararTorta() {
  let terminado = false;
  let soplido = null;
  const revisar = () => {
    if (document.querySelectorAll(".vela:not(.apagada)").length > 0 || terminado) return;
    terminado = true;
    soplido?.detener();
    $("#torta-texto").textContent = "Tu deseo ya está en camino.";
    $("#feliz").classList.add("visible");
    $(".acciones").hidden = true;
    confeti(efectos(), 60);
  };
  const apagarTodas = () => {
    document.querySelectorAll(".vela:not(.apagada)").forEach((v, i) => setTimeout(() => {
      v.classList.add("apagada");
      revisar();
    }, i * 45));
  };
  $("#torta").addEventListener("click", (e) => {
    const vela = e.target.closest(".vela");
    if (!vela || vela.classList.contains("apagada")) return;
    vela.classList.add("apagada");
    revisar();
  });
  $("#apagar").addEventListener("click", apagarTodas);
  $("#soplar").addEventListener("click", async () => {
    const boton = $("#soplar");
    boton.disabled = true;
    boton.textContent = "Escuchando... sopla fuerte";
    soplido = await escucharSoplido(apagarTodas);
    if (!soplido) boton.textContent = "Sin micrófono, usa el otro botón";
  });
}

// ---------- Final: sobre y confesión ----------
function prepararFinal() {
  $("#sobre").addEventListener("click", leerConfesion, { once: true });
  $("#a-recuerdos").addEventListener("click", () => irA(paginas.length - 1));
}

async function leerConfesion() {
  const sobre = $("#sobre");
  sobre.classList.add("abierto");
  confeti(efectos(), 24);
  await esperar(800);
  sobre.classList.add("guardado");
  await esperar(450);
  sobre.hidden = true;
  const caja = $("#confesion");
  caja.classList.add("visible");
  for (const linea of secreto.confesion) {
    const p = document.createElement("p");
    const negrita = /^\*\*(.+)\*\*$/.exec(linea);
    if (negrita) {
      p.className = "grande";
      p.textContent = negrita[1];
    } else {
      linea.split(/\*\*(.+?)\*\*/).forEach((trozo, i) =>
        p.append(i % 2 ? Object.assign(document.createElement("strong"), { textContent: trozo }) : trozo),
      );
    }
    caja.appendChild(p);
  }
  for (const p of [...caja.children]) {
    await esperar(p.textContent ? 1100 : 350);
    p.classList.add("visible");
    if (p.textContent) p.scrollIntoView({ behavior: "smooth", block: "center" });
    if (p.classList.contains("grande")) llover(efectos(), "te quiero", 18);
  }
  await esperar(900);
  $("#cierre").classList.add("visible");
}

// ---------- Recuerdos de los dos ----------
let recuerdos = [];
let cargados = false;
const pieRecuerdo = (r) => [r.fecha && new Date(`${r.fecha}T12:00:00`).toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" }), r.quien && `pegado por ${r.quien}`]
  .filter(Boolean).join(" · ");

function pintarRecuerdos() {
  const caja = $("#recuerdos");
  if (!recuerdos.length) {
    caja.innerHTML = `<p class="recuerdos-vacio">Todavía no hay nada pegado.<br>El primer recuerdo es tuyo.</p>`;
    return;
  }
  caja.innerHTML = recuerdos.map((r) => `
    <button class="recuerdo" data-id="${r.id}">
      ${r.foto ? `<img src="${r.foto}" alt="${escapar(r.titulo)}" loading="lazy">` : `<span class="sin-foto">${escapar((r.texto || r.titulo).slice(0, 90))}</span>`}
      <b>${escapar(r.titulo)}</b>
      <small>${escapar(pieRecuerdo(r))}</small>
    </button>`).join("");
}

async function cargarRecuerdos() {
  if (cargados || !baul) return;
  try {
    recuerdos = await baul.listar();
    cargados = true;
    pintarRecuerdos();
  } catch {
    $("#recuerdos").innerHTML = `<p class="recuerdos-vacio">No pude traer los recuerdos, revisa tu internet y vuelve a esta página.</p>`;
  }
}

function prepararRecuerdos() {
  const dialogo = $("#dialogo-recuerdo");
  const form = $("#form-recuerdo");
  let foto = null;

  $("#pegar-recuerdo").addEventListener("click", () => {
    form.reset();
    foto = null;
    $("#r-vista").hidden = true;
    $("#r-foto-texto").hidden = false;
    $("#r-mensaje").textContent = "";
    $("#r-fecha").value = new Date().toLocaleDateString("en-CA");
    dialogo.showModal();
  });
  $("#r-cancelar").addEventListener("click", () => dialogo.close());
  $("#r-foto").addEventListener("change", async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    $("#r-mensaje").textContent = "Preparando la foto...";
    try {
      foto = await prepararFoto(archivo);
      $("#r-vista").src = foto;
      $("#r-vista").hidden = false;
      $("#r-foto-texto").hidden = true;
      $("#r-mensaje").textContent = "";
    } catch {
      foto = null;
      $("#r-mensaje").textContent = "Esa foto no se pudo abrir, prueba con otra.";
    }
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = $("#r-titulo").value.trim();
    if (!titulo) return;
    const boton = $("#r-guardar");
    boton.disabled = true;
    $("#r-mensaje").textContent = "Pegando...";
    try {
      const nuevo = await baul.guardar({
        titulo,
        texto: $("#r-texto").value.trim(),
        fecha: $("#r-fecha").value,
        quien: form.elements.quien.value,
        foto,
      });
      recuerdos.push(nuevo);
      pintarRecuerdos();
      dialogo.close();
      confeti(efectos(), 30);
    } catch {
      $("#r-mensaje").textContent = "No se pudo pegar, revisa tu internet e inténtalo otra vez.";
    } finally {
      boton.disabled = false;
    }
  });
}

// ---------- Puerta ----------
let descarga = null;
function cargarSecreto() {
  descarga ??= fetch("secreto.bin").then(async (r) => {
    if (!r.ok) throw new Error("red");
    return new Uint8Array(await r.arrayBuffer());
  });
  return descarga.catch((err) => {
    descarga = null;
    throw err;
  });
}

function prepararPuerta() {
  cargarSecreto().catch(() => {});
  $("#puerta-pochita").innerHTML = personaje("pochi");
  $(".ver-clave").addEventListener("click", () => {
    const campo = $("#clave");
    campo.type = campo.type === "password" ? "text" : "password";
  });

  $("#form-llave").addEventListener("submit", async (e) => {
    e.preventDefault();
    const boton = $("#abrir");
    const mensaje = $("#mensaje-puerta");
    boton.disabled = true;
    mensaje.textContent = "Pochita está buscando la llave...";
    musica.preparar(); // dentro del toque, para que la canción pueda sonar sola al abrir el álbum
    try {
      const bytes = await cargarSecreto();
      secreto = JSON.parse(await descifrar(bytes, normalizar($("#usuario").value, $("#clave").value)));
      mensaje.textContent = "¡Es ella!";
      $("#clave").value = "";
      document.activeElement?.blur();
      if (DEMO) baul = baulDeMentira();
      else conectar(secreto.llaveRecuerdos).then((b) => { baul = b; }, () => {});
      setTimeout(despuesDeLaPuerta, 500);
    } catch (err) {
      mensaje.textContent = err.message !== "credenciales" ? "No pude cargar el álbum, revisa tu internet." : "Esa no es la llave... inténtalo otra vez.";
      const tapa = $("#puerta .tapa");
      tapa.classList.remove("temblar");
      void tapa.offsetWidth;
      tapa.classList.add("temblar");
      const pochi = $("#puerta-pochita .pochita");
      pochi.classList.add("niega");
      setTimeout(() => pochi.classList.remove("niega"), 1300);
      boton.disabled = false;
    }
  });
}

function mostrar(id) {
  document.querySelectorAll(".pantalla").forEach((p) => p.classList.toggle("activa", p.id === id));
}

function despuesDeLaPuerta() {
  if (DEMO || faltante(Date.now()).listo) return abrirAlbum();
  $("#espera-pochita").innerHTML = personaje("pochi");
  mostrar("espera");
  const pintar = () => {
    const f = faltante(Date.now());
    if (f.listo) {
      clearInterval(intervalo);
      confeti(efectos(), 30);
      return abrirAlbum();
    }
    $("#r-d").textContent = f.d;
    $("#r-h").textContent = String(f.h).padStart(2, "0");
    $("#r-m").textContent = String(f.m).padStart(2, "0");
    $("#r-s").textContent = String(f.s).padStart(2, "0");
  };
  const intervalo = setInterval(pintar, 1000);
  pintar();
}

function abrirAlbum() {
  montarAlbum();
  mostrar("album");
  irA(0);
  confeti(efectos(), 36);
  encenderMusica();
}

prepararPuerta();
prepararNavegacion();
prepararToques();

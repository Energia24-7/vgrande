/* script.js
   Reemplaza las URLs en CSV_URLS con los links "publicar -> CSV" de cada pestaña.
*/

const CSV_URLS = {
servicios: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=0&single=true&output=csv",
ventas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1530798322&single=true&output=csv",
bienes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1792574698&single=true&output=csv"
};

let serviciosData = [], ventasData = [], bienesData = [];

/* Utilidades */
const norm = v => (v || "").toString().trim();
const normKey = v => norm(v).toLowerCase();

function isRowEmpty(row) {
  return Object.values(row).every(x => norm(x) === "");
}

function createImgHtml(url, alt='foto') {
  if (!url) return "";
  // si hay varios URLs separados por comas, tomar el primero
  const first = url.split(",")[0].trim();
  if (!first) return "";
  // onerror oculta la imagen si no carga
  return `<img src="${first}" alt="${alt}" onerror="this.style.display='none'">`;
}

/* Cargar CSV con PapaParse y normalizar filas */
function papaLoadAndInit(key, url, onLoaded) {
  console.log("Cargando CSV:", key, url);
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      // Normalizar y quitar filas vacías
      const data = results.data
        .map(r => {
          const newRow = {};
          Object.keys(r).forEach(k => newRow[k.trim()] = r[k] !== undefined ? r[k].toString().trim() : "");
          return newRow;
        })
        .filter(r => !isRowEmpty(r));
      console.log(`${key} -> filas cargadas:`, data.length, data);
      onLoaded(data);
    },
    error: function(err) {
      console.error("PapaParse error:", err);
      const cont = document.getElementById(key === "servicios" ? "listaServicios" : key === "ventas" ? "listaVentas" : "listaBienes");
      if (cont) cont.innerHTML = `<p class="error">Error al cargar datos (${err.message || err}). Revisa la URL CSV.</p>`;
    }
  });
}

/* ---------- SERVICIOS ---------- */
function serviciosLoaded(data) {
  serviciosData = data;
  populateSelectFromData("filtroCategoriaServicios", serviciosData, "Categoria", true);
  document.getElementById("filtroCategoriaServicios").addEventListener("change", filterServicios);
  mostrarServicios(serviciosData);
}

function mostrarServicios(arr) {
  const cont = document.getElementById("listaServicios");
  if (!cont) return;
  cont.innerHTML = "";
  if (!arr.length) { cont.innerHTML = "<p>No hay resultados.</p>"; return; }
  arr.forEach(s => {
    cont.innerHTML += `
      <div class="card">
        <h3>${norm(s.Nombre) || "(Sin nombre)"} <small>— ${norm(s.Categoria) || "Sin categoría"}</small></h3>
        <p><strong>Contacto:</strong> ${norm(s.Contacto)}</p>
        <p>${norm(s.Detalle)}</p>
        <div class="fotos">${createImgHtml(s.Foto1)}${createImgHtml(s.Foto2)}${createImgHtml(s.Foto3)}${createImgHtml(s.Foto4)}</div>
        <p class="comentario">${norm(s.Comentario || "")}</p>
      </div>`;
  });
}

function filterServicios() {
  const sel = document.getElementById("filtroCategoriaServicios").value; // ya es normalizado en populate
  const filtered = serviciosData.filter(r => {
    const catNorm = normKey(r.Categoria);
    return sel === "" || catNorm === sel;
  });
  mostrarServicios(filtered);
}

/* ---------- VENTAS ---------- */
function ventasLoaded(data) {
  ventasData = data;
  populateSelectFromData("filtroCategoriaVentas", ventasData, "Categoria", true);
  populateSelectFromData("filtroEstadoVentas", ventasData, "Estado", true);
  document.getElementById("filtroCategoriaVentas").addEventListener("change", filterVentas);
  document.getElementById("filtroEstadoVentas").addEventListener("change", filterVentas);
  mostrarVentas(ventasData);
}

function mostrarVentas(arr) {
  const cont = document.getElementById("listaVentas");
  if (!cont) return;
  cont.innerHTML = "";
  if (!arr.length) { cont.innerHTML = "<p>No hay resultados.</p>"; return; }
  arr.forEach(v => {
    cont.innerHTML += `
      <div class="card">
        <h3>${norm(v.Descripcion) || "(Sin descripción)"} <small>— ${norm(v.Categoria) || "Sin categoría"}</small></h3>
        <p><strong>Precio:</strong> ${norm(v.Precio)}</p>
        <p>${norm(v.Marca)} ${norm(v.Modelo)} — <em>${norm(v.Estado)}</em></p>
        <p><strong>Publicado:</strong> ${norm(v.Fecha)}</p>
        <div class="fotos">${createImgHtml(v.Foto1)}${createImgHtml(v.Foto2)}</div>
        <p><strong>Contacto:</strong> ${norm(v.Contacto)}</p>
      </div>`;
  });
}

function filterVentas() {
  const cat = document.getElementById("filtroCategoriaVentas").value;
  const est = document.getElementById("filtroEstadoVentas").value;
  const filtered = ventasData.filter(r => {
    const catNorm = normKey(r.Categoria);
    const estNorm = normKey(r.Estado);
    const okCat = cat === "" || catNorm === cat;
    const okEst = est === "" || estNorm === est;
    return okCat && okEst;
  });
  mostrarVentas(filtered);
}

/* ---------- BIENES ---------- */
function bienesLoaded(data) {
  bienesData = data;
  populateSelectFromData("filtroTransaccionBienes", bienesData, "Transaccion", true);
  populateSelectFromData("filtroTipoBienes", bienesData, "Tipo", true);
  document.getElementById("filtroTransaccionBienes").addEventListener("change", filterBienes);
  document.getElementById("filtroTipoBienes").addEventListener("change", filterBienes);
  mostrarBienes(bienesData);
}

function mostrarBienes(arr) {
  const cont = document.getElementById("listaBienes");
  if (!cont) return;
  cont.innerHTML = "";
  if (!arr.length) { cont.innerHTML = "<p>No hay resultados.</p>"; return; }
  arr.forEach(b => {
    cont.innerHTML += `
      <div class="card">
        <h3>${norm(b.Tipo) || "(Sin tipo)"} — <small>${norm(b.Transaccion) || "Sin transacción"}</small></h3>
        <p><strong>Valor:</strong> ${norm(b.Valor)}</p>
        <p><strong>Ubicación:</strong> ${norm(b.Ubicacion)}</p>
        <p><strong>Publicado:</strong> ${norm(b.Fecha)}</p>
        <div class="fotos">${createImgHtml(b.Foto1)}${createImgHtml(b.Foto2)}${createImgHtml(b.Foto3)}${createImgHtml(b.Foto4)}</div>
        <p><strong>Contacto:</strong> ${norm(b.Contacto)}</p>
      </div>`;
  });
}

function filterBienes() {
  const trans = document.getElementById("filtroTransaccionBienes").value;
  const tipo  = document.getElementById("filtroTipoBienes").value;
  const filtered = bienesData.filter(r => {
    const transNorm = normKey(r.Transaccion);
    const tipoNorm  = normKey(r.Tipo);
    const okTrans = trans === "" || transNorm === trans;
    const okTipo  = tipo === ""  || tipoNorm === tipo;
    return okTrans && okTipo;
  });
  mostrarBienes(filtered);
}

/* ---------- Helpers: poblar selects con valores únicos (normalizados) ---------- */
function populateSelectFromData(selectId, data, columnName, includeEmptyOption = true) {
  const select = document.getElementById(selectId);
  if (!select) return;
  // Map de normalizado -> display (primer valor encontrado)
  const map = new Map();
  data.forEach(r => {
    const raw = r[columnName] || "";
    const n = normKey(raw);
    if (n && !map.has(n)) map.set(n, norm(raw));
  });
  // Limpiar y agregar opciones
  select.innerHTML = "";
  if (includeEmptyOption) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.text = "— Todas —";
    select.appendChild(opt);
  }
  // Ordenar por texto legible
  Array.from(map.entries())
    .sort((a,b) => a[1].localeCompare(b[1], 'es'))
    .forEach(([normVal, display]) => {
      const o = document.createElement("option");
      o.value = normVal;    // valor normalizado
      o.text = display;     // texto legible
      select.appendChild(o);
    });
}

/* ---------- Inicialización según la página (DOM) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("listaServicios")) {
    papaLoadAndInit("servicios", CSV_URLS.servicios, serviciosLoaded);
  }
  if (document.getElementById("listaVentas")) {
    papaLoadAndInit("ventas", CSV_URLS.ventas, ventasLoaded);
  }
  if (document.getElementById("listaBienes")) {
    papaLoadAndInit("bienes", CSV_URLS.bienes, bienesLoaded);
  }
});

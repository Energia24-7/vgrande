```javascript
// ================================
// CONFIG: URLs CSV publicados
// ================================
const CSV_URLS = {
servicios: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=0&single=true&output=csv",
ventas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1530798322&single=true&output=csv",
bienes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1792574698&single=true&output=csv"
};

// ================================
// Loader general con PapaParse
// ================================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("listaServicios")) {
    cargarCSV(CSV_URLS.servicios, renderServicios);
  }
  if (document.getElementById("listaVentas")) {
    cargarCSV(CSV_URLS.ventas, renderVentas);
  }
  if (document.getElementById("listaBienes")) {
    cargarCSV(CSV_URLS.bienes, renderBienes);
  }
});

function cargarCSV(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function (results) {
      callback(results.data);
    }
  });
}

// ================================
// Utilidad para crear imágenes con lightbox
// ================================
function createImgHtml(url, alt = "foto") {
  if (!url) return "";
  let cleanUrl = url.trim();
  if (cleanUrl === "") return "";
  return `<img src="${cleanUrl}" alt="${alt}" class="thumb" onclick="openLightbox('${cleanUrl}')">`;
}

function openLightbox(src) {
  let modal = document.getElementById("lightboxModal");
  let img = document.getElementById("lightboxImg");
  img.src = src;
  modal.style.display = "block";
}

function closeLightbox() {
  document.getElementById("lightboxModal").style.display = "none";
}

// ================================
// Servicios
// ================================
let serviciosGlobal = [];

function renderServicios(servicios) {
  serviciosGlobal = servicios.filter(s => s.Nombre);
  mostrarServicios(serviciosGlobal);
  cargarFiltro("filtroCategoria", "Categoria", serviciosGlobal);
}

function mostrarServicios(servicios) {
  let cont = document.getElementById("listaServicios");
  cont.innerHTML = "";
  servicios.forEach(s => {
    cont.innerHTML += `
      <div class="card">
        <h3>${s.Nombre} (${s.Categoria})</h3>
        <p>Tel: ${s.Contacto}</p>
        <p>${s.Detalle}</p>
        <div class="fotos">
          ${createImgHtml(s.Foto1)}
          ${createImgHtml(s.Foto2)}
          ${createImgHtml(s.Foto3)}
          ${createImgHtml(s.Foto4)}
        </div>
        <p><em>${s.Comentario || ""}</em></p>
      </div>`;
  });
}

function filtrarServicios() {
  let cat = document.getElementById("filtroCategoria").value;
  if (cat === "") {
    mostrarServicios(serviciosGlobal);
  } else {
    mostrarServicios(serviciosGlobal.filter(s => s.Categoria === cat));
  }
}

// ================================
// Ventas
// ================================
let ventasGlobal = [];

function renderVentas(ventas) {
  ventasGlobal = ventas.filter(v => v.Descripcion);
  mostrarVentas(ventasGlobal);
  cargarFiltro("filtroCategoriaVentas", "Categoria", ventasGlobal);
  cargarFiltro("filtroEstadoVentas", "Estado", ventasGlobal);
}

function mostrarVentas(ventas) {
  let cont = document.getElementById("listaVentas");
  cont.innerHTML = "";
  ventas.forEach(v => {
    cont.innerHTML += `
      <div class="card">
        <h3>${v.Descripcion} - $${v.Precio}</h3>
        <p>${v.Marca} ${v.Modelo} (${v.Estado})</p>
        <p>${v.Categoria} - Publicado: ${v.Fecha}</p>
        <div class="fotos">
          ${createImgHtml(v.Foto1)}
          ${createImgHtml(v.Foto2)}
        </div>
        <p>Contacto: ${v.Contacto}</p>
      </div>`;
  });
}

function filtrarVentas() {
  let cat = document.getElementById("filtroCategoriaVentas").value;
  let estado = document.getElementById("filtroEstadoVentas").value;
  let filtrados = ventasGlobal;
  if (cat !== "") filtrados = filtrados.filter(v => v.Categoria === cat);
  if (estado !== "") filtrados = filtrados.filter(v => v.Estado === estado);
  mostrarVentas(filtrados);
}

// ================================
// Bienes
// ================================
let bienesGlobal = [];

function renderBienes(bienes) {
  bienesGlobal = bienes.filter(b => b.Tipo);
  mostrarBienes(bienesGlobal);
  cargarFiltro("filtroTransaccion", "Transaccion", bienesGlobal);
  cargarFiltro("filtroTipo", "Tipo", bienesGlobal);
}

function mostrarBienes(bienes) {
  let cont = document.getElementById("listaBienes");
  cont.innerHTML = "";
  bienes.forEach(b => {
    cont.innerHTML += `
      <div class="card">
        <h3>${b.Tipo}</h3>
        <p>${b.Transaccion} - $${b.Valor}</p>
        <p>Ubicación: ${b.Ubicacion}</p>
        <p>Publicado: ${b.Fecha}</p>
        <div class="fotos">
          ${createImgHtml(b.Foto1)}
          ${createImgHtml(b.Foto2)}
          ${createImgHtml(b.Foto3)}
          ${createImgHtml(b.Foto4)}
        </div>
        <p>Contacto: ${b.Contacto}</p>
      </div>`;
  });
}

function filtrarBienes() {
  let trans = document.getElementById("filtroTransaccion").value;
  let tipo = document.getElementById("filtroTipo").value;
  let filtrados = bienesGlobal;
  if (trans !== "") filtrados = filtrados.filter(b => b.Transaccion === trans);
  if (tipo !== "") filtrados = filtrados.filter(b => b.Tipo === tipo);
  mostrarBienes(filtrados);
}

// ================================
// Filtro genérico
// ================================
function cargarFiltro(id, campo, datos) {
  let select = document.getElementById(id);
  if (!select) return;
  let valores = [...new Set(datos.map(d => d[campo]).filter(Boolean))];
  select.innerHTML = `<option value="">Todos</option>` +
    valores.map(v => `<option value="${v}">${v}</option>`).join("");
}
```

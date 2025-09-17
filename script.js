// URLs de las 3 hojas de Google Sheets en formato CSV
const urls = {
  servicios: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=0&single=true&output=csv",
  ventas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1530798322&single=true&output=csv",
  bienes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1792574698&single=true&output=csv"
};

// Función genérica para cargar un CSV
function loadCSV(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: results => callback(results.data)
  });
}

// --- Renderizado de imágenes con lightbox ---
function renderImages(row, prefix = "Foto") {
  let images = [];
  for (let i = 1; i <= 4; i++) {
    const url = row[`${prefix} ${i}`] || row[`Foto${i}`];
    if (url) {
      images.push(`<img src="${url}" alt="Imagen" onclick="openLightbox('${url}')">`);
    }
  }
  return images.join("");
}

// --- Lightbox para ver fotos grandes ---
function openLightbox(url) {
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.style.position = "fixed";
  lightbox.style.top = 0;
  lightbox.style.left = 0;
  lightbox.style.width = "100%";
  lightbox.style.height = "100%";
  lightbox.style.background = "rgba(0,0,0,0.8)";
  lightbox.style.display = "flex";
  lightbox.style.alignItems = "center";
  lightbox.style.justifyContent = "center";
  lightbox.innerHTML = `<img src="${url}" style="max-width:90%; max-height:90%; border-radius:10px;">`;
  lightbox.onclick = () => document.body.removeChild(lightbox);
  document.body.appendChild(lightbox);
}

// --- Render Servicios ---
function renderServicios(data) {
  const container = document.getElementById("servicios");
  const filtro = document.getElementById("filterCategoria");

  // Llenar filtro
  const categorias = [...new Set(data.map(row => row["Categoria de Servicio"]).filter(Boolean))];
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtro.appendChild(opt);
  });

  function mostrar(filtroCat) {
    container.innerHTML = "";
    data.filter(row => !filtroCat || row["Categoria de Servicio"] === filtroCat)
        .forEach(row => {
      container.innerHTML += `
        <div class="card">
          ${renderImages(row)}
          <h3><strong>Nombre:</strong>${row["Nombre"] || "Sin nombre"}</h3>
          <p><strong>Teléfono:</strong> ${row["Contacto telefono"] || ""}</p>
          <p><strong>Categoría:</strong> ${row["Categoria de Servicio"] || ""}</p>
          <p><strong>Alcance de servicios:</strong> ${row["Detalle de servicios"] || ""}</p>
        </div>`;
    });
  }

  mostrar("");
  filtro.onchange = () => mostrar(filtro.value);
}

// --- Render Ventas ---
function renderVentas(data) {
  const container = document.getElementById("ventas");
  const filtroCat = document.getElementById("filterCategoria");
  const filtroEst = document.getElementById("filterEstado");

  // Llenar filtros
  const categorias = [...new Set(data.map(r => r["Categoria"]).filter(Boolean))];
  categorias.forEach(c => filtroCat.innerHTML += `<option value="${c}">${c}</option>`);

  const estados = [...new Set(data.map(r => r["Estado"]).filter(Boolean))];
  estados.forEach(e => filtroEst.innerHTML += `<option value="${e}">${e}</option>`);

  function mostrar(cat, est) {
    container.innerHTML = "";
    data.filter(r => (!cat || r["Categoria"] === cat) && (!est || r["Estado"] === est))
        .forEach(row => {
      container.innerHTML += `
        <div class="card">
          ${renderImages(row)}
          <h3>${row["Descripcion"] || "Sin descripción"}</h3>
          <p><strong>Categoría:</strong> ${row["Categoria"] || ""}</p>
          <p><strong>Precio:</strong> $${row["Precio"] || ""}</p>
          <p><strong>Marca:</strong> ${row["Marca"] || ""} | <strong>Modelo:</strong> ${row["Modelo"] || ""}</p>
          <p><strong>Estado:</strong> ${row["Estado"] || ""}</p>
          <p><strong>Fecha de publicación:</strong> ${row["Fecha de publicacion"] || ""}</p>
          <p><strong>Contacto:</strong> ${row["Contacto"] || ""}</p>
          <p><strong>Descripción:</strong> ${row["Descripcion"] || ""}</p>
        </div>`;
    });
  }

  mostrar("", "");
  filtroCat.onchange = () => mostrar(filtroCat.value, filtroEst.value);
  filtroEst.onchange = () => mostrar(filtroCat.value, filtroEst.value);
}

// --- Render Bienes Raíces ---
function renderBienes(data) {
  const container = document.getElementById("bienes");
  const filtroTrans = document.getElementById("filterTransaccion");
  const filtroTipo = document.getElementById("filterTipo");

  // Llenar filtros
  const transacciones = [...new Set(data.map(r => r["Tipo de transaccion"]).filter(Boolean))];
  transacciones.forEach(t => filtroTrans.innerHTML += `<option value="${t}">${t}</option>`);

  const tipos = [...new Set(data.map(r => r["Tipo de inmueble"]).filter(Boolean))];
  tipos.forEach(t => filtroTipo.innerHTML += `<option value="${t}">${t}</option>`);

  function mostrar(trans, tipo) {
    container.innerHTML = "";
    data.filter(r => (!trans || r["Tipo de transaccion"] === trans) && (!tipo || r["Tipo de inmueble"] === tipo))
        .forEach(row => {
      container.innerHTML += `
        <div class="card">
          ${renderImages(row)}
          <h3>${row["Tipo de transacción"] || ""} - ${row["Tipo de inmueble"] || ""}</h3>
          <p><strong>Valor:</strong> $${row["Valor"] || ""}</p>
          <p><strong>Ubicación:</strong> ${row["ubicacion"] || ""}</p>
          <p><strong>Fecha de publicación:</strong> ${row["Fecha de publicacion"] || ""}</p>
          <p><strong>Contacto:</strong> ${row["contacto"] || ""}</p>
          <p><strong>Descripción:</strong> ${row["Descripcion"] || ""}</p>
        </div>`;
    });
  }

  mostrar("", "");
  filtroTrans.onchange = () => mostrar(filtroTrans.value, filtroTipo.value);
  filtroTipo.onchange = () => mostrar(filtroTrans.value, filtroTipo.value);
}

// --- Detectar página actual y cargar datos ---
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("servicios")) {
    loadCSV(urls.servicios, renderServicios);
  }
  if (document.getElementById("ventas")) {
    loadCSV(urls.ventas, renderVentas);
  }
  if (document.getElementById("bienes")) {
    loadCSV(urls.bienes, renderBienes);
  }
});

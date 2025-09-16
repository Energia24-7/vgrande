// script.js

// URLs públicas de tus 3 pestañas en Google Sheets (CSV exportado)
const CSV_URLS = {
  servicios: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=0&single=true&output=csv",
  ventas:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1530798322&single=true&output=csv",
  bienes:    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1792574698&single=true&output=csv"
};

// Detectar en qué página estamos (cada <body> debe tener data-page="...")
const pageType = document.body.dataset.page;

document.addEventListener("DOMContentLoaded", () => {
  if (pageType && CSV_URLS[pageType]) {
    loadData(CSV_URLS[pageType], pageType);
  }
});

// Cargar CSV con PapaParse
function loadData(url, type) {
  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      renderData(results.data, type);
      setupFilters(results.data, type);
    }
  });
}

// Renderizar datos en cada página
function renderData(data, type) {
  const container = document.getElementById("data-container");
  container.innerHTML = "";

  if (type === "servicios") {
    data.forEach(row => {
      container.innerHTML += `
        <div class="card">
          <h3>${row.Nombre || ""}</h3>
          <p><strong>Tel:</strong> ${row.Contacto || ""}</p>
          <p><strong>Categoría:</strong> ${row.Categoria || ""}</p>
          <p>${row.Detalle || ""}</p>
          ${createImgHtml(row.Foto1)}
          ${createImgHtml(row.Foto2)}
          ${createImgHtml(row.Foto3)}
          ${createImgHtml(row.Foto4)}
        </div>
      `;
    });
  }

  if (type === "ventas") {
    data.forEach(row => {
      container.innerHTML += `
        <div class="card">
          <h3>${row.Descripcion || ""}</h3>
          <p><strong>Precio:</strong> $${row.Precio || ""}</p>
          <p><strong>Marca:</strong> ${row.Marca || ""} | <strong>Modelo:</strong> ${row.Modelo || ""}</p>
          <p><strong>Estado:</strong> ${row.Estado || ""} | <strong>Categoría:</strong> ${row.Categoria || ""}</p>
          <p><em>${row["Fecha de publicacion"] || ""}</em></p>
          ${createImgHtml(row.Foto1)}
          ${createImgHtml(row.Foto2)}
          ${createImgHtml(row.Foto3)}
        </div>
      `;
    });
  }

  if (type === "bienes") {
    data.forEach(row => {
      container.innerHTML += `
        <div class="card">
          <div class="info-line">
            <strong>${row["Tipo de transaccion"] || ""}</strong> |
            <strong>${row["Tipo de inmueble"] || ""}</strong> |
            <strong>$${row.Valor || ""}</strong>
          </div>
          <p><strong>Ubicación:</strong> ${row.Ubicacion || ""}</p>
          <p><em>${row["Fecha de publicacion"] || ""}</em></p>
          ${createImgHtml(row.Foto1)}
          ${createImgHtml(row.Foto2)}
          ${createImgHtml(row.Foto3)}
          ${createImgHtml(row.Foto4)}
        </div>
      `;
    });
  }
}

// Crear imágenes con soporte para lightbox
function createImgHtml(url, alt = 'foto') {
  if (!url) return "";
  let cleanUrl = url.trim();
  if (!cleanUrl) return "";

  // Si es link de Google Drive → transformar
  if (cleanUrl.includes("drive.google.com")) {
    const match = cleanUrl.match(/\/d\/([^/]+)\//);
    if (match && match[1]) {
      cleanUrl = `https://drive.google.com/uc?id=${match[1]}`;
    }
  }

  // Usar &quot; para evitar errores de template string
  return `<img src="${cleanUrl}" alt="${alt}" class="thumb" onclick="openLightbox(&quot;${cleanUrl}&quot;)">`;
}

// --- Lightbox ---
function openLightbox(src) {
  const modal = document.getElementById("lightbox");
  const modalImg = document.getElementById("lightbox-img");
  modal.style.display = "flex";
  modalImg.src = src;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}

// --- Filtros dinámicos ---
function setupFilters(data, type) {
  const filter1 = document.getElementById("filter1");
  const filter2 = document.getElementById("filter2");

  if (!filter1) return;

  let options1 = new Set();
  let options2 = new Set();

  if (type === "servicios") {
    data.forEach(r => options1.add(r.Categoria));
    populateSelect(filter1, [...options1], "Todas las categorías");
  }

  if (type === "ventas") {
    data.forEach(r => {
      options1.add(r.Categoria);
      options2.add(r.Estado);
    });
    populateSelect(filter1, [...options1], "Todas las categorías");
    populateSelect(filter2, [...options2], "Todos los estados");
  }

  if (type === "bienes") {
    data.forEach(r => {
      options1.add(r["Tipo de transaccion"]);
      options2.add(r["Tipo de inmueble"]);
    });
    populateSelect(filter1, [...options1], "Todas las transacciones");
    populateSelect(filter2, [...options2], "Todos los inmuebles");
  }

  // Listeners
  [filter1, filter2].forEach(f => {
    if (f) {
      f.addEventListener("change", () => {
        let filtered = data.filter(row => {
          let ok1 = !filter1.value || filter1.value === "all" || 
                    row.Categoria === filter1.value || 
                    row["Tipo de transaccion"] === filter1.value;
          let ok2 = !filter2 || !filter2.value || filter2.value === "all" ||
                    row.Estado === filter2.value || 
                    row["Tipo de inmueble"] === filter2.value;
          return ok1 && ok2;
        });
        renderData(filtered, type);
      });
    }
  });
}

function populateSelect(select, values, defaultText) {
  if (!select) return;
  select.innerHTML = `<option value="all">${defaultText}</option>`;
  values.filter(Boolean).forEach(v => {
    select.innerHTML += `<option value="${v}">${v}</option>`;
  });
}

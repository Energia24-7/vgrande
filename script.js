// URLs CSV publicados desde Google Sheets
const urls = {
  servicios: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=0&single=true&output=csv",
  ventas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1530798322&single=true&output=csv",
  bienes: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pub?gid=1792574698&single=true&output=csv"
};

let serviciosGlobal = [];

function renderServicios(servicios) {
  serviciosGlobal = servicios; // guardar para filtrar
  mostrarServicios(servicios);
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



// Detectar en qué página estamos
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("listaServicios")) {
    cargarCSV(urls.servicios, renderServicios);
  }
  if (document.getElementById("listaVentas")) {
    cargarCSV(urls.ventas, renderVentas);
  }
  if (document.getElementById("listaBienes")) {
    cargarCSV(urls.bienes, renderBienes);
  }
});

function cargarCSV(url, callback) {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function(results) {
      callback(results.data);
    }
  });
}

// Renderizar servicios
function renderServicios(servicios) {
  let cont = document.getElementById("listaServicios");
  cont.innerHTML = "";
  servicios.forEach(s => {
    cont.innerHTML += `
      <div class="card">
        <h3>${s.Nombre} (${s.Categoria})</h3>
        <p>Tel: ${s.Contacto}</p>
        <p>${s.Detalle}</p>
        <div class="fotos">
          ${[s.Foto1, s.Foto2, s.Foto3, s.Foto4].filter(Boolean).map(f => `<img src="${f}" alt="foto">`).join("")}
        </div>
        <p><em>${s.Comentario || ""}</em></p>
      </div>`;
  });
}

// Renderizar ventas
function renderVentas(ventas) {
  let cont = document.getElementById("listaVentas");
  cont.innerHTML = "";
  ventas.forEach(v => {
    cont.innerHTML += `
      <div class="card">
        <h3>${v.Descripcion} - $${v.Precio}</h3>
        <p>${v.Marca} ${v.Modelo} (${v.Estado})</p>
        <p>${v.Categoria} - Publicado: ${v.Fecha}</p>
        <div class="fotos">
          ${[v.Foto1, v.Foto2].filter(Boolean).map(f => `<img src="${f}" alt="foto">`).join("")}
        </div>
        <p>Contacto: ${v.Contacto}</p>
      </div>`;
  });
}

// Renderizar bienes
function renderBienes(bienes) {
  let cont = document.getElementById("listaBienes");
  cont.innerHTML = "";
  bienes.forEach(b => {
    cont.innerHTML += `
      <div class="card">
        <h3>${b.Tipo} en ${b.Transaccion} - $${b.Valor}</h3>
        <p>Ubicación: ${b.Ubicacion}</p>
        <p>Publicado: ${b.Fecha}</p>
        <div class="fotos">
          ${[b.Foto1, b.Foto2, b.Foto3, b.Foto4].filter(Boolean).map(f => `<img src="${f}" alt="foto">`).join("")}
        </div>
        <p>Contacto: ${b.Contacto}</p>
      </div>`;
  });
}

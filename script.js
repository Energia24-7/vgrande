const publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxqQpk8-5oXFgeRzYIJuhyk9qXdGv23MzAtMap4WsqFtGnVWDfHpJELFn76s4iomdAorxuxPNh6LpQ/pubhtml"; 

function init() {
  Tabletop.init({
    key: publicSpreadsheetUrl,
    callback: showInfo,
    simpleSheet: false
  });
}

function showInfo(data, tabletop) {
  if (document.getElementById("listaServicios")) {
    renderServicios(data["Servicios"].elements);
  }
  if (document.getElementById("listaVentas")) {
    renderVentas(data["Ventas"].elements);
  }
  if (document.getElementById("listaBienes")) {
    renderBienes(data["Bienes"].elements);
  }
}

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
          ${[s.Foto1, s.Foto2, s.Foto3, s.Foto4].filter(Boolean).map(f => `<img src="${f}">`).join("")}
        </div>
      </div>`;
  });
}

function renderVentas(ventas) {
  let cont = document.getElementById("listaVentas");
  cont.innerHTML = "";
  ventas.forEach(v => {
    cont.innerHTML += `
      <div class="card">
        <h3>${v.Descripcion} - ${v.Precio}</h3>
        <p>${v.Marca} ${v.Modelo} (${v.Estado})</p>
        <p>${v.Categoria} - Publicado: ${v.Fecha}</p>
        <div class="fotos">
          ${[v.Foto1, v.Foto2].filter(Boolean).map(f => `<img src="${f}">`).join("")}
        </div>
        <p>Contacto: ${v.Contacto}</p>
      </div>`;
  });
}

function renderBienes(bienes) {
  let cont = document.getElementById("listaBienes");
  cont.innerHTML = "";
  bienes.forEach(b => {
    cont.innerHTML += `
      <div class="card">
        <h3>${b.Tipo} en ${b.Transaccion} - ${b.Valor}</h3>
        <p>Ubicación: ${b.Ubicacion}</p>
        <p>Publicado: ${b.Fecha}</p>
        <div class="fotos">
          ${[b.Foto1, b.Foto2, b.Foto3, b.Foto4].filter(Boolean).map(f => `<img src="${f}">`).join("")}
        </div>
        <p>Contacto: ${b.Contacto}</p>
      </div>`;
  });
}

window.addEventListener("DOMContentLoaded", init);

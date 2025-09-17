/*
script.js
- Carga datos desde Google Sheets publicado (Tabletop.js)
- Busca pestañas por nombre: Servicios, Publicaciones, Propiedades (sin diferenciar mayúsculas)
- Inserta tarjetas en el DOM
NOTA: Reemplaza `SHEET_ID` por el ID real si es distinto.
*/
(function(){
// Usa el spreadsheet ID que compartiste anteriormente en la conversación
const SHEET_ID = '1DV7UAvEBayDyx8j7pUwCjaUIqiNx0vl9GhyBfo6YKps';


function el(id){ return document.getElementById(id); }


function createCard(item){
const div = document.createElement('div');
div.className = 'card';
const title = document.createElement('h3');
title.textContent = item.titulo || item.title || item.Name || item.name || 'Sin título';
div.appendChild(title);
if(item.descripcion || item.description || item.Descripcion){
const p = document.createElement('p');
p.textContent = item.descripcion || item.description || item.Descripcion;
div.appendChild(p);
}
const meta = document.createElement('div');
meta.className = 'meta';
const extras = [];
if(item.precio) extras.push('Precio: ' + item.precio);
if(item.telefono) extras.push('Tel: ' + item.telefono);
if(item.ubicacion) extras.push(item.ubicacion);
meta.textContent = extras.join(' • ');
if(extras.length) div.appendChild(meta);
return div;
}


function populate(containerId, rows){
const container = el(containerId);
if(!container) return;
container.innerHTML = '';
rows.forEach(r=>{
container.appendChild(createCard(r));
});
}


function findSheetByName(data, name){
const key = Object.keys(data).find(k => k.toLowerCase().includes(name.toLowerCase()));
return key ? data[key] : null;
}


function onData(data, tabletop){
// Tabletop returns sheets under tabletop.sheets() or as properties depending on config
// Normalizamos a objeto de arrays
const sheets = tabletop.sheets ? tabletop.sheets() : data;


// Buscamos por nombres comunes
const servicios = findSheetByName(sheets, 'servicio') || findSheetByName(sheets, 'services');
const publicaciones = findSheetByName(sheets, 'publicacion') || findSheetByName(sheets, 'venta') || findSheetByName(sheets, 'items') || findSheetByName(sheets, 'publications');
const propiedades = findSheetByName(sheets, 'propiedad') || findSheetByName(sheets, 'propiedades') || findSheetByName(sheets, 'properties');


if(servicios) populate('servicios-list', servicios.elements || servicios.rows || servicios);
if(publicaciones) populate('publicaciones-list', publicaciones.elements || publicaciones.rows || publicaciones);
if(propiedades) populate('propiedades-list', propiedades.elements || propiedades.rows || propiedades);


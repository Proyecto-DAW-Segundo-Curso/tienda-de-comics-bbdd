const API_URL = '/api/comics';

document.addEventListener('DOMContentLoaded', () => {
  const addComicBtn = document.getElementById('add-comic-btn');
  const listComicsBtn = document.getElementById('list-comics-btn');
  const formContainer = document.getElementById('comic-form');
  const listContainer = document.getElementById('comic-list');
  const form = document.getElementById('form-comic');

  // Mostrar formulario para añadir cómic
  addComicBtn.addEventListener('click', () => {
    formContainer.classList.remove('hidden');
    listContainer.classList.add('hidden');
    form.reset(); // Limpia el formulario al abrir
  });

  // Mostrar lista de cómics
  listComicsBtn.addEventListener('click', () => {
    formContainer.classList.add('hidden');
    listContainer.classList.remove('hidden');
    loadComics(); // Carga la lista actualizada
  });

  // Manejo del formulario para guardar o actualizar
  form.addEventListener('submit', saveComic);

  // Cargar la lista de cómics al inicio (por defecto está oculta)
});

// Cargar todos los cómics y mostrarlos en la tabla
async function loadComics() {
  const response = await fetch(API_URL);
  const comics = await response.json();

  const tbody = document.querySelector('#comics-table tbody');
  tbody.innerHTML = '';

  comics.forEach(comic => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${comic.id}</td>
      <td>${comic.titulo}</td>
      <td>${comic.autor}</td>
      <td>${comic.editorial}</td>
      <td>${comic.genero}</td>
      <td>${comic.precio}</td>
      <td>${comic.stock}</td>
      <td>
        <button class="edit" onclick="editComic(${comic.id})">Editar</button>
        <button class="delete" onclick="deleteComic(${comic.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Guardar o actualizar un cómic
async function saveComic(event) {
  event.preventDefault();

  const id = document.getElementById('comic-id').value;
  const comic = {
    titulo: document.getElementById('titulo').value,
    autor: document.getElementById('autor').value,
    editorial: document.getElementById('editorial').value,
    genero: document.getElementById('genero').value,
    precio: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value),
    imagen: document.getElementById('imagen').value
  };

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comic)
  });

  form.reset();
  formContainer.classList.add('hidden'); // Oculta el formulario después de guardar
  listContainer.classList.remove('hidden'); // Muestra la lista actualizada
  loadComics(); // Recarga los datos
}

// Eliminar un cómic
async function deleteComic(id) {
  if (confirm('¿Estás seguro de eliminar este cómic?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadComics(); // Recarga los datos después de eliminar
  }
}

// Editar un cómic
async function editComic(id) {
  // Solicitar los datos del cómic a la API
  const response = await fetch(`${API_URL}/${id}`);
  const comic = await response.json();

  // Rellenar el formulario con los datos del cómic seleccionado
  document.getElementById('comic-id').value = comic.id;
  document.getElementById('titulo').value = comic.titulo;
  document.getElementById('autor').value = comic.autor;
  document.getElementById('editorial').value = comic.editorial;
  document.getElementById('genero').value = comic.genero;
  document.getElementById('precio').value = comic.precio;
  document.getElementById('stock').value = comic.stock;
  document.getElementById('imagen').value = comic.imagen;

  // Mostrar el formulario para editar el cómic
  formContainer.classList.remove('hidden');
  listContainer.classList.add('hidden');
}

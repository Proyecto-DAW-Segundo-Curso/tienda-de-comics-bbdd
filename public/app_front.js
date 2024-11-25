// La URL de la API donde se harán las solicitudes de cómics.
const API_URL = '/api/comics';

// Evento que se dispara cuando el documento HTML está completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  // Llama a la función para cargar los cómics cuando la página se carga.
  loadComics();

  // Obtiene el formulario de cómics desde el HTML.
  const form = document.getElementById('form-comic');

  // Añade un event listener al formulario para manejar el evento submit (envío de formulario).
  form.addEventListener('submit', saveComic);
});

// Función asincrónica para cargar todos los cómics desde la API
async function loadComics() {
  // Hace una solicitud GET a la API para obtener todos los cómics
  const response = await fetch(API_URL);

  // Convierte la respuesta en formato JSON (un array de cómics)
  const comics = await response.json();
  
  // Obtiene la referencia al cuerpo de la tabla donde se mostrarán los cómics
  const tbody = document.querySelector('#comics-table tbody');

  // Limpia cualquier contenido previo de la tabla (en caso de que ya haya datos)
  tbody.innerHTML = '';

  // Itera sobre cada cómic y crea una fila en la tabla
  comics.forEach(comic => {
    const tr = document.createElement('tr');  // Crea una nueva fila de tabla
    tr.innerHTML = `
      <td>${comic.id}</td>           <!-- Muestra el ID del cómic -->
      <td>${comic.titulo}</td>       <!-- Muestra el título del cómic -->
      <td>${comic.autor}</td>        <!-- Muestra el autor del cómic -->
      <td>${comic.editorial}</td>    <!-- Muestra la editorial del cómic -->
      <td>${comic.genero}</td>       <!-- Muestra el género del cómic -->
      <td>${comic.precio}</td>       <!-- Muestra el precio del cómic -->
      <td>${comic.stock}</td>        <!-- Muestra el stock disponible del cómic -->
      <td>
        <!-- Botón de edición, al hacer clic llama a la función editComic pasando el ID -->
        <button class="edit" onclick="editComic(${comic.id})">Editar</button>
        <!-- Botón de eliminación, al hacer clic llama a la función deleteComic pasando el ID -->
        <button class="delete" onclick="deleteComic(${comic.id})">Eliminar</button>
      </td>
    `;
    // Añade la fila creada a la tabla
    tbody.appendChild(tr);
  });
}

// Función para guardar o actualizar un cómic
async function saveComic(event) {
  event.preventDefault();  // Evita que el formulario se envíe de la manera tradicional (recarga de página)

  // Obtiene el ID del cómic del campo del formulario (si existe, es un cómic existente)
  const id = document.getElementById('comic-id').value;

  // Crea un objeto con los datos del cómic a guardar o actualizar
  const comic = {
    titulo: document.getElementById('titulo').value,      // Obtiene el título del cómic
    autor: document.getElementById('autor').value,        // Obtiene el autor del cómic
    editorial: document.getElementById('editorial').value,// Obtiene la editorial del cómic
    genero: document.getElementById('genero').value,      // Obtiene el género del cómic
    precio: parseFloat(document.getElementById('precio').value), // Obtiene el precio y lo convierte a número
    stock: parseInt(document.getElementById('stock').value), // Obtiene el stock y lo convierte a entero
    imagen: document.getElementById('imagen').value       // Obtiene la URL de la imagen del cómic
  };

  // Determina si se va a hacer una solicitud PUT (actualización) o POST (creación)
  const method = id ? 'PUT' : 'POST';

  // Establece la URL de la API para el cómic, si hay ID, se usa PUT para actualizar, sino, POST para crear
  const url = id ? `${API_URL}/${id}` : API_URL;

  // Realiza la solicitud a la API con el método correspondiente (POST/PUT)
  await fetch(url, {
    method, // El método HTTP (POST o PUT)
    headers: { 'Content-Type': 'application/json' }, // El tipo de contenido que se va a enviar
    body: JSON.stringify(comic)  // Convierte el objeto comic a formato JSON
  });

  // Resetea el formulario para que esté vacío después de enviar
  form.reset();

  // Recarga la lista de cómics para reflejar el cambio realizado
  loadComics();
}

// Función para eliminar un cómic
async function deleteComic(id) {
  // Muestra un cuadro de confirmación antes de eliminar
  if (confirm('¿Estás seguro de eliminar este cómic?')) {
    
    // Si el usuario confirma, realiza una solicitud DELETE a la API para eliminar el cómic
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    // Recarga la lista de cómics para reflejar la eliminación
    loadComics();
  }
}

// Función para cargar los datos de un cómic en el formulario de edición
async function editComic(id) {
  
  // Realiza una solicitud GET a la API para obtener los datos del cómic específico por ID
  const response = await fetch(`${API_URL}/${id}`);

  // Convierte la respuesta en un objeto JSON que contiene los datos del cómic
  const comic = await response.json();

  // Rellena el formulario con los datos del cómic seleccionado
  document.getElementById('comic-id').value = comic.id;          // Establece el ID del cómic en el formulario
  document.getElementById('titulo').value = comic.titulo;        // Establece el título del cómic en el formulario
  document.getElementById('autor').value = comic.autor;          // Establece el autor del cómic en el formulario
  document.getElementById('editorial').value = comic.editorial;  // Establece la editorial en el formulario
  document.getElementById('genero').value = comic.genero;        // Establece el género en el formulario
  document.getElementById('precio').value = comic.precio;        // Establece el precio en el formulario
  document.getElementById('stock').value = comic.stock;          // Establece el stock en el formulario
  document.getElementById('imagen').value = comic.imagen;        // Establece la URL de la imagen en el formulario
}


/**
 * Variables y Eventos Iniciales:
 * 
 * API_URL almacena la ruta de la API para interactuar con los cómics.
 * 
 * DOMContentLoaded: Se asegura de que todo el contenido HTML esté cargado antes de ejecutar 
 * cualquier código JavaScript. En este caso, se llama a loadComics() para cargar la lista de 
 * cómics y se agrega el manejador de eventos al formulario de cómics para que se guarde o 
 * actualice un cómic cuando se envíe el formulario.
 * 
 * loadComics():
 * Realiza una solicitud GET a la API para obtener todos los cómics y luego muestra cada cómic 
 * en una fila de la tabla. Cada cómic tiene botones para editar o eliminar.
 * 
 * saveComic(event):
 * Se ejecuta cuando se envía el formulario. Recoge los datos del formulario, crea un objeto comic, 
 * y luego decide si hacer una solicitud POST (crear un nuevo cómic) o PUT 
 * (actualizar un cómic existente). Después de enviar los datos, recarga la lista de cómics y 
 * resetea el formulario.
 * 
 * deleteComic(id):
 * Al pulsar el botón "Eliminar", solicita confirmación al usuario y, si el usuario confirma, hace 
 * una solicitud DELETE para eliminar el cómic de la base de datos. Después recarga la lista de cómics.
 * 
 * editComic(id):
 * Al pulsar "Editar", hace una solicitud GET a la API para obtener los datos del cómic seleccionado 
 * por id. Luego, estos datos se cargan en el formulario para permitir su edición.
 */
// Importa la configuración de conexión a la base de datos desde el archivo db.js
const pool = require('../config/db.js');

// Función asincrónica para obtener todos los cómics
/**
 * La sintaxis [rows] es desestructuración de arreglos. Aquí, solo se extrae el primer elemento 
 * del arreglo (los registros), ignorando el resto.
 * ¿Qué hace exactamente esta línea?
 * Llama a pool.query() para ejecutar la consulta SQL 'SELECT * FROM comics'.
 * Espera a que se resuelva la promesa devuelta por pool.query().
 * Extrae los registros obtenidos (el primer elemento del resultado de la promesa) y los asigna a 
 * la variable rows.
 * ¿Por qué se utiliza await aquí?
 * Sin await, la ejecución de la función no esperaría a que se complete la consulta, y el código 
 * pasaría a la siguiente línea antes de que la base de datos responda.
 * Esto podría dar lugar a errores, ya que se intentarían usar datos que aún no se han recibido.
 * Con await, garantizas que rows contenga los registros antes de continuar.
 */
async function getAllComics() {
  // Ejecuta una consulta SQL para seleccionar todos los registros de la tabla "comics"
  const [rows] = await pool.query('SELECT * FROM comics');
  // Devuelve las filas obtenidas como resultado de la consulta
  return rows;
}

// Función asincrónica para obtener un cómic específico por su ID
async function getComicById(id) {
  // Ejecuta una consulta SQL para seleccionar un cómic cuyo ID coincida con el parámetro proporcionado
  const [rows] = await pool.query('SELECT * FROM comics WHERE id = ?', [id]);
  // Devuelve el primer (y único) registro encontrado, o undefined si no existe
  return rows[0];
}

// Función asincrónica para insertar un nuevo cómic en la base de datos
async function addComic(comic) {
  // Extrae los campos del objeto comic recibido como parámetro
  const { titulo, autor, editorial, genero, precio, stock, imagen } = comic;
  // Ejecuta una consulta SQL para insertar un nuevo registro en la tabla "comics" con los valores proporcionados
  const [result] = await pool.query(
    'INSERT INTO comics (titulo, autor, editorial, genero, precio, stock, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [titulo, autor, editorial, genero, precio, stock, imagen]
  );
  // Devuelve el ID del nuevo registro insertado, generado automáticamente por la base de datos
  return result.insertId;
}

// Función asincrónica para actualizar un cómic existente en la base de datos por su ID
async function updateComic(id, comic) {
  // Extrae los campos del objeto comic recibido como parámetro
  const { titulo, autor, editorial, genero, precio, stock, imagen } = comic;
  // Ejecuta una consulta SQL para actualizar los campos del registro que coincide con el ID proporcionado
  const [result] = await pool.query(
    'UPDATE comics SET titulo = ?, autor = ?, editorial = ?, genero = ?, precio = ?, stock = ?, imagen = ? WHERE id = ?',
    [titulo, autor, editorial, genero, precio, stock, imagen, id]
  );
  // Devuelve el número de filas afectadas (1 si se actualizó correctamente, 0 si no se encontró el registro)
  return result.affectedRows;
}

// Función asincrónica para eliminar un cómic de la base de datos por su ID
async function deleteComic(id) {
  // Ejecuta una consulta SQL para eliminar el registro que coincide con el ID proporcionado
  const [result] = await pool.query('DELETE FROM comics WHERE id = ?', [id]);
  // Devuelve el número de filas afectadas (1 si se eliminó correctamente, 0 si no se encontró el registro)
  return result.affectedRows;
}

// Exporta todas las funciones definidas en este módulo para que puedan ser utilizadas en otras partes de la aplicación
module.exports = {
  getAllComics,  // Exporta la función para obtener todos los cómics
  getComicById,  // Exporta la función para obtener un cómic por ID
  addComic,      // Exporta la función para agregar un nuevo cómic
  updateComic,   // Exporta la función para actualizar un cómic existente
  deleteComic,   // Exporta la función para eliminar un cómic por ID
};

/**
 * Consideraciones:
 * Estas funciones usan promesas con async/await para manejar operaciones asíncronas.
 * La variable pool representa la conexión a la base de datos, configurada en un archivo externo (db.js).
 * Los ? en las consultas SQL se utilizan como marcadores de posición, protegidos contra inyecciones SQL.
 */
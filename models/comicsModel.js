const pool = require('../config/db.js');

// Obtener todos los cómics
async function getAllComics() {
  const [rows] = await pool.query('SELECT * FROM comics');
  return rows;
}

// Obtener un cómic por ID
async function getComicById(id) {
  const [rows] = await pool.query('SELECT * FROM comics WHERE id = ?', [id]);
  return rows[0];
}

// Insertar un nuevo cómic
async function addComic(comic) {
  const { titulo, autor, editorial, genero, precio, stock, imagen } = comic;
  const [result] = await pool.query(
    'INSERT INTO comics (titulo, autor, editorial, genero, precio, stock, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [titulo, autor, editorial, genero, precio, stock, imagen]
  );
  return result.insertId;
}

// Actualizar un cómic por ID
async function updateComic(id, comic) {
  const { titulo, autor, editorial, genero, precio, stock, imagen } = comic;
  const [result] = await pool.query(
    'UPDATE comics SET titulo = ?, autor = ?, editorial = ?, genero = ?, precio = ?, stock = ?, imagen = ? WHERE id = ?',
    [titulo, autor, editorial, genero, precio, stock, imagen, id]
  );
  return result.affectedRows;
}

// Eliminar un cómic por ID
async function deleteComic(id) {
  const [result] = await pool.query('DELETE FROM comics WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = {
  getAllComics,
  getComicById,
  addComic,
  updateComic,
  deleteComic,
};

// Importa el modelo de datos de los cómics, que contiene las funciones para interactuar con la base de datos.
const comicsModel = require('../models/comicsModel.js');

// Función asíncrona para obtener todos los cómics de la base de datos.
async function getAllComics(req, res) {
  try {
    // Llama al método getAllComics del modelo para obtener todos los cómics.
    const comics = await comicsModel.getAllComics();
    // Devuelve los cómics obtenidos como respuesta en formato JSON.
    res.json(comics);
  } catch (error) {
    // Maneja errores devolviendo un estado HTTP 500 (Error interno del servidor) y un mensaje descriptivo en formato JSON.
    res.status(500).json({ message: 'Error al obtener los cómics', error });
  }
}

// Función asíncrona para obtener un cómic específico por su ID.
async function getComicById(req, res) {
  try {
    // Obtiene el ID de los parámetros de la solicitud y lo pasa al método del modelo.
    const comic = await comicsModel.getComicById(req.params.id);
    // Si no se encuentra un cómic con ese ID, devuelve un estado HTTP 404 (No encontrado) con un mensaje.
    if (!comic) return res.status(404).json({ message: 'Cómic no encontrado' });
    // Devuelve el cómic encontrado como respuesta en formato JSON.
    res.json(comic);
  } catch (error) {
    // Maneja errores devolviendo un estado HTTP 500 y un mensaje descriptivo en JSON.
    res.status(500).json({ message: 'Error al obtener el cómic', error });
  }
}

// Función asíncrona para añadir un nuevo cómic.
async function addComic(req, res) {
  try {
    // Llama al método addComic del modelo y le pasa el cuerpo de la solicitud (datos del cómic).
    const newComicId = await comicsModel.addComic(req.body);
    // Devuelve un estado HTTP 201 (Creado) con un mensaje y el ID del nuevo cómic creado.
    res.status(201).json({ message: 'Cómic añadido', id: newComicId });
  } catch (error) {
    // Maneja errores devolviendo un estado HTTP 500 y un mensaje descriptivo en JSON.
    res.status(500).json({ message: 'Error al añadir el cómic', error });
  }
}

// Función asíncrona para actualizar un cómic existente por su ID.
async function updateComic(req, res) {
  try {
    // Llama al método updateComic del modelo, pasando el ID del cómic y los datos nuevos (cuerpo de la solicitud).
    const updatedRows = await comicsModel.updateComic(req.params.id, req.body);
    // Si no se actualiza ninguna fila, devuelve un estado HTTP 404 con un mensaje indicando que no se encontró el cómic.
    if (!updatedRows) return res.status(404).json({ message: 'Cómic no encontrado' });
    // Devuelve un mensaje indicando que el cómic fue actualizado exitosamente.
    res.json({ message: 'Cómic actualizado' });
  } catch (error) {
    // Maneja errores devolviendo un estado HTTP 500 y un mensaje descriptivo en JSON.
    res.status(500).json({ message: 'Error al actualizar el cómic', error });
  }
}

// Función asíncrona para eliminar un cómic por su ID.
async function deleteComic(req, res) {
  try {
    // Llama al método deleteComic del modelo, pasando el ID del cómic que se quiere eliminar.
    const deletedRows = await comicsModel.deleteComic(req.params.id);
    // Si no se elimina ninguna fila, devuelve un estado HTTP 404 con un mensaje indicando que no se encontró el cómic.
    if (!deletedRows) return res.status(404).json({ message: 'Cómic no encontrado' });
    // Devuelve un mensaje indicando que el cómic fue eliminado exitosamente.
    res.json({ message: 'Cómic eliminado' });
  } catch (error) {
    // Maneja errores devolviendo un estado HTTP 500 y un mensaje descriptivo en JSON.
    res.status(500).json({ message: 'Error al eliminar el cómic', error });
  }
}

// Exporta todas las funciones definidas en este archivo como un objeto.
// Esto permite que otras partes de la aplicación (como las rutas) puedan utilizarlas.
module.exports = {
  getAllComics,   // Función para obtener todos los cómics.
  getComicById,   // Función para obtener un cómic por ID.
  addComic,       // Función para añadir un nuevo cómic.
  updateComic,    // Función para actualizar un cómic por ID.
  deleteComic,    // Función para eliminar un cómic por ID.
};

/**
 * Explicación detallada:
 * Propósito general: Este archivo es un controlador que actúa como intermediario entre las rutas 
 * y la lógica de la aplicación. Traduce las solicitudes del cliente en operaciones que 
 * interactúan con la base de datos. Devuelve las respuestas adecuadas al cliente, manejando 
 * posibles errores.
 * 
 * Estructura:
 * Cada función se corresponde con una operación CRUD (Create, Read, Update, Delete).
 * Manejan parámetros (req.params) y datos de entrada (req.body) que provienen de las solicitudes HTTP.
 * 
 * Gestión de errores:
 * Todas las funciones están envueltas en bloques try-catch para capturar y gestionar errores de forma segura.
 * 
 * Exportación:
 * Al exportar las funciones, se permite su uso en otros archivos, como las rutas de la API. Esto mantiene la aplicación modular y organizada.
 */
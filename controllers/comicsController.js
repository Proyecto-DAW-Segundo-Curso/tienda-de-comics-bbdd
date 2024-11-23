const comicsModel = require('../models/comicsModel.js');

async function getAllComics(req, res) {
  try {
    const comics = await comicsModel.getAllComics();
    res.json(comics);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cómics', error });
  }
}

async function getComicById(req, res) {
  try {
    const comic = await comicsModel.getComicById(req.params.id);
    if (!comic) return res.status(404).json({ message: 'Cómic no encontrado' });
    res.json(comic);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cómic', error });
  }
}

async function addComic(req, res) {
  try {
    const newComicId = await comicsModel.addComic(req.body);
    res.status(201).json({ message: 'Cómic añadido', id: newComicId });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el cómic', error });
  }
}

async function updateComic(req, res) {
  try {
    const updatedRows = await comicsModel.updateComic(req.params.id, req.body);
    if (!updatedRows) return res.status(404).json({ message: 'Cómic no encontrado' });
    res.json({ message: 'Cómic actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cómic', error });
  }
}

async function deleteComic(req, res) {
  try {
    const deletedRows = await comicsModel.deleteComic(req.params.id);
    if (!deletedRows) return res.status(404).json({ message: 'Cómic no encontrado' });
    res.json({ message: 'Cómic eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cómic', error });
  }
}

module.exports = {
  getAllComics,
  getComicById,
  addComic,
  updateComic,
  deleteComic,
};

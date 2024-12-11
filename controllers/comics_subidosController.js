const comics_subidosModel = require ('../models/comics_subidosModel.js')

async function getAllUploadedComics (req,res){
    try {
        const uploadedComic = await comics_subidosModel.getAllUploadedComics();
        res.json(uploadedComic);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los comics subidos',error})
    }
}

async function getComicSubidoById (req,res){
    try {
        const csById = await comics_subidosModel.getComicSubidoById(req.params.id);
        res.json(csById);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el comic subido',error})
    }
}

async function addUploadedComic (req,res){
    try {
        const NewUploadedComic = await comics_subidosModel.addComicSubido(req.body);
        res.status(201).json({message: 'Comic subido con exito', id:NewUploadedComic});

    } catch (error) {
        res.status(500).json({message: 'Error al subir el comic',error})
    }
}

async function updateUploadedComic (req,res){
    try {
        const updatedRows = await comics_subidosModel.updateUploadedComic( req.params.id,req.body);
        if(!updatedRows) return res.status(404).json({message: 'Comic subido no encontrado'});
        res.json({message:'Tu comic subido ha sido actualizado'});
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar tu comic subido',error})
    }
}

async function deleteUploadedComic (req,res){
    try {
        const updatedRows = await comics_subidosModel.deleteUploadedComic(req.params.id)
        if(!updatedRows)return res.status(404).json({message: 'Comic seleccionado no encontrado'});
        res.json({message: 'Comic subido eliminado'})
    } catch (error) {
        res.status(500).json({message: 'error al eliminar el comic subido',error})
    }
}

module.exports = {
    getAllUploadedComics,
    getComicSubidoById,
    addUploadedComic,
    updateUploadedComic,
    deleteUploadedComic
}
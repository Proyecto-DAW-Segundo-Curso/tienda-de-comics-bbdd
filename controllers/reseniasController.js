const reseniasModel = require('../models/reseniasModel.js')

async function addResenia (req,res){
    try {
        const newResenia = await reseniasModel.addResenia(req.body);
        res.status(201).json({message: 'resenia agregada', id: newResenia})
    } catch (error) {
        res.status(500).json({message: 'Error al añadir la resenia',error})
    }
}

async function updateResenia (req,res){
    try {
        const updatedRows = await reseniasModel.updateResenia(req.params.id, req.body);
        if(!updatedRows)return res.status(404).json({message: 'resenia no encontrada'})
        res.json({message: 'resenia actualizada'})    
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar la resenia'})
    }
}

async function getReseniasById (req,res){
    try {
        const resenia = await reseniasModel.getReseniasById(req.params.id);
        if(!resenia) return res.status(404).json({message:'resenia no encontrada'});
        res.json(resenia);
    } catch (error) {
        res.status(500).json({message:'Error al obtener la resenia',error})
    }
}

async function deleteResenia (req,res){
    try {
        const deletedRows = await reseniasModel.deleteResenia(req.params.id);
        if(!deletedRows) return res.status(404).json({message: 'resenia no encontrada'});
        return res.json({message: 'Error al eliminar la resenia',error})
    } catch (error) {
        res.status(500).json({message: 'Error al eliminar la resenia', error})
    }
}

module.exports={
    addResenia,
    updateResenia,
    getReseniasById,
    deleteResenia
}
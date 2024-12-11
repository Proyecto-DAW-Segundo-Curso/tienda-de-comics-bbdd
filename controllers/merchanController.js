const merchanModel = require  ('../models/merchanModel.js')


async function getAllMerchan (req,res){
    try{
        const merchan = await merchanModel.getAllMerchan();
        res.json(merchan);

    }catch(error){
        res.status(500).json({message: 'Error al obtener el listado de merchan',error})
        
    }
    
}

async function getMerchanById (req,res){
    try{
        const merchan = await merchanModel.getMerchanById(req.params.id);

        if(!merchan) return res.status(404).json({message: 'merchan no encontrado'})

        res.json(merchan);    
    }catch(error){
        res.status(500).json({message: 'Error al obtener el merchan', error})
    }
}

async function addMerchan (req,res){
    try{
        const newMerchanId = await merchanModel.addMerchan(req.body);
        res.status(201).json({message: 'Merchan añadido', id: newMerchanId})
    }catch(error){
        res.status(500).json ({message: 'Error al añadir el merchan',error})
    }
}

async function updateMerchan (req,res){
    try{
        const updatedRows = await merchanModel.updateMerchan(req.params.id, req.body);
        if(!updatedRows) return res.status(404).json({message: 'merchan no encontrado'})
        res.json({message: 'merchan actualizado'})    
    }catch(error){
        res.status(500).json({message: 'Error al actualizar el merchan',error})
    }
}

async function deleteMerchan (req,res){
    try{
        const deletedRows = await merchanModel.deleteMerchan(req.params.id);
        if(!deletedRows) return res.status(404).json({message: 'Merchan no encontrado'})
        res.json({message: 'merchan eliminado'})    
    }catch(error){
        res.status(500).json({message: 'Error al eliminar el merchan',error})
    }
}

module.exports = {
    getAllMerchan,
    getMerchanById,
    addMerchan,
    updateMerchan,
    deleteMerchan
}
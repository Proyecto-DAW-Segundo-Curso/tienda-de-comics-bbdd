const ventaModel = require('../models/ventasModel.js'); 

async function getAllVentas (req,res){
    try{
        const venta = await ventaModel.getAllVentas();
        res.json(venta)
    }catch(error){
        res.status(500).json({message: 'Error al obtener los usuarios',error})
    }
}

async function getVentasById (req,res){
    try{
        const venta = await ventaModel.getVentasById(req.params.id)

        if(!venta)return res.status(404).json({message: 'venta no encontrada'})

        res.json(venta)    
    }catch(error){
        res.status(500).json({message: 'error al obtener venta',error})
    }
}

async function addVenta(req, res) {
  
  const { usuario_id, comic_id, merchan_id, cantidad } = req.body;

  try {
    // Validar que los datos necesarios están presentes
    if (!usuario_id || (!comic_id && !merchan_id)) {
      return res.status(400).json({ message: 'Faltan datos requeridos: usuario_id y comic_id o merchan_id' });
    }

    const nuevaVentaId = await ventaModel.addVenta(req.body);

    return res.status(201).json({ message: 'Venta registrada exitosamente', venta_id: nuevaVentaId });
  } catch (error) {
   
    return res.status(500).json({ message: 'Error al registrar la venta', error: error.message });
  }
}

module.exports = {
  getAllVentas,  
  getVentasById,
  addVenta,
};


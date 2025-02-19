const ventaModel = require('../models/ventasModel.js');
const jwt = require('jsonwebtoken');

async function getAllVentas(req, res) {
  try {
    const venta = await ventaModel.getAllVentas();
    res.json(venta)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error })
  }
}

async function getVentasById(req, res) {
  try {
    const venta = await ventaModel.getVentasById(req.params.id)

    if (!venta) return res.status(404).json({ message: 'venta no encontrada' })

    res.json(venta)
  } catch (error) {
    res.status(500).json({ message: 'error al obtener venta', error })
  }
}

async function getVentasByUsuario(req, res) {
  try {
    const venta = await ventaModel.getVentasByUsuario(req.params.id)

    if (!venta) return res.status(404).json({ message: 'venta no encontrada' })

    res.json(venta)
  } catch (error) {
    res.status(500).json({ message: 'error al obtener venta', error })
  }
}

async function getAllVentasWithUsuarioComic(req, res) {
  try {
    const venta = await ventaModel.getAllVentasWithUsuarioComic(req.params.id)

    if (!venta) return res.status(404).json({ message: 'venta no encontrada' })

    res.json(venta)
  } catch (error) {
    res.status(500).json({ message: 'error al obtener venta', error })
  }
}

async function realizarVenta(req, res) {
  try {
    const ventas = req.body;  // <-- Aquí es donde se accede a los items

    // Verifica que ventas sea un array
    if (!Array.isArray(ventas)) {
      console.log('El cuerpo de la solicitud no contiene un array en "items":', req.body);
      return res.status(400).json({ error: '"items" debe ser un array.' });
    }

    const usuario_id = req.user.id;
    const id_venta = Date.now() + Math.floor(Math.random() * 1000);
    const fecha_venta = new Date();

    // Procesa cada item de la venta
    for (const item of ventas) {
      const { id, cantidad, precio } = item;
      const total = cantidad * precio;

      // Agrega un console.log para depurar
      console.log('Procesando venta:', { id_venta, usuario_id, id, fecha_venta, cantidad, total });

      // Llama a las funciones del modelo para registrar la venta y actualizar el stock
      await ventaModel.addVenta({ id_venta, usuario_id, comic_id: id, fecha_venta, cantidad, total });
      await ventaModel.updateStock(id, cantidad);
    }

    res.status(201).json({ message: 'Venta realizada con éxito' });
  } catch (error) {
    console.error('Error al realizar la venta:', error);
    res.status(500).json({ error: 'Error al procesar la venta', detalles: error.message });
  }
}

module.exports = {
  getAllVentas,
  getVentasById,
  realizarVenta,
  getAllVentasWithUsuarioComic,
  getVentasByUsuario,
};

// Instrucciones para probar la API de ventas con Postman

/*
1. Abre Postman.
2. Crea una nueva solicitud (New Request).
3. Método: POST.
4. URL: http://localhost:3001/api/ventas (o el puerto donde esté corriendo tu servidor).
5. En la pestaña "Headers":
   - Key: Authorization
   - Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJydWJlbkBnbWFpbC5jb20iLCJwZXJtaXNvIjoxLCJpYXQiOjE3Mzk1NTIwNDQsImV4cCI6MTczOTU1NTY0NH0.PlAXtClBmMa_3K4MvxJBPyoVMKsjwITYOMZ-w1jONDU

6. En la pestaña "Body":
   - Selecciona "raw" y formato JSON.
   - Agrega un JSON con los datos de los cómics, por ejemplo:
     [
       {
         "id": 1,
         "cantidad": 2,
         "precio": 15.00
       },
       {
         "id": 2,
         "cantidad": 1,
         "precio": 20.00
       }
     ]

7. Haz clic en "Send" para enviar la solicitud.
8. Verifica la respuesta en la pestaña "Body" de Postman.
*/

// Importa el módulo 'express', que se utiliza para crear y gestionar aplicaciones web y APIs en Node.js.
const express = require('express');

// Crea un enrutador de Express. Este enrutador nos permite definir rutas específicas para los ventas.
const router = express.Router();

// Importa el controlador de ventas, que contiene las funciones que manejan la lógica de negocio
// asociada a cada ruta (como obtener, añadir, actualizar o eliminar ventas).
const ventasController = require('../controllers/ventasController');

// Importa el middleware de autenticación, que se utiliza para proteger las rutas que requieren autenticación.
const authMiddleware = require('../middlewares/authMiddlewares');

// Define una ruta GET para obtener todos los ventas.
// Cuando el cliente envía una solicitud GET a '/', se ejecuta la función `getAllventas` del controlador.
router.get('/ventas', ventasController.getAllVentas);

// Define una ruta POST para procesar una venta.
// Esta ruta espera que el cliente envíe los datos de la venta en el cuerpo de la solicitud.
// La función `procesarVenta` del controlador maneja esta solicitud.
router.post('/ventas', authMiddleware, ventasController.realizarVenta);

// Define una ruta GET para obtener un venta específico por su ID.
// El parámetro dinámico `:id` captura el ID proporcionado en la URL.
// La función `getComicById` del controlador maneja esta solicitud.
router.get('/venta/:id', ventasController.getVentasById);

// Exporta el enrutador para que pueda ser utilizado en otros archivos (por ejemplo, en el archivo principal de la aplicación).
module.exports = router;

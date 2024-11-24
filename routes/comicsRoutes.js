// Importa el módulo 'express', que se utiliza para crear y gestionar aplicaciones web y APIs en Node.js.
const express = require('express');

// Importa el controlador de cómics, que contiene las funciones que manejan la lógica de negocio
// asociada a cada ruta (como obtener, añadir, actualizar o eliminar cómics).
const comicsController = require('../controllers/comicsController');

// Crea un enrutador de Express. Este enrutador nos permite definir rutas específicas para los cómics.
const router = express.Router();

// Define una ruta GET para obtener todos los cómics.
// Cuando el cliente envía una solicitud GET a '/', se ejecuta la función `getAllComics` del controlador.
router.get('/', comicsController.getAllComics);

// Define una ruta GET para obtener un cómic específico por su ID.
// El parámetro dinámico `:id` captura el ID proporcionado en la URL.
// La función `getComicById` del controlador maneja esta solicitud.
router.get('/:id', comicsController.getComicById);

// Define una ruta POST para añadir un nuevo cómic.
// Esta ruta espera que el cliente envíe los datos del nuevo cómic en el cuerpo de la solicitud.
// La función `addComic` del controlador maneja esta solicitud.
router.post('/', comicsController.addComic);

// Define una ruta PUT para actualizar un cómic existente por su ID.
// Similar a la ruta GET por ID, captura el ID de la URL y espera los datos actualizados en el cuerpo de la solicitud.
// La función `updateComic` del controlador maneja esta solicitud.
router.put('/:id', comicsController.updateComic);

// Define una ruta DELETE para eliminar un cómic por su ID.
// Captura el ID de la URL y utiliza la función `deleteComic` del controlador para manejar la solicitud.
router.delete('/:id', comicsController.deleteComic);

// Exporta el enrutador para que pueda ser utilizado en otros archivos (por ejemplo, en el archivo principal de la aplicación).
module.exports = router;

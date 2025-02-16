const express = require('express');
const router = express.Router();
const comicsSubidosUsuarioController = require('../controllers/comics_subidos_usuarioController.js');
const verifyToken = require('../middlewares/authMiddlewares.js'); // Middleware de autenticación

// Nueva ruta para obtener todos los intercambios
router.get('/intercambios', comicsSubidosUsuarioController.getAllIntercambios);
router.get('/comics-subidos-usuario', verifyToken,  comicsSubidosUsuarioController.getAllComicsSubidosUsuario);
router.get('/comics-subidos-usuario/:id', verifyToken,  comicsSubidosUsuarioController.getComicSubidoUsuarioById);
router.post('/comics-subidos-usuario', verifyToken, comicsSubidosUsuarioController.addComicSubidoUsuario);
router.put('/comics-subidos-usuario/:id', verifyToken, comicsSubidosUsuarioController.updateComicSubidoUsuario);
router.delete('/comics-subidos-usuario/:id', verifyToken, comicsSubidosUsuarioController.deleteComicSubidoUsuario);
router.post('/comics-subidos-usuario/ofertar', verifyToken, comicsSubidosUsuarioController.ofertarComic);


module.exports = router;

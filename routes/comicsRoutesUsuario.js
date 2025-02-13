const express = require('express');
const router = express.Router();
const comicsSubidosUsuarioController = require('../controllers/comics_subidos_usuarioController.js');
const verifyToken = require('../middlewares/authMiddlewares.js'); // Middleware de autenticación


router.get('/comics-subidos-usuario', verifyToken,  comicsSubidosUsuarioController.getAllComicsSubidosUsuario);
router.get('/comics-subidos-usuario/:id', verifyToken,  comicsSubidosUsuarioController.getComicSubidoUsuarioById);
router.post('/comics-subidos-usuario', verifyToken, comicsSubidosUsuarioController.addComicSubidoUsuario);
router.put('/comics-subidos-usuario/:id', verifyToken, comicsSubidosUsuarioController.updateComicSubidoUsuario);
router.delete('/comics-subidos-usuario/:id', verifyToken, comicsSubidosUsuarioController.deleteComicSubidoUsuario);

module.exports = router;

const express = require('express');
const router = express.Router();
const comicsSubidosUsuarioController = require('../controllers/comics_subidos_usuarioController.js');
const intercambioModel = require('../models/intercambioModel.js');
const verifyToken = require('../middlewares/authMiddlewares.js'); // Middleware de autenticación

// Nueva ruta para obtener todos los intercambios
router.get('/intercambios', async (req, res) => {
    try {
        const intercambios = await intercambioModel.getAllIntercambios();
        res.json(intercambios);
    } catch (error) {
        console.error("❌ Error al obtener las ofertas:", error);
        res.status(500).json({ message: "Error al obtener las ofertas", error: error.message });
    }
});


router.get('/comics-subidos-usuario', verifyToken,  comicsSubidosUsuarioController.getAllComicsSubidosUsuario);
router.get('/comics-subidos-usuario/:id', verifyToken,  comicsSubidosUsuarioController.getComicSubidoUsuarioById);
router.post('/comics-subidos-usuario', verifyToken, comicsSubidosUsuarioController.addComicSubidoUsuario);
router.put('/comics-subidos-usuario/:id', verifyToken, comicsSubidosUsuarioController.updateComicSubidoUsuario);
router.delete('/comics-subidos-usuario/:id', verifyToken, comicsSubidosUsuarioController.deleteComicSubidoUsuario);
router.post('/comics-subidos-usuario/ofertar', verifyToken, comicsSubidosUsuarioController.ofertarComic);


module.exports = router;

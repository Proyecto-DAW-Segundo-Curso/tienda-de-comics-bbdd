const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddlewares.js');
const chatController = require('../controllers/chatController.js');

// Ruta para iniciar un nuevo chat
router.post('/chat', verifyToken, chatController.iniciarChat);

// Ruta para obtener los chats de un usuario
router.get('/chat', verifyToken, chatController.obtenerChats);

// Ruta para enviar un mensaje en un chat
router.post('/chat/mensaje', verifyToken, chatController.enviarMensaje);

// Ruta para obtener los mensajes de un chat específico
router.get('/chat/mensajes/:chat_id', verifyToken, chatController.obtenerMensajes);

// Ruta para aceptar un intercambio en un chat
router.post('/chat/aceptar', verifyToken, chatController.aceptarIntercambio);

// Ruta para rechazar un intercambio y eliminar el chat
router.post('/chat/rechazar', verifyToken, chatController.rechazarIntercambio);

// Ruta para obtener los detalles de un chat específico
router.get('/chat/detalles/:id', verifyToken, chatController.obtenerDetallesChat);

// Ruta para marcar los mensajes de un chat como leídos
router.put('/chat/marcar-leidos/:chat_id', verifyToken, chatController.marcarMensajesLeidos);

module.exports = router;

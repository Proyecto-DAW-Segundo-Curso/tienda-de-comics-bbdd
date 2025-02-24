const chatModel = require('../models/chatModel.js');
const pool = require('../config/db.js');

// Función para iniciar un nuevo chat
async function iniciarChat(req, res) {
    try {
        const { vendedor_id, comprador_id, comic_id } = req.body;

        // Verificar que todos los datos necesarios están presentes
        if (!vendedor_id || !comprador_id || !comic_id) {
            return res.status(400).json({ message: "Faltan datos para iniciar el chat." });
        }

        // Crear un nuevo chat en la base de datos
        const chatId = await chatModel.crearChat(comprador_id, vendedor_id, comic_id);

        // Verificar si el chat fue creado correctamente
        if (!chatId) {
            return res.status(500).json({ message: "Error al crear el chat." });
        }

        // Responder con el ID del nuevo chat
        res.status(201).json({ chat_id: chatId });
    } catch (error) {
        console.error("🔥 Error en iniciarChat:", error.message);
        res.status(500).json({ message: "Error al iniciar el chat", error: error.message });
    }
}

// Función para obtener los chats de un usuario
async function obtenerChats(req, res) {
    try {
        const usuario_id = req.user.id;
        const chats = await chatModel.obtenerChats(usuario_id);
        res.json(chats);
    } catch (error) {
        console.error("🔥 Error en obtenerChats (Controlador):", error.message);
        res.status(500).json({ message: "Error al obtener los chats", error: error.message });
    }
}

// Función para enviar un mensaje en un chat
async function enviarMensaje(req, res) {
    try {
        const { chat_id, mensaje } = req.body;
        const usuario_id = req.user.id;

        await chatModel.enviarMensaje(chat_id, usuario_id, mensaje);
        res.json({ message: "Mensaje enviado" });
    } catch (error) {
        res.status(500).json({ message: "Error al enviar mensaje", error: error.message });
    }
}

// Función para obtener los mensajes de un chat
async function obtenerMensajes(req, res) {
    try {
        const { chat_id } = req.params;
        const mensajes = await chatModel.obtenerMensajes(chat_id);

        // Devolver un array vacío si no hay mensajes
        if (!mensajes.length) {
            return res.json([]);
        }

        res.json(mensajes);
    } catch (error) {
        console.error(" Error al obtener mensajes:", error.message);
        res.status(500).json({ message: "Error al obtener mensajes", error: error.message });
    }
}

// Función para marcar los mensajes de un chat como leídos
async function marcarMensajesLeidos(req, res) {
    try {
        const { chat_id } = req.params;
        const usuario_id = req.user.id;

        await chatModel.marcarMensajesComoLeidos(chat_id, usuario_id);
        res.json({ message: "Mensajes marcados como leídos" });
    } catch (error) {
        console.error("🔥 Error en marcarMensajesLeidos (Controlador):", error.message);
        res.status(500).json({ message: "Error al marcar los mensajes como leídos", error: error.message });
    }
}

// Función para aceptar un intercambio en un chat
async function aceptarIntercambio(req, res) {
    try {
        const { chat_id } = req.body;
        const usuario_id = req.user.id;

        const resultado = await chatModel.aceptarIntercambio(chat_id, usuario_id);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Error al aceptar el intercambio", error: error.message });
    }
}

// Función para rechazar un intercambio y eliminar el chat
async function rechazarIntercambio(req, res) {
    try {
        const { chat_id } = req.body;

        // Verificar si el chat existe
        const [chat] = await pool.query('SELECT * FROM chats WHERE id = ?', [chat_id]);
        if (!chat.length) {
            return res.status(404).json({ message: "Chat no encontrado." });
        }

        console.log("✅ Chat encontrado. Procediendo a eliminar...");

        // Eliminar mensajes relacionados con el chat
        await pool.query('DELETE FROM mensajes WHERE chat_id = ?', [chat_id]);

        // Eliminar el chat
        await pool.query('DELETE FROM chats WHERE id = ?', [chat_id]);

        console.log("✅ Chat eliminado correctamente.");
        res.json({ message: "Chat eliminado correctamente." });
    } catch (error) {
        console.error("🔥 Error al eliminar el chat:", error.message);
        res.status(500).json({ message: "Error al eliminar el chat", error: error.message });
    }
}

// Función para obtener los detalles de un chat
async function obtenerDetallesChat(req, res) {
    try {
        const chat_id = req.params.id;
        const detallesChat = await chatModel.obtenerDetallesChat(chat_id);

        if (!detallesChat) {
            return res.status(404).json({ message: "No se encontraron detalles del chat." });
        }

        res.json(detallesChat);
    } catch (error) {
        console.error("🔥 Error en obtenerDetallesChat (Controlador):", error.message);
        res.status(500).json({ message: "Error al obtener detalles del chat", error: error.message });
    }
}

module.exports = {
    iniciarChat,
    obtenerChats,
    enviarMensaje,
    obtenerMensajes,
    aceptarIntercambio,
    rechazarIntercambio,
    obtenerDetallesChat,
    marcarMensajesLeidos
};

const pool = require('../config/db.js');

// Función para crear un nuevo chat
async function crearChat(comprador_id, vendedor_id, comic_id) {
    try {
        const [result] = await pool.query(
            'INSERT INTO chats (comprador_id, vendedor_id, comic_id) VALUES (?, ?, ?)',
            [comprador_id, vendedor_id, comic_id]
        );

        console.log("Chat creado con ID:", result.insertId);
        return result.insertId; // Devuelve el ID del chat creado
    } catch (error) {
        console.error("🔥 Error al crear chat en BD:", error.message);
        throw error;
    }
}

// Función para obtener los chats de un usuario
async function obtenerChats(usuario_id) {
    try {
        const [chats] = await pool.query(`
            SELECT 
                c.id, 
                c.comprador_id, 
                c.vendedor_id, 
                cs.titulo AS comic_titulo, 
                v.nombre AS vendedor_nombre,
                co.nombre AS comprador_nombre,
                EXISTS (
                    SELECT 1 FROM mensajes m 
                    WHERE m.chat_id = c.id 
                    AND m.usuario_id != ? 
                    AND m.visto = 0
                ) AS no_leido
            FROM chats c
            JOIN comics_subidos cs ON c.comic_id = cs.id
            JOIN usuarios v ON c.vendedor_id = v.id
            JOIN usuarios co ON c.comprador_id = co.id
            WHERE c.comprador_id = ? OR c.vendedor_id = ?
        `, [usuario_id, usuario_id, usuario_id]);

        return chats;
    } catch (error) {
        console.error("🔥 Error en obtenerChats (Modelo):", error.message);
        throw error;
    }
}

// Función para obtener los detalles de un chat
async function obtenerDetallesChat(chat_id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                c.comprador_id, 
                c.vendedor_id, 
                u1.nombre AS comprador_nombre,
                u2.nombre AS vendedor_nombre
            FROM chats c
            JOIN usuarios u1 ON c.comprador_id = u1.id
            JOIN usuarios u2 ON c.vendedor_id = u2.id
            WHERE c.id = ?
        `, [chat_id]);

        if (rows.length === 0) {
            return null; // Si no se encuentra el chat, devolvemos null
        }

        return rows[0]; // Devolvemos el primer resultado encontrado
    } catch (error) {
        console.error("🔥 Error en obtenerDetallesChat (Modelo):", error.message);
        throw error; // Relanzamos el error para que el controlador lo maneje
    }
}

// Función para enviar un mensaje en un chat
async function enviarMensaje(chat_id, usuario_id, mensaje) {
    try {
        await pool.query(
            'INSERT INTO mensajes (chat_id, usuario_id, mensaje) VALUES (?, ?, ?)',
            [chat_id, usuario_id, mensaje]
        );
    } catch (error) {
        console.error("🔥 Error al enviar mensaje:", error.message);
        throw error;
    }
}

// Función para obtener los mensajes de un chat
async function obtenerMensajes(chat_id) {
    try {
        const [rows] = await pool.query(
            'SELECT usuario_id, mensaje, enviado_en FROM mensajes WHERE chat_id = ? ORDER BY enviado_en ASC',
            [chat_id]
        );
        return rows;
    } catch (error) {
        console.error("🔥 Error al obtener mensajes:", error.message);
        throw error;
    }
}

// Función para marcar los mensajes de un chat como leídos
async function marcarMensajesComoLeidos(chat_id, usuario_id) {
    try {
        await pool.query(`
            UPDATE mensajes 
            SET visto = 1 
            WHERE chat_id = ? 
            AND usuario_id != ? 
            AND visto = 0;
        `, [chat_id, usuario_id]);
    } catch (error) {
        console.error("🔥 Error al marcar mensajes como leídos (Modelo):", error.message);
        throw error;
    }
}

// Función para aceptar un intercambio en un chat
async function aceptarIntercambio(chat_id, usuario_id) {
    try {
        // Obtener detalles del chat
        const [chats] = await pool.query('SELECT * FROM chats WHERE id = ?', [chat_id]);
        if (!chats.length) throw new Error("Chat no encontrado.");

        const chat = chats[0];

        // Verificar si el usuario es comprador o vendedor
        let campoActualizar = '';
        if (usuario_id === chat.comprador_id) {
            campoActualizar = 'comprador_acepto';
        } else if (usuario_id === chat.vendedor_id) {
            campoActualizar = 'vendedor_acepto';
        } else {
            throw new Error("No tienes permiso para aceptar este intercambio.");
        }

        // Marcar como aceptado por el usuario
        await pool.query(`UPDATE chats SET ${campoActualizar} = TRUE WHERE id = ?`, [chat_id]);

        // Verificar si ambos han aceptado
        const [updatedChat] = await pool.query('SELECT * FROM chats WHERE id = ?', [chat_id]);

        if (updatedChat[0].comprador_acepto && updatedChat[0].vendedor_acepto) {
            // **Actualizar el dueño del cómic**
            await pool.query('UPDATE comics_subidos SET usuario_id = ? WHERE id = ?', [chat.comprador_id, chat.comic_id]);

            // **Eliminar el chat, ya que la transacción está completa**
            await pool.query('DELETE FROM chats WHERE id = ?', [chat_id]);

            // **Eliminar el registro del intercambio (el cómic ya fue intercambiado)**
            await pool.query('DELETE FROM intercambios WHERE comic_id = ?', [chat.comic_id]);

            return { message: "Intercambio completado. El cómic ha sido transferido.", finalizado: true };
        }

        return { message: "Esperando confirmación del otro usuario", finalizado: false };

    } catch (error) {
        console.error("🔥 Error al aceptar intercambio:", error.message);
        throw error;
    }
}

// Función para rechazar un intercambio y cerrar el chat
async function rechazarIntercambio(chat_id) {
    try {
        await pool.query('UPDATE chats SET estado = "rechazado" WHERE id = ?', [chat_id]);
        return { message: "Intercambio rechazado y chat cerrado." };
    } catch (error) {
        console.error("🔥 Error al rechazar intercambio:", error.message);
        throw error;
    }
}

module.exports = {
    crearChat,
    obtenerChats,
    enviarMensaje,
    obtenerMensajes,
    aceptarIntercambio,
    rechazarIntercambio,
    obtenerDetallesChat,
    marcarMensajesComoLeidos
};

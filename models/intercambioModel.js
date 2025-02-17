const pool = require('../config/db.js');

async function getAllIntercambios() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                i.id AS intercambio_id, 
                i.comic_id, 
                i.comentario, 
                i.fecha_comentario, 
                i.estado_intercambio,
                c.titulo, 
                c.imagen, 
                c.precio
            FROM intercambios i
            JOIN comics_subidos c ON i.comic_id = c.id
        `);
        return rows;
    } catch (error) {
        console.error("🔥 Error en la consulta de intercambios:", error.message);
        throw error;
    }
}
// Función para ofertar un cómic
async function ofertarComic(comic_id, comentario, estado_intercambio) {
    try {
        // Verificar si ya existe una oferta para este cómic
        const [existingOffer] = await pool.query(
            'SELECT * FROM intercambios WHERE comic_id = ?',
            [comic_id]
        );

        if (existingOffer.length > 0) {
            throw new Error("Ya has ofertado este cómic. No puedes hacer más de una oferta.");
        }

        // Insertar la nueva oferta en la base de datos
        const fecha_comentario = new Date().toISOString().slice(0, 19).replace("T", " ");

        const [result] = await pool.query(
            'INSERT INTO intercambios (comic_id, comentario, fecha_comentario, estado_intercambio) VALUES (?, ?, ?, ?)',
            [comic_id, comentario, fecha_comentario, estado_intercambio]
        );

        return result.insertId; // Retornamos el ID del nuevo intercambio
    } catch (error) {
        console.error("🔥 Error en la consulta SQL al ofertar cómic:", error.message);
        throw error;
    }
}
// Obtener los cómics subidos por un usuario, incluyendo información de intercambio.
async function getComicsByUserId(usuarioId) {
    const query = `
        SELECT 
            cs.id AS comic_id,
            cs.titulo,
            cs.imagen,
            cs.autor,
            cs.editorial,
            cs.genero,
            cs.precio,
            i.id AS intercambio_id,
            i.comentario,
            i.fecha_comentario,
            i.estado_intercambio
        FROM 
            comics_subidos cs
        LEFT JOIN 
            intercambios i
        ON 
            cs.id = i.comic_id
        WHERE 
            cs.usuario_id = ?;
    `;

    try {
        const [rows] = await pool.query(query, [usuarioId]);
        return rows;
    } catch (err) {
        throw new Error('Error al obtener los cómics: ' + err.message);
    }
}

async function obtenerOfertasDeUsuario(usuario_id) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                i.id AS intercambio_id, 
                i.comic_id, 
                i.comentario, 
                i.fecha_comentario, 
                i.estado_intercambio,
                c.titulo, 
                c.imagen, 
                c.precio
            FROM intercambios i
            JOIN comics_subidos c ON i.comic_id = c.id
            WHERE c.usuario_id = ?`, [usuario_id]
        );

        return rows;
    } catch (error) {
        console.error("🔥 Error en la consulta SQL al obtener ofertas del usuario:", error.message);
        throw error;
    }
}

async function editarOferta(intercambio_id, comentario, estado_intercambio) {
    try {
        const [result] = await pool.query(
            'UPDATE intercambios SET comentario = ?, estado_intercambio = ? WHERE id = ?',
            [comentario, estado_intercambio, intercambio_id]
        );

        return result.affectedRows; // Retorna cuántas filas fueron modificadas
    } catch (error) {
        console.error("🔥 Error en la consulta SQL al editar oferta:", error.message);
        throw error;
    }
}

async function eliminarOferta(intercambio_id) {
    try {
        const [result] = await pool.query('DELETE FROM intercambios WHERE id = ?', [intercambio_id]);
        return result.affectedRows; // Devuelve cuántas filas se eliminaron
    } catch (error) {
        console.error("🔥 Error en la consulta SQL al eliminar oferta:", error.message);
        throw error;
    }
}

async function obtenerOfertaPorId(intercambio_id) {
    try {
        const [rows] = await pool.query('SELECT * FROM intercambios WHERE id = ?', [intercambio_id]);
        return rows.length ? rows[0] : null;
    } catch (error) {
        console.error("🔥 Error en la consulta SQL al obtener oferta:", error.message);
        throw error;
    }
}

module.exports = {
    getAllIntercambios,
    ofertarComic,
    getComicsByUserId,
    editarOferta,
    obtenerOfertasDeUsuario,
    obtenerOfertaPorId,
    eliminarOferta
};

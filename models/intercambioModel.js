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
async function ofertarComic(comic_id, comentario) {
    try {
        const fecha_comentario = new Date().toISOString().slice(0, 19).replace("T", " ");
        const estado_intercambio = "Disponible";

        const [result] = await pool.query(
            'INSERT INTO intercambios (comic_id, comentario, fecha_comentario, estado_intercambio) VALUES (?, ?, ?, ?)',
            [comic_id, comentario, fecha_comentario, estado_intercambio]
        );

        return result.insertId; // Retorna el ID del nuevo intercambio
    } catch (error) {
        console.error("🔥 Error en la consulta SQL al ofertar cómic:", error.message);
        throw error; // Se propaga el error para que el controlador lo maneje
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

module.exports = {
    getAllIntercambios,
    ofertarComic,
    getComicsByUserId
};

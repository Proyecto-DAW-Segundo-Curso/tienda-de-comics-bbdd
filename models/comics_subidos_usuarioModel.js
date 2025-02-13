const pool = require('../config/db.js');

async function getAllComicsSubidosUsuario() {
    const [rows] = await pool.query('SELECT * FROM comics_subidos');
    return rows;
}

async function getComicSubidoUsuarioById(id) {
    const [rows] = await pool.query('SELECT * FROM comics_subidos WHERE id = ?', [id]);
    return rows[0];
}

async function addComicSubidoUsuario(comic) {
    const { usuario_id, titulo, imagen, autor, editorial, genero, precio } = comic;

    console.log("📥 Insertando en la base de datos con usuario_id:", usuario_id); // Verifica que el usuario_id no es NULL

    try {
        const [result] = await pool.query(
            'INSERT INTO comics_subidos (usuario_id, titulo, imagen, autor, editorial, genero, precio) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [usuario_id, titulo, imagen, autor, editorial, genero, precio]
        );

        console.log("✅ Cómic insertado con ID:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("🔥 Error en la consulta SQL:", error.message);
        throw error;
    }
}


async function updateComicSubidoUsuario(id, comic) {
    const { titulo, imagen, autor, editorial, genero, precio } = comic;
    const [result] = await pool.query(
        'UPDATE comics_subidos SET titulo=?, imagen=?, autor=?, editorial=?, genero=?, precio=? WHERE id=?',
        [titulo, imagen, autor, editorial, genero, precio, id]
    );
    return result.affectedRows;
}

async function deleteComicSubidoUsuario(id) {
    const [result] = await pool.query('DELETE FROM comics_subidos WHERE id=?', [id]);
    return result.affectedRows;
}

async function getComicsByUsuarioId(usuario_id) {
    const [rows] = await pool.query('SELECT * FROM comics_subidos WHERE usuario_id = ?', [usuario_id]);
    return rows;
}

module.exports = {
    getAllComicsSubidosUsuario,
    getComicSubidoUsuarioById,
    addComicSubidoUsuario,
    updateComicSubidoUsuario,
    deleteComicSubidoUsuario,
    getComicsByUsuarioId
};
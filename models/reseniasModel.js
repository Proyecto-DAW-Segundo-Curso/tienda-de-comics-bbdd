const pool = require('../config/db.js');

async function addResenia (resenia){
    const {usuario_id,comic_id,valoracion,comentario}= resenia;
    const[result]= await pool.query(
    'INSERT INTO resenias (usuario_id, comic_id, valoracion, comentario) VALUES (?,?,?,?)',
    [usuario_id,comic_id,valoracion,comentario]
)
    return result.insertId;
}

async function updateResenia (resenia,id){
    const {valoracion,comentario}= resenia;
    const [result] = await pool.query(
        'UPDATE resenias SET valoracion =?, comentario=? WHERE id=?',
        [valoracion,comentario,id]
    );

    return result.affectedRows;
}

async function getReseniasById (id){
    const [rows] =await pool.query(
        'SELECT * FROM resenias WHERE comic_id = ?',
        [id]
    );

    return rows;
}

async function deleteResenia (id){
    const [result] = await pool.query('DELETE FROM resenias WHERE id = ?', [id]);
    return result.affectedRows;
}

module.exports = {
    addResenia,
    updateResenia,
    deleteResenia,
    getReseniasById
}
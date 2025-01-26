const pool = require ('../config/db.js');

async function getAllIntercambios (){
    const [rows] = await pool.query('SELECT * from intercambios');
    return rows;
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
            // Usamos await para esperar la ejecución de la consulta
            const [rows] = await db.execute(query, [usuarioId]);
            return rows; // Retorna los resultados.
        } catch (err) {
            throw new Error('Error al obtener los cómics: ' + err.message);
        }
    }

module.exports = ComicModel;
const pool = require('../config/db.js');

async function getAllUploadedComics (){
    const [rows] = await pool.query('SELECT * from comics_subidos');
    return rows;
}

async function getComicSubidoById (id){
    const[rows]= await pool.query('SELECT * from comics_subidos where id=?',[id]);
    return rows [0];
}

async function addComicSubido (comic){
    const {usuario_id,titulo, imagen, autor,editorial, genero, precio}= comic;
    const [result] = await pool.query(
        'INSERT INTO comics_subidos (usuario_id, titulo, imagen, autor, editorial, genero, precio) VALUES (?,?,?,?,?,?,?)',
        [usuario_id, titulo,imagen,autor,editorial,genero, precio] 
    )

    return result.insertId;
}

async function updateUploadedComic (comic,id){
    const {titulo, imagen, autor,editorial, genero, precio}= comic;
    const [result] = await pool.query(
        'UPDATE comics_subidos SET titulo=?,imagen=?, autor=?,editorial=?,genero=?,precio=? WHERE id=?',
        [titulo, imagen,autor,editorial,genero,precio, id]
    );
    return result.affectedRows;
}

async function deleteUploadedComic (id){
    const [result] = await pool.query('DELETE FROM comics_subidos where id=?', [id]);
    return result.affectedRows;
}

module.exports = {
    getAllUploadedComics,
    getComicSubidoById,
    addComicSubido,
    updateUploadedComic,
    deleteUploadedComic
}
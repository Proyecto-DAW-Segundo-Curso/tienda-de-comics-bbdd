const pool = require('../config/db.js');

async function getAllMerchan (){
    const [rows] = await pool.query('SELECT * from merchan');
    return rows;
}
    
async function getMerchanById (id){
    const [rows] = await pool.query('SELECT * from merchan where id=?', [id]);
    return rows [0];
}

async function addMerchan (merchan){
    const {nombre, categoria, fabricante, precio, stock} = merchan;
    const[result] = await pool.query(
        'INSERT INTO merchan (nombre, categoria, fabricante, precio, stock) VALUES (?,?,?,?,?)',
        [nombre, categoria, fabricante,precio,stock]
    )
    return result.insertId;
}


async function updateMerchan (merchan,id){
    const {nombre, categoria, fabricante, precio, stock}= merchan;
    const [result]= await pool.query(
        'UPDATE merchan SET nombre=?, categoria=?, fabricante=?, precio=?, stock=? WHERE id=?',
        [nombre, categoria, fabricante,precio, stock, id]
    );

    return result.affectedRows;
}

async function deleteMerchan (id){
    const [result]= await pool.query('DELETE FROM merchan where id=?',[id]);
    return result.affectedRows;
}


module.exports={
    getAllMerchan,
    getMerchanById,
    addMerchan,
    updateMerchan,
    deleteMerchan
}
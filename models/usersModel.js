//importamos la conexion a bbdd
const pool = require('../config/db.js');


//petición asíncrona mediante el uso de promises ('query') para listar todos los usuarios de la bbdd
async function getAllUsers (){
    const [rows]= await pool.query('SELECT * from usuarios');
    return rows;
}


async function getUserBydId (id){
    const [rows] = await pool.query('Select * from usuarios where id=?', [id]);
    return rows[0];
}

async function addUser (user){
    const {nombre,email,contrasenia,permiso}=user;
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, email, contrasenia, permiso) VALUES (?,?,?,?)',
        [nombre, email, contrasenia, permiso]
    )
    return result.insertId;
}

async function updateUser (user,id){
    const {nombre,email,contrasenia,permiso}=user;
    const [result] = await pool.query(
        'UPDATE usuarios SET nombre=?, email=?,contrasenia=?, permiso=? WHERE id=?',
        [nombre, email, contrasenia, permiso,id]
    );

    return result.affectedRows;
}


async function deleteUser (id){

    const [result] = await pool.query('DELETE FROM usuarios where id =?',[id]);

    return result.affectedRows;
}


module.exports ={
    getAllUsers,
    getUserBydId,
    addUser,
    updateUser,
    deleteUser,
};
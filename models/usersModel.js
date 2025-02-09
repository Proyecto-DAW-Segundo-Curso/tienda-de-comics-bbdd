//importamos la conexion a bbdd
const pool = require('../config/db.js');
const bcrypt = require('bcrypt');


//petición asíncrona mediante el uso de promises ('query') para listar todos los usuarios de la bbdd
async function getAllUsers (){
    const [rows]= await pool.query('SELECT * from usuarios');
    return rows;
}


async function getUserBydId (id){
    const [rows] = await pool.query('Select * from usuarios where id=?', [id]);
    return rows[0];
}

async function getUserByEmail(email) {
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (!rows || rows.length === 0) {
            return null; // Si no encuentra usuario, devuelve null
        }

        return rows[0]; // Devuelve el primer usuario encontrado
    } catch (error) {
        console.error("❌ Error en getUserByEmail:", error);
        throw error; // Lanza el error para que lo capture el controlador
    }
}


async function addUser(userData) {
    try {
        const { nombre, email, contrasenia, permiso } = userData;
        const query = `INSERT INTO usuarios (nombre, email, contrasenia, permiso) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.query(query, [nombre, email, contrasenia, permiso]);    

        if (!result.insertId) {
            throw new Error('Error al insertar usuario en la base de datos');
        }

        return result.insertId; // Devuelve el ID del nuevo usuario
    } catch (error) {
        console.error("❌ Error en addUser:", error);
        throw error; // Lanza el error para que lo capture el controlador
    }
}

async function updateUser(user) {
    try {
        const { id, nombre, email, contrasenia } = user;
        const [result] = await pool.query(
            'UPDATE usuarios SET nombre=?, email=?, contrasenia=? WHERE id=?',
            [nombre, email, contrasenia, id]
        );

        return result.affectedRows;
    } catch (error) {
        console.error("Error en updateUser:", error);
        throw error;
    }
}


async function deleteUser(id) {
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        return result.affectedRows;
    } catch (error) {
        console.error("Error en deleteUser:", error);
        throw error;
    }
}



module.exports ={
    getAllUsers,
    getUserBydId,
    getUserByEmail,
    addUser,
    updateUser,
    deleteUser,
};
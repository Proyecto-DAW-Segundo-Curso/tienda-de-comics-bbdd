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

async function addUser(req, res) {
    try {
        const { nombre, email, contrasenia, permiso } = req.body;

        // Verificar si el email ya está registrado
        const [existingUser] = await usersModel.getAllUsers();
        if (existingUser.find(user => user.email === email)) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Guardar el nuevo usuario
        const newUserId = await usersModel.addUser({
            nombre,
            email,
            contrasenia: hashedPassword,
            permiso: permiso || 'usuario',
        });

        res.status(201).json({ message: 'Usuario registrado con éxito', id: newUserId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario', error });
    }
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
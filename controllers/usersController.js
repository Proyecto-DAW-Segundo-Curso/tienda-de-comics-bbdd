const usersModel = require('../models/usersModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//esta funcion  guarda en una variable el método definido en el modelo para rescatar todos los usuarios de la bbdd
//gestiona los errores y transforma los datos en formato json
async function getAllUsers(req, res) {
    try {
      const users = await usersModel.getAllUsers();
      res.json(users);

    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
  }

  async function getUserById (req,res){
    try{
      console.log("📌 Recibiendo solicitud de registro:", req.body);
        const  user = await usersModel.getUserBydId(req.params.id);

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado'});

        res.json(user);
    }catch(error){
        res.status(500).json({message: 'Error al obtener el usuario', error})
    }
  }

  async function getUserProfile(req, res) {
    try {
      const userId = req.user.id; // El ID del usuario viene del token
      const user = await usersModel.getUserBydId(userId); // Obtener el usuario por ID
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.json(user); // Devolver los datos del usuario
    } catch (error) {
      console.error("Error en getUserProfile:", error);
      res.status(500).json({ message: 'Error al obtener los datos del usuario', error: error.message });
    }
  }
  

  async function addUser(req, res) {
    try {

      console.log("📌 Recibiendo solicitud de registro:", req.body);
        const { nombre, email, contrasenia } = req.body;

        // Verificar si se enviaron todos los datos necesarios
        if (!nombre || !email || !contrasenia) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar si el email ya está registrado
        const existingUsers = await usersModel.getAllUsers();
        console.log("📌 Usuarios existentes en la BBDD:", existingUsers);
        if (existingUsers.some(user => user.email === email)) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hashear la contraseña antes de guardarla
        console.log("🔑 Hasheando contraseña...");
        const hashedPassword = await bcrypt.hash(contrasenia, 10);

        // Guardar el nuevo usuario
        console.log("📌 Guardando nuevo usuario en la BBDD...");  
        const newUserId = await usersModel.addUser({
            nombre,
            email,
            contrasenia: hashedPassword,
            permiso: 1,
        });
        console.log("✅ Usuario registrado con éxito, ID:", newUserId);
        res.status(201).json({ message: 'Usuario registrado con éxito', id: newUserId });
    } catch (error) {
      console.error("🔥 ERROR DETECTADO:", error); // Mostrar error en la terminal
      res.status(500).json({ message: 'Error interno del servidor', error: error.stack }); // Enviar stack del error a Postman
    }
}

async function loginUser(req, res) {
  try {
      const { email, contrasenia } = req.body;

      if (!email || !contrasenia) {
          return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
      }

      // Buscar usuario en la base de datos por email
      const user = await usersModel.getUserByEmail(email);
      
      console.log("📌 Usuario encontrado en la BBDD:", user); // Verificar si el usuario existe

      if (!user) {
          console.log("⚠️ No se encontró usuario con ese email.");
          return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      console.log("🔑 Comparando contraseñas...");
      console.log("Contraseña ingresada:", contrasenia);
      console.log("Contraseña en la BBDD:", user.contrasenia);

      // Comparar contraseña ingresada con la almacenada (hasheada)
      const match = await bcrypt.compare(contrasenia, user.contrasenia);
      console.log("¿Las contraseñas coinciden?", match);

      if (!match) {
          console.log("⚠️ Las contraseñas no coinciden.");
          return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      //generamos un token
      const token = jwt.sign(
        {
          id:user.id, email: user.email, permiso: user.permiso
        },
        process.env.JWT_SECRET, //clave secreta guardada en archivo .env
        {expiresIn: '1h'} //tiempo de expiración del token
      );

      // Devolver información del usuario (sin la contraseña)
      console.log("✅ Inicio de sesión exitoso");
      res.status(200).json({ 
          message: 'Inicio de sesión exitoso',
          token,
          user: {
          id: user.id, 
          nombre: user.nombre, 
          email: user.email, 
          permiso: user.permiso 
          },
      });

  } catch (error) {
      console.error("🔥 Error en loginUser:", error);
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}



  async function updateUser (req,res){
    try{
        const updatedRows = await usersModel.updateUser(req.params.id, req.body);
        if(!updatedRows) return res.status(404).json({message: 'Usuario no encontrado'})
        res.json({message: 'usuario actualizado'});    
    }catch(error){
        res.status(500).json({message: 'Error al actualizar el usuario', error})
    }
  }

  async function deleteUser (req,res){
    try{
        const deletedRows = await usersModel.deleteUser(req.params.id);
        if(!deletedRows) return res.status(404).json({message: 'Usuario no encontrado'});
        res.json({message: 'Usuario eliminado'})
    }catch(error){
        res.status(500).json({message: 'Error al eliminar el usuario', error})
    }
  }

module.exports = {
    getAllUsers,
    getUserById,
    getUserProfile,
    loginUser,
    addUser,
    updateUser,
    deleteUser
};
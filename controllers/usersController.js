const usersModel = require('../models/usersModel.js');

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
        const  user = await usersModel.getUserBydId(req.params.id);

        if(!user) return res.status(404).json({ message: 'Usuario no encontrado'});

        res.json(user);
    }catch(error){
        res.status(500).json({message: 'Error al obtener el usuario', error})
    }
  }

  async function addUser (req,res) {
    try{
        const newUserId = await usersModel.addUser(req.body);
        res.status(201).json({message: 'Usuario añadido', id: newUserId})
    }catch(error){
        res.status(500).json ({message: 'Error al añadir el usuario', error})
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
    addUser,
    updateUser,
    deleteUser
};
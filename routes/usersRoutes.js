const express = require('express');
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/authMiddlewares.js');

const router = express.Router();

// Ruta para registrar usuarios
router.post('/register', usersController.addUser);

// Ruta para obtener todos los usuarios
router.get('/users', verifyToken, usersController.getAllUsers);

//Ruta para el Login
router.post('/login', usersController.loginUser);

// Ruta para obtener un usuario por su ID
router.get('/user/:id', verifyToken, usersController.getUserById);

router.get('/me', verifyToken, usersController.getUserProfile);

router.put('/update', verifyToken, usersController.updateUser);

router.delete('/user/:id', verifyToken, usersController.deleteUser);

module.exports = router;

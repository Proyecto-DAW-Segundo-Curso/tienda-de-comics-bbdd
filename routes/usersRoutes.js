const express = require('express');
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/authMiddlewares.js');
const verifyAdmin = require('../middlewares/authMiddlewares.js');

const router = express.Router();

// Ruta para registrar usuarios
router.post('/register', usersController.addUser);

// Ruta para obtener todos los usuarios
router.get('/users', verifyToken, usersController.getAllUsers);

// Ruta para el Login
router.post('/login', usersController.loginUser);

// Ruta para obtener un usuario por su ID
router.get('/user/:id', verifyToken, usersController.getUserById);

// Ruta para obtener el perfil del usuario logueado
router.get('/me', verifyToken, usersController.getUserProfile);

// Ruta para actualizar un usuario
router.put('/update', verifyToken, usersController.updateUser);

// Ruta para actualizar un usuario por su ID
router.put('/user/:id', verifyToken, usersController.updateUser);

// Ruta para eliminar un usuario por su ID
router.delete('/user/:id', verifyToken, usersController.deleteUser);

// Ruta para obtener todos los usuarios (requiere verificación de token y admin)
router.get('/users', verifyToken, verifyAdmin, usersController.getAllUsers);

// Ruta para obtener el perfil del usuario logueado (evita que el usuario oferte sus propios cómics)
router.get('/usuario', verifyToken, usersController.getUserProfile);

module.exports = router;

const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

// Ruta para registrar usuarios
router.post('/register', usersController.addUser);

// Ruta para obtener todos los usuarios
router.get('/users', usersController.getAllUsers);

//Ruta para el Login
router.post('/login', usersController.loginUser);

module.exports = router;

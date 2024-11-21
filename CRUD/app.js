const express = require('express');
const conexionBaseDatos = require('./conexionBaseDatos');

const app = express();
app.use(express.json()); // Middleware para parsear los JSON recibidos

const PORT = 3000;

// **1. Crear un usuario (INSERT)**
app.post('/usuarios', (req, res) => {
    const { nombre, email, contrasenia, permiso } = req.body; //Req.body es una solicitud HTTP, el cuerpo de la solicitud. Esta solicitud está vinculada al (express.json) de más arriba, para que le pase dicha información y la parsee

    const query = 'INSERT INTO usuarios (nombre, email, contrasenia, permiso) VALUES (?, ?, ?, ?)';
    conexionBaseDatos.query(query, [nombre, email, contrasenia, permiso], (error, result) => {
        if (error) {
            console.error('Error al crear usuario:', error);
            return res.status(500).json({ error: 'Error al crear usuario' });
        }

        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    });
});

// **2. Leer usuarios (SELECT)**
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM usuarios';

    conexionBaseDatos.query(query, (error, rows) => {
        if (error) {
            console.error('Error al obtener usuarios:', error);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }

        res.status(200).json(rows);
    });
});

// **3. Actualizar un usuario (UPDATE)**
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, contrasenia, permiso } = req.body; //Req.body es una solicitud HTTP, el cuerpo de la solicitud. Esta solicitud está vinculada al (express.json) de más arriba, para que le pase dicha información y la parsee

    const query = 'UPDATE usuarios SET nombre = ?, email = ?, contrasenia = ?, permiso = ? WHERE id = ?';
    conexionBaseDatos.query(query, [nombre, email, contrasenia, permiso, id], (error, result) => {
        if (error) {
            console.error('Error al actualizar usuario:', error);
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado' });
    });
});

// **4. Eliminar un usuario (DELETE)**
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM usuarios WHERE id = ?';
    conexionBaseDatos.query(query, [id], (error, result) => {
        if (error) {
            console.error('Error al eliminar usuario:', error);
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado' });
    });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

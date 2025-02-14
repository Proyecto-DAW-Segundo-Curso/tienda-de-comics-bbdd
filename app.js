require('dotenv').config();
const express = require('express');
const comicsRoutes = require('./routes/comicsRoutes');
const usersRoutes = require('./routes/usersRoutes');
const comicsRoutesUsuario = require('./routes/comicsRoutesUsuario');
const cors = require('cors');


const app = express();
app.use(cors());
const PORT = 3001;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para JSON
app.use(express.json());

// Rutas de cómics
app.use('/api', comicsRoutes);
app.use('/api', usersRoutes);
app.use('/api', comicsRoutesUsuario);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

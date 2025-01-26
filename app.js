const express = require('express');
// const bodyParser = require('body-parser');
const comicsRoutes = require('./routes/comicsRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3000;

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Middleware para JSON
app.use(express.json());

// Rutas de cómics
app.use('/api', comicsRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

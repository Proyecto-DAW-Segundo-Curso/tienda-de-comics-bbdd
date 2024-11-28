const mysql = require('mysql2/promise'); // Importa la librería mysql2/promise, sugerido por chatgpt

const pool = mysql.createPool({
  host: 'localhost',       // Cambia según tu configuración
  user: 'root',            // Usuario de tu base de datos
  password: '',            // Contraseña de tu base de datos
  database: 'comics', // Nombre de tu base de datos
  waitForConnections: true, // Esperar a que se conecten a la base de datos, sugerido por chatgpt
  connectionLimit: 10, // Límite de conexiones a la base de datos, esto se dio en clases
  queueLimit: 0 // Límite de peticiones a la base de datos, sugerido por chatgpt
});

module.exports = pool; // Exporta la variable pool

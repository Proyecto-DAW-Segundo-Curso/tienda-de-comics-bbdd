const mysql = require('mysql2');

// Configuración de la conexión
const Connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comics',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
//waitForConnections: true: Las solicitudes no fallan automáticamente; esperan por una conexión.
//connectionLimit: 10: Máximo de 10 conexiones activas al mismo tiempo.
//queueLimit: 0: No hay límite para las solicitudes en cola, lo que evita rechazar conexiones si las conexiones actuales están ocupadas.

// Exportamos la conexión
module.exports = Connection;

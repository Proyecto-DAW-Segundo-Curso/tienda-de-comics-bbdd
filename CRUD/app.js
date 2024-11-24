const mysql = require('mysql');

// Crear conexión a la base de datos
const conex = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comics',
    waitForConnections: true, //waitForConnections: true: Las solicitudes no fallan automáticamente; esperan por una conexión.
    connectionLimit: 10, //connectionLimit: 10: Máximo de 10 conexiones activas al mismo tiempo.
    queueLimit: 0 //queueLimit: 0: No hay límite para las solicitudes en cola, lo que evita rechazar conexiones si las conexiones actuales están ocupadas.
});

const insertarUsuario = 'INSERT INTO usuarios (nombre, email, contrasenia, permiso) VALUES (?, ?, ?, ?)';
const consultarUsuarios = 'SELECT * FROM usuarios';
const actualizarUsuario = 'UPDATE usuarios SET email = ?, permiso = ? WHERE id = ?';
const eliminarUsuario = 'DELETE FROM usuarios WHERE id = ?';

// Función para ejecutar una consulta
function ejecutarConsulta(query, params = [], mensaje) {
    conex.getConnection((error, conexion) => {
        if (error) {
            console.error('Error al obtener conexión:', error);
            return;
        }

        conexion.query(query, params, (err, resultados) => {
            if (err) {
                console.error('Error en la consulta:', err);
            } else {
                console.log(mensaje, resultados);
            }
            conexion.release();
        });
    });
}


// Insertar un usuario
ejecutarConsulta(insertarUsuario, [], 'Usuario insertado con éxito.');

// Consultar usuarios
ejecutarConsulta(consultarUsuarios, [], 'Usuarios encontrados:');

// Actualizar un usuario
ejecutarConsulta(actualizarUsuario, [], 'Usuario actualizado con éxito.');

// Eliminar un usuario
ejecutarConsulta(eliminarUsuario, [], 'Usuario eliminado con éxito.');

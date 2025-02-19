const pool = require('../config/db.js');

async function getAllVentas() {
    const [rows] = await pool.query('SELECT * FROM ventas');
    return rows;
}

async function getVentasById(id) {
    const [rows] = await pool.query('SELECT * FROM ventas WHERE id=?', [id]);
    if (rows.length === 0) return null;
    return rows[0];
}

async function getAllVentasWithUsuarioComic() {
    const [rows] = await pool.query('SELECT comics.titulo AS comic, comics.precio AS precio, usuarios.nombre AS usuario, ventas.fecha_venta AS fecha, cantidad FROM ventas JOIN usuarios ON ventas.usuario_id = usuarios.id JOIN comics ON ventas.comic_id = comics.id;');
    return rows;
}
async function getVentasByUsuario(usuario_id) {  
    const [rows] = await pool.query('SELECT comics.titulo AS comic, comics.precio AS precio, usuarios.nombre AS usuario,  ventas.fecha_venta AS fecha, cantidad FROM ventas JOIN usuarios ON ventas.usuario_id = usuarios.id JOIN comics ON ventas.comic_id = comics.id', [usuario_id]);
    return rows;
}

async function addVenta(ventaData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { id_venta, usuario_id, comic_id, fecha_venta, cantidad, total } = ventaData;

        const query = `INSERT INTO ventas (id_venta, usuario_id, comic_id, fecha_venta, cantidad, total) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await connection.query(query, [id_venta, usuario_id, comic_id, fecha_venta, cantidad, total]);

        if (!result.insertId) throw new Error('Error al insertar la venta');

        await connection.commit();
        return result.insertId;
    } catch (error) {
        await connection.rollback();
        console.error("❌ Error en addVenta:", error);
        throw error;
    } finally {
        connection.release();
    }
}

async function updateStock(comic_id, cantidad, connection = pool) {
    try {
        const [stockCheck] = await connection.query('SELECT stock FROM comics WHERE id = ?', [comic_id]);
        if (stockCheck.length === 0) throw new Error('Cómic no encontrado');
        if (stockCheck[0].stock < cantidad) throw new Error('Stock insuficiente');

        const query = `UPDATE comics SET stock = stock - ? WHERE id = ?`;
        const [result] = await connection.query(query, [cantidad, comic_id]);

        if (result.affectedRows === 0) throw new Error('Error al actualizar el stock');
        return result;
    } catch (error) {
        console.error("❌ Error en updateStock:", error);
        throw error;
    }
}


module.exports = {
    getAllVentas,
    getVentasById,
    addVenta,
    updateStock,
    getAllVentasWithUsuarioComic,
    getVentasByUsuario,
};

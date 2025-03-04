const pool = require('../config/db.js');

async function getAllVentas() {
  const [rows] = await pool.query('SELECT * FROM ventas ORDER BY fecha_venta DESC');
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

async function ventasReport(fechaInicio, fechaFin) {
  let query = `
    SELECT 
      v.id_venta,
      u.nombre AS usuario,
      c.id AS comic_id,
      c.titulo AS comic,
      v.cantidad,
      c.precio,
      SUM(v.total) AS total_venta  -- Aseguramos la suma total de la venta
    FROM ventas v
    JOIN usuarios u ON v.usuario_id = u.id
    LEFT JOIN comics c ON v.comic_id = c.id
    WHERE 1=1
  `;

  const params = [];

  if (fechaInicio && fechaFin) {
    query += ` AND v.fecha_venta BETWEEN ? AND ?`;
    params.push(fechaInicio, fechaFin);
  }

  query += ` GROUP BY v.id_venta, u.nombre, c.id, c.titulo, v.cantidad, c.precio`; 

  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = {
  getAllVentas,
  getVentasById,
  addVenta,
  updateStock,
  getAllVentasWithUsuarioComic,
  getVentasByUsuario,
  ventasReport,
};

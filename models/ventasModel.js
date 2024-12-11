const pool = require('../config/db.js');

async function getAllVentas (){
    const [rows]= await pool.query('SELECT * from ventas');
    return rows;
}

async function getVentasById (id){
    const[rows] = await pool.query('SELECT * from ventas where id=?',[id]);
    return rows[0];
}

//importante, cambiar DATETIME para que se autogenere con:
//ALTER TABLE ventas
//MODIFY COLUMN fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP;
async function addVenta(venta) {
    const { usuario_id, comic_id, merchan_id, cantidad } = venta;
  
    try {
      // Inicializar la variable precio a 0, y una variable total para la venta
      let precio = 0;
      let total = 0;
  
      // Verificar si se compra un cómic
      if (comic_id) {
        const [comic] = await pool.query('SELECT precio FROM comics WHERE id = ?', [comic_id]);
        if (!comic.length) throw new Error('Cómic no encontrado');
        // Si hay cómic, añadir el precio al total
        precio = comic[0].precio;
        total += precio * cantidad; // Sumar el precio del cómic
      }
  
      // Verificar si se compra un merchandising
      if (merchan_id) {
        const [merchan] = await pool.query('SELECT precio FROM merchan WHERE id = ?', [merchan_id]);
        if (!merchan.length) throw new Error('Merchan no encontrado');
        // Si hay merchandising, añadir el precio al total
        precio = merchan[0].precio;
        total += precio * cantidad; // Sumar el precio del merchandising
      }
  
      // Verificar que el total sea mayor que 0 antes de insertar la venta
      if (total <= 0) {
        throw new Error('El total de la venta no puede ser cero o negativo');
      }

      // Insertar la venta en la base de datos
      const [result] = await pool.query(
        'INSERT INTO ventas (usuario_id, comic_id, merchan_id, cantidad, total) VALUES (?, ?, ?, ?, ?)',
        [usuario_id, comic_id || null, merchan_id || null, cantidad, total]
      );
  
      return result.insertId; // Devuelve el ID de la venta insertada
    } catch (error) {
      throw new Error('Error al añadir la venta: ' + error.message);
    }
}

module.exports = {
    getAllVentas,
    getVentasById,
    addVenta
}
const mysql = require('mysql2');

const Connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comics'
})

//Linea de prueba
//Linea 2 de prueba
const createTableUsuario = 'CREATE TABLE usuarios (id int(15) NOT NULL AUTO_INCREMENT,'+
'nombre varchar (50) DEFAULT NULL,' +
'email varchar (50) DEFAULT NULL,' +
'contrasenia int (20) DEFAULT NULL,' +
'permiso int (3) DEFAULT NULL,'+
'PRIMARY KEY (id))';

const createTableComics = 'CREATE TABLE comics (id int(15) NOT NULL AUTO_INCREMENT,'+
'titulo varchar(150)DEFAULT NULL,'+
'autor varchar (100) DEFAULT NULL,'+
'editorial varchar(100) DEFAULT NULL,'+
'genero varchar (100) DEFAULT NULL,'+
'precio float (10) DEFAULT NULL,'+
'stock int (20) DEFAULT NULL,'+
'imagen varchar(150) DEFAULT NULL,'+
'PRIMARY KEY (id))';

const createTableMerchan = 'CREATE TABLE merchan (id int(15) NOT NULL AUTO_INCREMENT,'+
'nombre varchar(150)DEFAULT NULL,'+
'categoria varchar (100) DEFAULT NULL,'+
'fabricante varchar(100) DEFAULT NULL,'+
'precio float (10) DEFAULT NULL,'+
'stock int (20) DEFAULT NULL,'+
'PRIMARY KEY (id))';

//'YYY-MM-DD hh:mm:ss'
const createTableVentas = 'CREATE TABLE ventas (id int(15) NOT NULL AUTO_INCREMENT,'+
'usuario_id int (15) NOT NULL,'+
'comic_id int (15),'+
'merchan_id int(15),'+
'fecha_venta DATETIME,'+ 
'cantidad int (50) NOT NULL,'+
'total int (50) NOT NULL DEFAULT 0,'+
'PRIMARY KEY (id),'+
'CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),'+
'CONSTRAINT fk_comic FOREIGN KEY (comic_id) REFERENCES comics(id),'+
'CONSTRAINT fk_merchan FOREIGN KEY (merchan_id) REFERENCES merchan (id))';

const createTableResenias = 'CREATE TABLE resenias (id int(15) NOT NULL AUTO_INCREMENT,'+
'usuario_id int(15) NOT NULL,'+
'comic_id int (15),'+
'valoracion int(5),'+
'comentario varchar(1500),'+
'fecha_resenia DATETIME,'+
'PRIMARY KEY (id),'+
'CONSTRAINT fk_resenias_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),'+
'CONSTRAINT fk_resenias_comic FOREIGN KEY (comic_id) REFERENCES comics(id))';

const createTableComicsSubidos = 'CREATE TABLE comics_subidos (id int(15) NOT NULL AUTO_INCREMENT,'+
'usuario_id int(15) NOT NULL,'+
'titulo varchar(150)DEFAULT NULL,'+
'imagen varchar(150) DEFAULT NULL,'+
'autor varchar (100) DEFAULT NULL,'+
'editorial varchar(100) DEFAULT NULL,'+
'genero varchar (100) DEFAULT NULL,'+
'precio float (10) DEFAULT NULL,'+
'PRIMARY KEY (id))'
'CONSTRAINT fk_comics_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id))';

const createTableIntercambios =  'CREATE TABLE intercambios (id int(15) NOT NULL AUTO_INCREMENT,' +
  'comic_id int(15) NOT NULL,' +
  'comentario varchar(1500),' +
  'fecha_comentario DATETIME,' +
  'estado_intercambio varchar(10) NOT NULL,' +
  'PRIMARY KEY (id))'
  'CONSTRAINT fk_comics_subidos_usuario FOREIGN KEY (comic_id) REFERENCES comics_subidos(id))';

const createTableComentarios = 'CREATE TABLE comentarios (id int(15) NOT NULL AUTO_INCREMENT,'+
  'intercambio_id int(15) NOT NULL,'+
  'usuario_id int(15) NOT NULL,'+
  'comentario varchar(1500),'+
  'fecha_comentario DATETIME,'+
  'PRIMARY KEY (id),'+
  'CONSTRAINT fk_usuario_intercambio FOREIGN KEY (usuario_id) REFERENCES usuarios(id),'+
  'CONSTRAINT fk_comentario_intercambio FOREIGN KEY (intercambio_id) REFERENCES intercambios(id))';


Connection.getConnection(function(error, conexion){
    conexion.query(createTableComics, function(e){
        if(e) throw e;
        
        else{
            console.log("Tabla creada con exito");
        }
    })

    conexion.release();
})





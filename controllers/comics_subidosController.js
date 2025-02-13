const comics_subidosModel = require ('../models/comics_subidosModel.js')

async function getAllUploadedComics (req,res){
    try {
        const uploadedComic = await comics_subidosModel.getAllUploadedComics();
        res.json(uploadedComic);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los comics subidos',error})
    }
}

async function getComicSubidoById (req,res){
    try {
        const csById = await comics_subidosModel.getComicSubidoById(req.params.id);
        res.json(csById);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener el comic subido',error})
    }
}

async function addUploadedComic(req, res) {
    try {
        console.log("📌 Datos recibidos en el servidor:", req.body);
        console.log("📌 Usuario autenticado:", req.user);

        const usuario_id = req.user?.id;
        const { titulo, imagen, autor, editorial, genero, precio } = req.body;

        if (!usuario_id) {
            console.error("❌ Error: Usuario no autenticado");
            return res.status(401).json({ message: "Usuario no autenticado" });
        }

        if (!titulo || !imagen) {
            console.error("❌ Error: Faltan campos obligatorios");
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const newComicId = await comics_subidosModel.addComicSubido({
            usuario_id,
            titulo,
            imagen,
            autor,
            editorial,
            genero,
            precio,
        });

        console.log("✅ Cómic subido con éxito, ID:", newComicId);
        res.status(201).json({ message: "Cómic subido con éxito", id: newComicId });
    } catch (error) {
        console.error("🔥 Error al subir el cómic:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

async function updateUploadedComic (req,res){
    try {
        const updatedRows = await comics_subidosModel.updateUploadedComic( req.params.id,req.body);
        if(!updatedRows) return res.status(404).json({message: 'Comic subido no encontrado'});
        res.json({message:'Tu comic subido ha sido actualizado'});
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar tu comic subido',error})
    }
}

async function deleteUploadedComic (req,res){
    try {
        const updatedRows = await comics_subidosModel.deleteUploadedComic(req.params.id)
        if(!updatedRows)return res.status(404).json({message: 'Comic seleccionado no encontrado'});
        res.json({message: 'Comic subido eliminado'})
    } catch (error) {
        res.status(500).json({message: 'error al eliminar el comic subido',error})
    }
}

async function getComicsByUser(req, res) {
    try {
        const userId = req.user.id; // ID del usuario autenticado
        const comics = await comics_subidosModel.getComicsByUserId(userId);
        res.json(comics);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los cómics del usuario", error });
    }
}

module.exports = {
    getAllUploadedComics,
    getComicSubidoById,
    getComicsByUser,
    addUploadedComic,
    updateUploadedComic,
    deleteUploadedComic
}
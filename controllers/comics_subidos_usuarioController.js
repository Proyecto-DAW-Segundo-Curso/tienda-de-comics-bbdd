const comicsSubidosUsuarioModel = require('../models/comics_subidos_usuarioModel.js');
const intercambioModel = require('../models/intercambioModel.js');

async function getAllComicsSubidosUsuario(req, res) {
    try {
        const usuario_id = req.user.id; // Extraer el ID del usuario autenticado

        if (!usuario_id) {
            return res.status(400).json({ message: "No se pudo determinar el usuario." });
        }

        const comics = await comicsSubidosUsuarioModel.getComicsByUsuarioId(usuario_id);
        res.json(comics);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los cómics del usuario', error });
    }
}


async function getComicSubidoUsuarioById(req, res) {
    try {
        const comic = await comicsSubidosUsuarioModel.getComicSubidoUsuarioById(req.params.id);
        if (!comic) return res.status(404).json({ message: 'Cómic no encontrado' });
        res.json(comic);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cómic subido por usuario', error });
    }
}

async function addComicSubidoUsuario(req, res) {
    try {
        console.log("✅ Recibiendo datos para agregar cómic:", req.body);
        console.log("✅ Datos del usuario autenticado:", req.user); // Verifica que el usuario esté en req.user

        const usuario_id = req.user.id; // Extraer ID del usuario autenticado

        if (!usuario_id) {
            return res.status(400).json({ message: "No se pudo determinar el usuario." });
        }

        const nuevoComic = {
            usuario_id, // Se usa el usuario_id obtenido del token
            titulo: req.body.titulo,
            imagen: req.body.imagen,
            autor: req.body.autor,
            editorial: req.body.editorial,
            genero: req.body.genero,
            precio: req.body.precio
        };

        console.log("📥 Enviando datos al modelo:", nuevoComic);

        const nuevoComicId = await comicsSubidosUsuarioModel.addComicSubidoUsuario(nuevoComic);
        res.status(201).json({ message: 'Cómic subido por usuario añadido', id: nuevoComicId });
    } catch (error) {
        console.error("🔥 Error al añadir cómic en el backend:", error);
        res.status(500).json({ message: 'Error al añadir el cómic subido por usuario', error: error.message });
    }
}



async function updateComicSubidoUsuario(req, res) {
    try {
        const updatedRows = await comicsSubidosUsuarioModel.updateComicSubidoUsuario(req.params.id, req.body);
        if (!updatedRows) return res.status(404).json({ message: 'Cómic no encontrado' });
        res.json({ message: 'Cómic actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cómic subido por usuario', error });
    }
}

async function deleteComicSubidoUsuario(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del cómic desde la URL

        if (!id) {
            return res.status(400).json({ message: "Falta el ID del cómic a eliminar." });
        }

        const deletedRows = await comicsSubidosUsuarioModel.deleteComicSubidoUsuario(id);
        
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Cómic no encontrado o ya eliminado." });
        }

        res.json({ message: "Cómic eliminado correctamente." });
    } catch (error) {
        console.error("🔥 Error al eliminar el cómic:", error);
        res.status(500).json({ message: "Error al eliminar el cómic", error: error.message });
    }
}
async function ofertarComic(req, res) {
    try {
        const { comic_id, comentario, estado_intercambio } = req.body;

        if (!comic_id || !estado_intercambio) {
            return res.status(400).json({ message: "Faltan datos necesarios." });
        }

        try {
            const intercambioId = await intercambioModel.ofertarComic(comic_id, comentario, estado_intercambio);
            res.status(201).json({ message: "Cómic ofertado exitosamente", intercambio_id: intercambioId });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    } catch (error) {
        console.error("❌ Error en el controlador al ofertar el cómic:", error);
        res.status(500).json({ message: "Error al ofertar el cómic", error: error.message });
    }
}

async function getAllIntercambios(req, res) {
    try {
        const intercambios = await intercambioModel.getAllIntercambios();
        res.json(intercambios);
    } catch (error) {
        console.error("❌ Error al obtener las ofertas:", error);
        res.status(500).json({ message: "Error al obtener las ofertas", error: error.message });
    }
}

module.exports = {
    getAllComicsSubidosUsuario,
    getComicSubidoUsuarioById,
    addComicSubidoUsuario,
    updateComicSubidoUsuario,
    deleteComicSubidoUsuario,
    getAllIntercambios,
    ofertarComic
};

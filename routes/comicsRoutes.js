const express = require('express');
const comicsController = require('../controllers/comicsController');

const router = express.Router();

router.get('/', comicsController.getAllComics);
router.get('/:id', comicsController.getComicById);
router.post('/', comicsController.addComic);
router.put('/:id', comicsController.updateComic);
router.delete('/:id', comicsController.deleteComic);

module.exports = router;

const express = require('express');
const { getAllComics, createComic, getComicById, updateComic, deleteComic } = require('../controllers/comicsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllComics);
router.get('/:id', getComicById);
router.post('/', authMiddleware, createComic);
router.put('/:id', authMiddleware, updateComic);
router.delete('/:id', authMiddleware, deleteComic);

module.exports = router;

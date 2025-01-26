const express = require('express');
const { getAllComics, getComicById, getComicsByAuthor, getComicsByCollection, createComic, updateComic, deleteComic } = require('../controllers/comicsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllComics);
router.get('/:id', getComicById);
router.get('/author/:author', getComicsByAuthor);
router.get('/collection/:collection', getComicsByCollection);
router.post('/', authMiddleware, createComic);
router.put('/:id', authMiddleware, updateComic);
router.delete('/:id', authMiddleware, deleteComic);

module.exports = router;

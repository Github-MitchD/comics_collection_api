const express = require('express');
const { getAllComics, createComic, getComicById, updateComic } = require('../controllers/comicsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllComics);
router.get('/:id', getComicById);
router.post('/', authMiddleware, createComic);
router.put('/:id', authMiddleware, updateComic);

module.exports = router;

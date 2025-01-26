const express = require('express');
const { getAllComics, createComic, getComicById } = require('../controllers/comicsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllComics);
router.get('/:id', getComicById);
router.post('/', authMiddleware, createComic);

module.exports = router;

const express = require('express');
const { getAllComics, createComic } = require('../controllers/comicsController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllComics);
router.post('/', authMiddleware, createComic);

module.exports = router;

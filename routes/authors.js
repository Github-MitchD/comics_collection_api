const express = require('express');
const { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } = require('../controllers/authorController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createAuthor);
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.put('/:id', authMiddleware, updateAuthor);
router.delete('/:id', authMiddleware, deleteAuthor);

module.exports = router;
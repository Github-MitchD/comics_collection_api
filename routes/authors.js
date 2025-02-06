const express = require('express');
const { createAuthor, getAllAuthors, getAuthorById, getAuthorBySlug, updateAuthorWithoutImage,updateAuthorWithImage, deleteAuthor } = require('../controllers/authorController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const uploadAuthors = require('../config/multerAuthors');

router.post('/', authMiddleware, uploadAuthors.single('image'), createAuthor);
router.get('/', getAllAuthors);
router.get('/id/:id', getAuthorById);
router.get('/name/:slug', getAuthorBySlug);
router.put('/id/withoutImage/:id', authMiddleware, updateAuthorWithoutImage);
router.put('/id/withImage/:id', authMiddleware, uploadAuthors.single('image'), updateAuthorWithImage);
router.delete('/:id', authMiddleware, deleteAuthor);

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Managing authors
 */

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the 
 *               slug:
 *                 type: string
 *                 description: Slug of the author
 *               image:
 *                 type: string
 *                 description: URL of the author's image
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: Birthdate of the author
 *               bio:
 *                 type: string
 *                 description: Biography of the author
 *               website:
 *                 type: string
 *                 description: Website of the author
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Retrieve a list of authors
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 authors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Author'
 *       500:
 *         description: Server error
*/

/**
 * @swagger
 * /authors/id/{id}:
 *   get:
 *     summary: Retrieve an author by ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Author ID
 *     responses:
 *       200:
 *         description: An author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
*/

/**
 * @swagger
 * /authors/name/{slug}:
 *   get:
 *     summary: Retrieve an author by slug
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Author slug
 *     responses:
 *       200:
 *         description: An author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /authors/id/withImage/{id}:
 *   put:
 *     summary: Update an author by ID
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the author
 *               slug:
 *                 type: string
 *                 description: Slug of the author
 *               image:
 *                 type: string
 *                 description: URL of the author's image
 *               birthdate:
 *                 type: string
 *                 format: date
 *               bio:
 *                 type: string
 *                 description: Biography of the author
 *               website:
 *                 type: string
 *                 description: Website of the author
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /authors/id/withoutImage/{id}:
 *   put:
 *     summary: Update an author by ID without changing the image
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the author
 *               slug:
 *                 type: string
 *                 description: Slug of the author
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: Birthdate of the author
 *               bio:
 *                 type: string
 *                 description: Biography of the author
 *               website:
 *                 type: string
 *                 description: Website of the author
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author by ID
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Author not found
 *       500:
 *         description: Server error
*/

module.exports = router;
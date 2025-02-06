const express = require('express');
const { getAllComics, getComicById, getComicBySlug, getComicsByAuthor, getComicsByCollection, getLatestComics, createComic, updateComicWithoutImage, updateComicWithImage, deleteComic } = require('../controllers/comicsController');
const authMiddleware = require('../middlewares/authMiddleware');
const uploadComics = require('../config/multerComics');

const router = express.Router();

router.get('/', getAllComics);
router.get('/:id', getComicById);
router.get('/title/:slug', getComicBySlug);
router.get('/author/:author', getComicsByAuthor);
router.get('/collection/:collection', getComicsByCollection);
router.get('/news/desc', getLatestComics);
router.post('/', authMiddleware, uploadComics.single('frontCover'), createComic);
router.put('/id/withoutImage/:id', authMiddleware, updateComicWithoutImage);
router.put('/id/withImage/:id', authMiddleware, uploadComics.single('frontCover'), updateComicWithImage);
router.delete('/:id', authMiddleware, deleteComic);

/**
 * @swagger
 * tags:
 *   name: Comics
 *   description: Everything about comics
 */

/**
 * @swagger
 * /comics:
 *   get:
 *     summary: Retrieve a list of comics
 *     tags: [Comics]
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: A list of comics
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
 *                 comics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comic'
 */
/**
 * @swagger
 * /comics/{id}:
 *   get:
 *     summary: Retrieve a comic by ID
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Comic ID
 *     responses:
 *       200:
 *         description: A comic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comic'
 *       404:
 *         description: Comic not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /comics/author/{author}:
 *   get:
 *     summary: Retrieve comics by author
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: author
 *         schema:
 *           type: string
 *         required: true
 *         description: Author name
 *     responses:
 *       200:
 *         description: A list of comics by the author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comic'
 *       404:
 *         description: No comics found for this author
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /comics/collection/{collection}:
 *   get:
 *     summary: Retrieve comics by collection
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: collection
 *         schema:
 *           type: string
 *         required: true
 *         description: Collection name
 *     responses:
 *       200:
 *         description: A list of comics by the collection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comic'
 *       404:
 *         description: No comics found for this collection
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /comics:
 *   post:
 *     summary: Create a new comic
 *     tags: [Comics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - frontCover
 *               - backCover
 *               - description
 *               - collection
 *               - tome
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the comic
 *               slug:
 *                 type: string
 *                 description: Slug of the comic
 *               frontCover:
 *                 type: string
 *                 description: URL of the front cover image
 *               backCover:
 *                 type: string
 *                 description: URL of the back cover image
 *               description:
 *                 type: string
 *                 description: Description of the comic
 *               collection:
 *                 type: string
 *                 description: Collection name
 *               tome:
 *                 type: integer
 *                 description: Tome number
 *               authorId:
 *                 type: integer
 *                 description: ID of the author
 *     responses:
 *       201:
 *         description: Comic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comic'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /comics/{id}:
 *   put:
 *     summary: Update a comic by ID
 *     tags: [Comics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Comic ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the comic
 *               slug:
 *                 type: string
 *                 description: Slug of the comic
 *               frontCover:
 *                 type: string
 *                 description: URL of the front cover image
 *               backCover:
 *                 type: string
 *                 description: URL of the back cover image
 *               description:
 *                 type: string
 *                 description: Description of the comic
 *               collection:
 *                 type: string
 *                 description: Collection name
 *               tome:
 *                 type: integer
 *                 description: Tome number
 *               authorId:
 *                 type: integer
 *                 description: ID of the author
 *     responses:
 *       200:
 *         description: Comic updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comic'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comic not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /comics/{id}:
 *   delete:
 *     summary: Delete a comic by ID
 *     tags: [Comics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Comic ID
 *     responses:
 *       200:
 *         description: Comic deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Comic not found
 *       500:
 *         description: Server error
 */
module.exports = router;

const { Comic, Author } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');
const logger = require('../utils/logger');

// Schéma de validation pour les comics
const comicSchema = Joi.object({
    title: Joi.string().required(),
    slug: Joi.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).required(),
    frontCover: Joi.string().optional(),
    description: Joi.string().required(),
    collection: Joi.string().required(),
    tome: Joi.number().integer().required(),
    authorId: Joi.number().integer().required(),
});

exports.getAllComics = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { author: { [Op.like]: `%${search}%` } },
                { collection: { [Op.like]: `%${search}%` } }
            ];
        }

        const comics = await Comic.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            total: comics.count,
            pages: Math.ceil(comics.count / limit),
            currentPage: parseInt(page),
            comics: comics.rows
        });
    } catch (error) {
        logger.error(`Error fetching comics: ${error.message}`);
        return res.status(500).json({ message: 'There was a problem trying to get all comics', error: error.message });
    }
};

exports.getComicById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Comic ID is required.' });
        }
        const comicId = parseInt(id);
        if (isNaN(comicId)) {
            return res.status(400).json({ message: 'Comic ID is not valid.' });
        }
        const comic = await Comic.findByPk(comicId, {
            include: {
                model: Author,
                as: 'author',
                attributes: ['id', 'name', 'image', 'birthdate']
            }
        });
        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }
        return res.status(200).json(comic);
    }
    catch (error) {
        logger.error(`Error fetching comic with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'There was a problem trying to get the comic', error: error.message });
    }
};

exports.getComicBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({ message: 'Comic slug is required.' });
        }
        const comic = await Comic.findOne({ 
            where: { slug }, 
            include: [{ model: Author, as: 'author' }] 
        });
        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }
        return res.status(200).json(comic);
    } catch (error) {
        logger.error(`Error fetching comic with slug ${req.params.slug}: ${error.message}`);
        return res.status(500).json({ message: 'There was a problem trying to get the comic', error: error.message });
    }
};

exports.getComicsByAuthor = async (req, res) => {
    try {
        const { author } = req.params;
        if (!author) {
            return res.status(400).json({ message: 'Author is required.' });
        }

        const comics = await Comic.findAll({
            where: { author: { [Op.like]: `%${author}%` } },
            order: [['createdAt', 'DESC']]
        });

        if (comics.length === 0) {
            return res.status(404).json({ message: 'No comics found for this author.' });
        }

        return res.status(200).json(comics);
    } catch (error) {
        logger.error(`Error fetching comics by author ${req.params.author}: ${error.message}`);
        return res.status(500).json({ message: 'There was a problem trying to get comics by author', error: error.message });
    }
};

exports.getComicsByCollection = async (req, res) => {
    try {
        const { collection } = req.params;
        if (!collection) {
            return res.status(400).json({ message: 'Collection is required.' });
        }

        const comics = await Comic.findAll({
            where: { collection: { [Op.like]: `%${collection}%` } },
            order: [['createdAt', 'DESC']]
        });

        if (comics.length === 0) {
            return res.status(404).json({ message: 'No comics found for this collection.' });
        }

        return res.status(200).json(comics);
    } catch (error) {
        logger.error(`Error fetching comics by collection ${req.params.collection}: ${error.message}`);
        return res.status(500).json({ message: 'There was a problem trying to get comics by collection', error: error.message });
    }
};

exports.createComic = async (req, res) => {
    try {
        const { error } = comicSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { title, slug, description, collection, tome, authorId } = req.body;

        let imageName = 'default_comic.jpg';
        if (req.file && req.file.filename) {
            imageName = req.file.filename;
        }
        const newComic = await Comic.create({ title, slug, frontCover: imageName, description, collection, tome, authorId });
        logger.info(`Comic with title "${title}" was created by user ${req.user.id}`);
        return res.status(201).json(newComic);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Comic with this title or slug already exists.' });
        }
        logger.error(`Error creating comic: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateComic = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Comic ID is required.' });
        }
        const comicId = parseInt(id);
        if (isNaN(comicId)) {
            return res.status(400).json({ message: 'Comic ID is not valid.' });
        }

        const { error } = comicSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const comic = await Comic.findByPk(comicId);
        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        // Vérification de l'unicité du title et du slug uniquement s'ils sont modifiés
        if (req.body.title && req.body.title !== comic.title) {
            const existingComicWithTitle = await Comic.findOne({ where: { title: req.body.title, id: { [Op.ne]: comicId } } });
            if (existingComicWithTitle) {
                return res.status(400).json({ message: 'Comic with this title already exists.' });
            }
        }

        if (req.body.slug && req.body.slug !== comic.slug) {
            const existingComicWithSlug = await Comic.findOne({ where: { slug: req.body.slug, id: { [Op.ne]: comicId } } });
            if (existingComicWithSlug) {
                return res.status(400).json({ message: 'Comic with this slug already exists.' });
            }
        }

        // Mise à jour des champs modifiés
        const updatedComic = await comic.update(req.body);
        logger.info(`Comic with ID ${comicId} was updated by user ${req.user.id}`);
        return res.status(200).json(updatedComic);
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Comic with this title or slug already exists.' });
        }
        logger.error(`Error updating comic with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'There was a problem trying to update the comic', error: error.message });
    }
};

exports.deleteComic = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Comic ID is required.' });
        }
        const comicId = parseInt(id);
        if (isNaN(comicId)) {
            return res.status(400).json({ message: 'Comic ID is not valid.' });
        }

        const comic = await Comic.findByPk(comicId);
        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }

        await comic.destroy();
        logger.info(`Comic with ID ${comicId} was deleted by user ${req.user.id}`);
        return res.status(200).json({ message: `Comic with ID ${comicId} was successfully deleted.` });
    } catch (error) {
        logger.error(`Error deleting comic with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const { Author } = require('../models');
const Joi = require('joi');
const logger = require('../utils/logger');

// Schéma de validation pour les auteurs
const authorSchema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    image: Joi.string().required(),
    birthdate: Joi.date().optional(),
    bio: Joi.string().optional(),
    website: Joi.string().uri().optional()
});

exports.createAuthor = async (req, res) => {
    try {
        const { error } = authorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { name, slug, image, birthdate, bio, website } = req.body;
        const newAuthor = await Author.create({ name, slug, image, birthdate, bio, website });
        logger.info(`Author with name "${name}" was created by user ${req.user.id}.`);
        return res.status(201).json(newAuthor);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Author with this name already exists.' });
        }
        logger.error(`Error creating author: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAllAuthors = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows } = await Author.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            authors: rows
        });
    } catch (error) {
        logger.error(`Error fetching authors: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getAuthorById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Author ID is required.' });
        }
        const authorId = parseInt(id);
        if (isNaN(authorId)) {
            return res.status(400).json({ message: 'Author ID is not valid.' });
        }
        const author = await Author.findByPk(id, { include: ['comics'] });
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        return res.status(200).json(author);
    } catch (error) {
        logger.error(`Error fetching author with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Author ID is required.' });
        }
        const authorId = parseInt(id);
        if (isNaN(authorId)) {
            return res.status(400).json({ message: 'Author ID is not valid.' });
        }
        const { error } = authorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const author = await Author.findByPk(id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        const { name, slug, image, birthdate, bio, website } = req.body;
        const updatedAuthor = await author.update({ name, slug, image, birthdate, bio, website });
        logger.info(`Author with ID ${id} was updated by user ${req.user.id}`);
        return res.status(200).json(updatedAuthor);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Author with this name already exists.' });
        }
        logger.error(`Error updating author with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Author ID is required.' });
        }
        const authorId = parseInt(id);
        if (isNaN(authorId)) {
            return res.status(400).json({ message: 'Author ID is not valid.' });
        }
        const author = await Author.findByPk(id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        await author.destroy();
        logger.info(`Author with ID ${id} was deleted by user ${req.user.id}`);
        return res.status(200).json({ message: `Author with ID ${authorId} was successfully deleted.` });
    } catch (error) {
        logger.error(`Error deleting author with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
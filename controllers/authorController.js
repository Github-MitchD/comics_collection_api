const { sequelize, Author, Comic } = require('../models');
const Joi = require('joi');
const logger = require('../utils/logger');
const { BASE_URL } = require('../config');

// Schéma de validation pour les auteurs
const authorSchema = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    image: Joi.string().optional(),
    birthdate: Joi.date().optional(),
    bio: Joi.string().optional(),
    website: Joi.string().uri().optional()
});
// Schéma de validation pour les auteurs sans image
const authorSchemaWithoutImage = Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().required(),
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

        const { name, slug, birthdate, bio, website } = req.body;

        // Gestion de l'image par 'multer'
        // Multer stocke tout dans req.file (si on utilise upload.single('image'))
        // req.file contiendra notamment:
        //   - req.file.filename     => le nom final du fichier sur le serveur
        //   - req.file.path         => le chemin complet vers le fichier
        //   - req.file.originalname => le nom original envoyé par le client
        let imageName = 'default_author.jpg';
        if (req.file) {
            imageName = req.file.filename;
        }

        const newAuthor = await Author.create({ name, slug, image: imageName, birthdate, bio, website });
        logger.info(`Author with name "${name}" was created by user ${req.user.id}.`);

        const imageUrl = `${BASE_URL}/public/uploads/authors/${imageName}`;
        const authorResponse = {
            ...newAuthor.toJSON(),
            image: imageUrl
        };
        return res.status(201).json(authorResponse);
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
            order: [['name', 'ASC']],
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM \`Comics\`
                            WHERE \`Comics\`.\`authorId\` = \`Author\`.\`id\`
                          )`),
                        'comicsCount'
                    ]
                ]
            },
        });

        // Ajoute l'URL complète de l'image pour chaque auteur
        const authors = rows.map(author => {
            const authorJson = author.toJSON();
            authorJson.image = `${BASE_URL}/public/uploads/authors/${author.image}`;
            return authorJson;
        });

        return res.status(200).json({
            total: count,
            pages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            authors: authors
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

exports.getAuthorBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        if (!slug) {
            return res.status(400).json({ message: 'Author slug is required.' });
        }
        const author = await Author.findOne({
            where: { slug },
            include: [{
                model: Comic,
                as: 'comics',
                separate: true, // L'option separate permet de séparer les résultats
                order: [['collection', 'ASC'], ['tome', 'ASC']]
            }]
        });
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        return res.status(200).json(author);
    } catch (error) {
        logger.error(`Error fetching author with slug ${req.params.slug}: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateAuthorWithoutImage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Author ID is required.' });
        }
        const authorId = parseInt(id);
        if (isNaN(authorId)) {
            return res.status(400).json({ message: 'Author ID is not valid.' });
        }
        const { error } = authorSchemaWithoutImage.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const author = await Author.findByPk(id);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        const { name, slug, birthdate, bio, website } = req.body;
        await author.update({ name, slug, birthdate, bio, website });
        logger.info(`Author with ID ${id} was updated by user ${req.user.id}`);
        return res.status(200).json(author);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Author with this name already exists.' });
        }
        logger.error(`Error updating author with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateAuthorWithImage = async (req, res) => {
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
        const { name, slug, birthdate, bio, website } = req.body;
        let imageName = author.image;
        if (req.file) {
            imageName = req.file.filename;
        }
        await author.update({ name, slug, image: imageName, birthdate, bio, website });
        logger.info(`Author with ID ${id} was updated by user ${req.user.id}`);
        const imageUrl = `${BASE_URL}/public/uploads/authors/${imageName}`;
        const authorResponse = {
            ...author.toJSON(),
            image: imageUrl
        };
        return res.status(200).json(authorResponse);
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
        const author = await Author.findByPk(id, { include: ['comics'] });
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }
        if (author.comics.length > 0) {
            return res.status(400).json({ message: 'Cannot delete author with associated comics.' });
        }
        await author.destroy();
        logger.info(`Author with ID ${id} was deleted by user ${req.user.id}`);
        return res.status(200).json({ message: `Author with ID ${authorId} was successfully deleted.` });
    } catch (error) {
        logger.error(`Error deleting author with ID ${req.params.id}: ${error.message}`);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
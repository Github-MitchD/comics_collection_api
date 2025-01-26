const { Comic } = require('../models');
const { Op } = require('sequelize');

exports.getAllComics = async (req, res) => {
    try {
        const comics = await Comic.findAll();
        return res.status(200).json(comics);
    } catch (error) {
        return res.status(500).json({ message: 'There was a problem trying to get all comics', error: error.message });
    }
};

exports.getComicById = async (req, res) => {
    try {
        const comicId = parseInt(req.params.id);
        if (!comicId || isNaN(comicId)) {
            return res.status(400).json({ message: 'Comic ID is not valid.' });
        }
        const comic = await Comic.findByPk(comicId);
        if (!comic) {
            return res.status(404).json({ message: 'Comic not found' });
        }
        return res.status(200).json(comic);
    }
    catch (error) {
        return res.status(500).json({ message: 'There was a problem trying to get the comic', error: error.message });
    }
};

exports.createComic = async (req, res) => {
    try {
        const { title, slug, frontCover, backCover, description, collection, tome, author } = req.body;

        // Validation des données d'entrée
        if (!title || !slug || !frontCover || !backCover || !description || !collection || !tome || !author) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newComic = await Comic.create({ title, slug, frontCover, backCover, description, collection, tome, author });
        return res.status(201).json(newComic);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Comic with this title or slug already exists.' });
        }
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.updateComic = async (req, res) => {
    try {
        const comicId = parseInt(req.params.id);
        if (!comicId || isNaN(comicId)) {
            return res.status(400).json({ message: 'Comic ID is not valid.' });
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

        const { title, slug, frontCover, backCover, description, collection, tome, author } = req.body;

        // Validation des données d'entrée
        if (!title || !slug || !frontCover || !backCover || !description || !collection || !tome || !author) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await comic.update({ title, slug, frontCover, backCover, description, collection, tome, author });
        return res.status(200).json(comic);
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Comic with this title or slug already exists.' });
        }
        return res.status(500).json({ message: 'There was a problem trying to update the comic', error: error.message });
    }
}

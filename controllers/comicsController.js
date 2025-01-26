const { Comic } = require('../models');

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

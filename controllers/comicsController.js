const { Comic } = require('../models');

exports.getAllComics = async (req, res) => {
    try {
        const comics = await Comic.findAll();
        return res.status(200).json(comics);
    } catch (error) {
        return res.status(500).json({ message: 'Server Error', error: error.message });
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

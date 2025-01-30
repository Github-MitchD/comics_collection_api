const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'This email already exists.' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const expiresIn = process.env.JWT_EXPIRATION;
        const expiresInMs = parseInt(expiresIn) * 60 * 60 * 1000; // Converti les heures en millisecondes
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn });
        if (!token) {
            return res.status(500).json({ message: 'Token generation failed' });
        }
        
        const expirationDate = new Date(Date.now() + expiresInMs);
        res.status(200).json({ message: 'Login successful', token, expiresAt: expirationDate.toISOString() });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

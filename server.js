const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const comicsController = require('./controllers/comicsController');
// const usersController = require('./controllers/usersController');
require('dotenv').config();

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 8989;

// Middleware
app.use(bodyParser.json());

// Importation des routes
const comicsRoutes = require('./routes/comics');
const authRoutes = require('./routes/auth');

// Route pour la racine de l'API
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Comics Collection API',
        version: '1.0.0',
        documentation: 'http://localhost:8989/docs',
        status: 'API is running',
        author: {
            name: 'Michel Dufour',
            website: 'https://micheldufour.fr',
            github: 'https://github.com/Github-MitchD'
        },
        endpoints: {
            comics: '/comics',
            auth: '/auth'
        }
    });
});

// Routes
app.use('/comics', comicsRoutes);
app.use('/auth', authRoutes);

// app.get('/users', usersController.getAllUsers);
// app.post('/users', usersController.createUser);

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync()
    .then(() => {
        app.listen(SERVER_PORT, () => {
            console.log(`Server is running on port ${SERVER_PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
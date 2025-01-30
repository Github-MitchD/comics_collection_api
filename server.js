const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const comicsController = require('./controllers/comicsController');
require('dotenv').config();
const path = require('path');
const { BASE_URL } = require('./config');

const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 8989;

// Middleware
app.use(bodyParser.json());

// Importation des routes
const comicsRoutes = require('./routes/comics');
const authRoutes = require('./routes/auth');
const authorRoutes = require('./routes/authors');

// Importation de Swagger
const { swaggerUi, specs, swaggerOptions } = require('./config/swagger');

// Route pour la documentation Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// Permet de servir le dossier "public" statiquement
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route pour la racine de l'API
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Comics Collection API',
        version: '1.0.0',
        documentation: `${BASE_URL}/docs`,
        status: 'API is running',
        author: {
            name: 'Michel Dufour',
            website: 'https://micheldufour.fr',
            github: 'https://github.com/Github-MitchD'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        },
        endpoints: {
            comics: '/comics',
            auth: '/auth',
            authors: '/authors'
        }
    });
});

// Routes
app.use('/comics', comicsRoutes);
app.use('/auth', authRoutes);
app.use('/authors', authorRoutes);

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
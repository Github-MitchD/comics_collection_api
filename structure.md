comics_collection_api/
├── config/
│   └── config.js               // Configuration Sequelize
│   └── swagger.js              // Configuration Swagger
├── controllers/
│   └── authController.js       // Logique métier pour l'authentification
│   └── authorController.js     // Logique métier pour les auteurs
├── http_requests/
│   └── api_request_author.http // Exemples de requêtes HTTP pour les auteurs
│   └── api_request_comic.http  // Exemples de requêtes HTTP pour les comics
├── logs/
│   └── combined.log            // Fichier de logs combinés (informations et erreurs)
│   └── error.log               // Fichier de logs des erreurs
├── middlewares/
│   └── authMiddleware.js       // Middleware pour la sécurité
├── models/
│   └── author.js               // Modèle Author
│   └── comic.js                // Modèle Comic
│   └── index.js                // Point d'entrée Sequelize
│   └── user.js                 // Modèle User
├── routes/
│   └── auth.js                 // Routes pour l'authentification
│   └── authors.js              // Routes pour les auteurs
│   └── comics.js               // Routes pour les comics
├── utils/
│   └── logger.js               // Utilitaire pour les logs avec winston
├── .env                        // Variables d'environnement
├── .gitignore                  // Variables d'environnement
├── LICENSE                     // Licence du projet
├── package-lock.json           // Dépendances verrouillées
├── package.json                // Dépendances du projet
├── README.md                   // Documentation du projet
└── server.js                   // Point d'entrée principal

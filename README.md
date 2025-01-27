# Comics Collection API

## Description

API RESTful pour la gestion des collections de comics, développée avec Node.js et Sequelize. Ce projet est conçu comme une démonstration et est disponible dans mon portfolio.

## Fonctionnalités

- Authentification des utilisateurs avec JWT
- Contrôle d'accès basé sur les rôles (admin)
- Opérations CRUD pour les comics et les auteurs
- Documentation Swagger
- Journalisation avec Winston
- ORM Sequelize pour la gestion de la base de données

## Table des matières

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Documentation de l'API](#documentation-de-lapi)
- [Structure du projet](#structure-du-projet)
- [Variables d'environnement](#variables-denvironnement)
- [Licence](#licence)
- [Contact](#contact)

## Installation

1. Clonez le dépôt :
    ```sh
    git clone https://github.com/Github-MitchD/comics_collection_api.git
    cd comics_collection_api
    ```

2. Installez les dépendances :
    ```sh
    npm install
    ```

3. Configurez les variables d'environnement :
    Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :
    ```env
    SERVER_PORT=8989
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRATION=1h
    DATABASE_URL=your_database_url
    ```

4. Démarrez le serveur :
    ```sh
    npm start
    ```

## Utilisation

### Démarrer le serveur

Pour démarrer le serveur, exécutez :
```sh
npm start
```
Le serveur sera accessible sur http://localhost:8989.

## Documentation de l'API
La documentation de l'API est disponible à l'adresse http://localhost:8989/docs lorsque le serveur est en cours d'exécution. Elle fournit des informations détaillées sur les endpoints disponibles, les paramètres de requête et les réponses

## Structure du projet
Pour une vue d'ensemble de la structure du projet, consultez le fichier [STRUCTURE.md](STRUCTURE.md).

## Variables d'environnement
Les variables d'environnement sont stockées dans un fichier `.env` à la racine du projet. Elles sont chargées dans l'application à l'aide du package `dotenv`.
- `SERVER_PORT` : Port sur lequel le serveur écoute (par défaut : 8989)
- `JWT_SECRET` : Clé secrète utilisée pour signer les tokens JWT (par exemple : mysecretkey)
- `JWT_EXPIRATION` : Durée de validité des tokens JWT (par exemple : 1h pour 1 heure)
- `DATABASE_URL` : URL de connexion de la base de données

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

## Contact
Michel Dufour - [PORTFOLIO](https://micheldufour.fr/) - [LinkedIn](https://www.linkedin.com/in/michel-dufour-b7570b187/)

Lien du projet: [API Comics Collection](https://comics-collection-api.micheldufour.fr/)


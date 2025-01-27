const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Author = sequelize.define('Author', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "The name is required." },
                notNull: { msg: "The name is required." },
            }
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "The slug is required." },
                notNull: { msg: "The slug is required." },
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: { msg: "Must be a valid date." }
            }
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: { msg: "Must be a valid URL." }
            }
        }
    });

    Author.associate = (models) => {
        Author.hasMany(models.Comic, { foreignKey: 'authorId', as: 'comics' });
    };

    return Author;
};
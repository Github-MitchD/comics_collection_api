const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comic = sequelize.define('Comic', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "This title already exists." },
      validate: {
        notEmpty: { msg: "The title is required." },
        notNull: { msg: "The title is required." },
      }
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The slug is required." },
        notNull: { msg: "The slug is required." },
      }
    },
    frontCover: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The frontCover is required." },
        notNull: { msg: "The frontCover is required." },
      }
    },
    backCover: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The backCover is required." },
        notNull: { msg: "The backCover is required." },
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The description is required." },
        notNull: { msg: "The description is required." },
      }
    },
    collection: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The collection is required." },
        notNull: { msg: "The collection is required." },
      }
    },
    tome: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The author is required." },
        notNull: { msg: "The author is required." },
      }
    }
  });

  return Comic;
};
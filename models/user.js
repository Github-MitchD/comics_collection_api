const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "The username is required." },
        notNull: { msg: "The username is required." },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: { msg: "The email is required." },
        notNull: { msg: "The email is required." },
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notEmpty: { msg: "The password is required." },
        notNull: { msg: "The password is required." },
      }
    },
  });

  // Hook pour hasher le mot de passe avant de le sauvegarder
  // https://sequelize.org/docs/v6/other-topics/hooks/
  User.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT));
    user.password = hashedPassword;
  });

  // Méthode pour comparer le mot de passe
  User.checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };

  // Méthode pour définir les associations
  User.associate = (models) => {
    // définir les associations ici
  };

  return User;
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Vérifie si la colonne 'authorId' existe déjà
    const tableDefinition = await queryInterface.describeTable('Comics');
    if (!tableDefinition.authorId) {
      // Ajoute la colonne authorId sans contrainte de clé étrangère
      await queryInterface.addColumn('Comics', 'authorId', {
        type: Sequelize.INTEGER,
        allowNull: true, // Permet des valeurs nulles temporairement
      });

      // Met à jour les données existantes pour définir une valeur par défaut pour authorId
      await queryInterface.sequelize.query('UPDATE Comics SET authorId = 1 WHERE authorId IS NULL');

      // Modifie la colonne pour ne plus permettre les valeurs nulles
      await queryInterface.changeColumn('Comics', 'authorId', {
        type: Sequelize.INTEGER,
        allowNull: false,
      });

      // Ajoute la contrainte de clé étrangère
      await queryInterface.addConstraint('Comics', {
        fields: ['authorId'],
        type: 'foreign key',
        name: 'fk_comics_authorId',
        references: {
          table: 'Authors',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Vérifie si la colonne 'authorId' existe avant de la supprimer
    const tableDefinition = await queryInterface.describeTable('Comics');
    if (tableDefinition.authorId) {
      await queryInterface.removeConstraint('Comics', 'fk_comics_authorId');
      await queryInterface.removeColumn('Comics', 'authorId');
    }
  }
};

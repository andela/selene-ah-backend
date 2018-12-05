/**
 * @description migration for bookmark model
 */
export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bookmarks', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        },
      },
      articleId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'id'
        }
      }
    });
  },
  down: queryInterface => queryInterface.dropTable('Bookmarks')
};

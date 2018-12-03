export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('comments', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4
    },
    comment: {
      allowNull: false,
      type: Sequelize.TEXT
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
        model: 'User',
        key: 'id',
      },
    },
    articleId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Article',
        key: 'id'
      }
    }
  }),
  down: queryInterface => queryInterface.dropTable('comments')
};

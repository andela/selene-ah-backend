export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArticleVotes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      vote: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      articleId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: queryInterface => queryInterface.dropTable('ArticleVotes')
};

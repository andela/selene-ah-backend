export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArticleTags', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      articleId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Articles',
          key: 'id'
        },
      },
      tagId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Tags',
          key: 'id'
        },
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
  down: queryInterface => queryInterface.dropTable('ArticleTags')
};

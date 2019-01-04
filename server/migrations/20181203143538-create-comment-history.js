export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CommentHistories', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      commentHistory: {
        allowNull: false,
        type: Sequelize.STRING
      },
      commentId: {
        allowNull: false,
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Comments',
          key: 'id',
          as: 'commentId'
        }
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
  down: queryInterface => queryInterface.dropTable('CommentHistories')
};

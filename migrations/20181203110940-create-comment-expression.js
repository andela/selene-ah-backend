const CommentExpressions = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentExpressions', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    emotion: {
      type: Sequelize.STRING,
      allowNull: false
    },
    userId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'User',
        key: 'id'
      }
    },
    commentId: {
      type: Sequelize.UUID,
      onDelete: 'CASCADE',
      references: {
        model: 'Comment',
        key: 'id'
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
  }),
  down: queryInterface => queryInterface.dropTable('CommentExpressions')
};

export default CommentExpressions;

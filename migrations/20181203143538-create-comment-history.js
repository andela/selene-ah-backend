export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('commentHistories', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4
    },
    commentId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    comment_history: {
      allowNull: false,
      type: Sequelize.STRING
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
  down: queryInterface => queryInterface.dropTable('commentHistories')
};

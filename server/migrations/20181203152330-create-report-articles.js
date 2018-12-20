const reportArticles = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ReportArticles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      report: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      articleId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Articles',
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
    });
  },
  down: queryInterface => queryInterface.dropTable('ReportArticles')
};
export default reportArticles;

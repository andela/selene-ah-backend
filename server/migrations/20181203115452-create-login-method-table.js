export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('LoginMethods', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUID
    },
    authMethodUsed: {
      type: Sequelize.STRING,
      allowNull: true
    },
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
  }),

  down: queryInterface => queryInterface.dropTable('LoginMethods')
};

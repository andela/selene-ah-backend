export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Profiles', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.TEXT,
      },
      bio: {
        type: Sequelize.TEXT,

      },
      gender: {
        type: Sequelize.STRING,

      },
      twitterUrl: {
        type: Sequelize.STRING,

      },
      facebookUrl: {
        type: Sequelize.STRING,

      },
      dateOfBirth: {
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.UUID,
        unique: true,
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
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
  down: queryInterface => queryInterface.dropTable('Profiles')
};

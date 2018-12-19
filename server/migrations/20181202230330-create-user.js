export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
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
      emailNotification: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
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
  down: queryInterface => queryInterface.dropTable('Users')
};

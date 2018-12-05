export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Profiles', {
    id: {
      allowNull: false,
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
      allowNull: false,
    },
    bio: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    twitterUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    facebookUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    userId: {
      type: Sequelize.UUID,
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
  }),
  down: queryInterface => queryInterface.dropTable('Profiles')
};

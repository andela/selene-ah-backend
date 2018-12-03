
const Profile = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Profiles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imageurl: {
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

export default Profile;

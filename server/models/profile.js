
const profile = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    role: DataTypes.STRING,
    imageurl: DataTypes.TEXT,
    bio: DataTypes.TEXT,
    gender: DataTypes.STRING,
    twitterUrl: DataTypes.STRING,
    facebookUrl: DataTypes.STRING,
    dateOfBirth: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Error: must be a valid date type',
        }
      }
    }
  });
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Profile;
};

export default profile;

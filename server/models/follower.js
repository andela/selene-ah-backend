/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} followers
 */

export default (sequelize, DataTypes) => {
  const Followers = sequelize.define('Follower', {
    followerId: DataTypes.UUID
  });
  Followers.associate = (models) => {
    Followers.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Followers;
};

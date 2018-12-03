/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} followers
 */

const followers = (sequelize, DataTypes) => {
  const Followers = sequelize.define('Followers', {
    followerId: DataTypes.UUID
  }, {});
  Followers.associate = (models) => {
    Followers.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return followers;
};

export default followers;

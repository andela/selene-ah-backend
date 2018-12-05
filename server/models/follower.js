/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} followers
 */

export default (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    followerId: DataTypes.UUID
  });
  Follower.associate = (models) => {
    Follower.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Follower;
};

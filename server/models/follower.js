/**
 * @param {object} sequelize
 * @param {object} DataTypes
 * @returns {object} followers
 */

export default (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    followerId: DataTypes.UUID
  });
  Follower.associate = (models) => {
    Follower.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return Follower;
};

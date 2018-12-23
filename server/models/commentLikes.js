
/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns {object} - CommentLikes model
 */
export default (sequelize, DataTypes) => {
  const CommentLikes = sequelize.define('CommentLikes', {
    reaction: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  CommentLikes.associate = (models) => {
    CommentLikes.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
    });
    CommentLikes.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return CommentLikes;
};

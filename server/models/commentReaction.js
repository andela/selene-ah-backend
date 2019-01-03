
/**
 *
 * @param {*} sequelize The sequelize object
 * @param {*} DataTypes sequelize datatype
 * @returns {object} - CommentReaction model
 */
export default (sequelize, DataTypes) => {
  const CommentReaction = sequelize.define('CommentReaction', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    reaction: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  CommentReaction.associate = (models) => {
    CommentReaction.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      as: 'commentReaction',
      onDelete: 'CASCADE'
    });
    CommentReaction.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return CommentReaction;
};

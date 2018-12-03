/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @returns {object} - CommentExpression
 */

const commentExpression = (sequelize, DataTypes) => {
  const CommentExpression = sequelize.define('CommentExpression', {
    emotion: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['sad', 'excited', 'like', 'dislike', 'indifferent']],
          msg: 'must be one of these (sad, excited, like, dislike, indifferent)',
        }
      }
    }
  });
  CommentExpression.associate = (models) => {
    CommentExpression.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
    });
    CommentExpression.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return CommentExpression;
};

export default commentExpression;
